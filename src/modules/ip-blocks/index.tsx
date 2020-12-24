import { getIpInfo } from '@swingby-protocol/ip-check';
import React, { useContext } from 'react';

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;
export type IpInfoContextValue = {
  blockRegion: boolean;
  clientIp: string;
  ipInfo: ThenArg<ReturnType<typeof getIpInfo>>;
};

const Context = React.createContext<IpInfoContextValue>((null as unknown) as IpInfoContextValue);

export const useIpInfo = () => useContext(Context);

export const IpInfoProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: IpInfoContextValue;
}) => {
  return <Context.Provider value={value}>{children}</Context.Provider>;
};
