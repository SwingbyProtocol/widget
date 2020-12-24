import { getIpInfo } from '@swingby-protocol/ip-check';
import React, { useContext } from 'react';

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;
export type IpInfoContextValue = {
  blockRegion: boolean;
  clientIp: string | null;
  ipInfo: ThenArg<ReturnType<typeof getIpInfo>> | null;
};

const Context = React.createContext<IpInfoContextValue>({
  blockRegion: false,
  clientIp: null,
  ipInfo: null,
});

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
