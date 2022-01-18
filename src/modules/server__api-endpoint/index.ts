import { NextApiRequest, NextApiResponse } from 'next';
import { StatusCodes } from 'http-status-codes';
import { SkybridgeBridge, SkybridgeMode, SKYBRIDGE_BRIDGES } from '@swingby-protocol/sdk';
import { DateTime, Duration } from 'luxon';

import { corsMiddleware } from '../server__cors';
import { logger as loggerBase } from '../logger';

const WARN_IF_SPENT_MORE_THAN = Duration.fromObject({ seconds: 30 });

export class InvalidParamError extends Error {}

export class InvalidMethodError extends Error {}

export class NotAuthenticatedError extends Error {}

export const getStringParam = <T extends string>({
  req,
  name,
  from,
  oneOf,
  defaultValue,
}: {
  req: NextApiRequest;
  name: string;
  from: 'query' | 'body';
  oneOf?: T[] | readonly T[];
  defaultValue?: T;
}): T => {
  try {
    const value = req[from]?.[name];
    if (typeof value !== 'string') {
      throw new InvalidParamError(`"${name}" must be a string`);
    }

    if (oneOf && !oneOf.includes(value as any)) {
      throw new InvalidParamError(`"${name}" must be one of: ${oneOf.join(', ')}`);
    }

    return value as T;
  } catch (e) {
    if (typeof defaultValue !== 'undefined') {
      return defaultValue;
    }

    throw e;
  }
};

export const createEndpoint = <T extends any = any>({
  logId,
  fn,
}: {
  logId: string;
  fn: (params: {
    req: NextApiRequest;
    res: NextApiResponse<T>;
    mode: SkybridgeMode;
    bridge: SkybridgeBridge;
    logger: typeof loggerBase;
  }) => void | Promise<void>;
}) => async (req: NextApiRequest, res: NextApiResponse<T>) => {
  const startedAt = DateTime.utc();

  const ctx = {
    mode: undefined as SkybridgeMode | undefined,
    bridge: undefined as SkybridgeBridge | undefined,
    logger: loggerBase.child({ logId }),
  };

  try {
    await corsMiddleware({ req, res });

    return await fn({
      req,
      res,
      get mode() {
        if (!ctx.mode) {
          ctx.mode = getStringParam<SkybridgeMode>({
            req,
            from: 'query',
            name: 'mode',
            oneOf: ['test', 'production'],
            defaultValue: 'test',
          });

          ctx.logger = ctx.logger.child({ mode: ctx.mode });
        }

        return ctx.mode;
      },
      get bridge() {
        if (!ctx.bridge) {
          ctx.bridge = getStringParam({
            req,
            from: 'query',
            name: 'bridge',
            oneOf: SKYBRIDGE_BRIDGES,
          });

          ctx.logger = ctx.logger.child({ bridge: ctx.bridge });
        }

        return ctx.bridge;
      },
      get logger() {
        return ctx.logger;
      },
    });
  } catch (e: any) {
    const message = e?.message || '';

    if (e instanceof InvalidParamError) {
      ctx.logger.trace(e);
      res.status(StatusCodes.BAD_REQUEST).json({ message } as any);
      return;
    }

    if (e instanceof InvalidParamError) {
      ctx.logger.trace(e);
      res.status(StatusCodes.METHOD_NOT_ALLOWED).json({ message } as any);
      return;
    }

    if (e instanceof NotAuthenticatedError) {
      ctx.logger.trace(e);
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: message || 'No authentication was provided' } as any);
      return;
    }

    ctx.logger.error(e);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong' } as any);
  } finally {
    const spent = DateTime.utc().diff(startedAt);

    const level: keyof typeof ctx.logger =
      spent.as('milliseconds') > WARN_IF_SPENT_MORE_THAN.as('milliseconds') ? 'warn' : 'info';

    ctx.logger[level]('Endpoint done in %dms!', spent.as('milliseconds'));
  }
};
