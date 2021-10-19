import { SkybridgeCoin } from '@swingby-protocol/sdk';
import { DateTime } from 'luxon';
import { Reducer } from 'redux';

import { LocalStorage } from '../../env';
import { logger } from '../../logger';

enum Actions {
  Set = 'SwapForm/SET',
  SetStep = 'SwapForm/SET_STEP',
  Clear = 'SwapForm/CLEAR',
}

const initialState = {
  step: 'step-amounts' as 'step-amounts' | 'step-address',
  currencyDeposit: 'BTC' as SkybridgeCoin,
  currencyReceiving: 'WBTC' as SkybridgeCoin,
  amountDesired: '',
  addressReceiving: '',
  affiliateCode: getStoredAffiliateCode() as string | null,
};

type State = typeof initialState;

export const swapForm: Reducer<State, Action> = (state = initialState, action) => {
  if (action.type === Actions.Clear) {
    return initialState;
  }

  if (action.type === Actions.Set) {
    return { ...state, ...action.data };
  }

  if (action.type === Actions.SetStep) {
    return { ...state, step: action.data };
  }

  return state;
};

export const actionClearSwapFormData = () => ({ type: Actions.Clear } as const);

export const actionSetSwapFormData = (data: Partial<Omit<State, 'step'>>) =>
  ({ type: Actions.Set, data } as const);

export const actionSetSwapFormStep = (data: State['step']) =>
  ({ type: Actions.SetStep, data } as const);

type Action =
  | ReturnType<typeof actionSetSwapFormData>
  | ReturnType<typeof actionClearSwapFormData>
  | ReturnType<typeof actionSetSwapFormStep>;

function getStoredAffiliateCode(): string | null {
  try {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    const affiliateCode = localStorage.getItem(LocalStorage.AffiliateCode);
    const savedAtStr = localStorage.getItem(LocalStorage.AffiliateCodeSavedAt);
    const savedAt = DateTime.fromISO(savedAtStr ?? '', { zone: 'utc' });

    if (!affiliateCode) {
      logger.debug('No affiliate code saved in local storage');
      return null;
    }

    if (!savedAt.isValid) {
      throw new Error(
        `Could not read when the latest affiliate code was saved into local storage: "${savedAtStr}"`,
      );
    }

    if (Math.abs(savedAt.diffNow().as('days')) > 30) {
      logger.debug('Affiliate code stored in local storage is too old: "%s"', savedAt.toISO());
      return null;
    }

    logger.debug(
      'Read affiliate code "%s" from local storage (stored at "%s")',
      affiliateCode,
      savedAt.toISO(),
    );

    return affiliateCode;
  } catch (err) {
    logger.error({ err }, 'Could not read stored affiliate code');
    return null;
  }
}
