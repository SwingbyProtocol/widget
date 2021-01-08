import { IpInfoFromRequest } from '@swingby-protocol/ip-check';
import React, { useContext } from 'react';

const Context = React.createContext<IpInfoFromRequest>({
  shouldBlockRegion: false,
  ip: null,
  info: null,
});

export const useIpInfo = () => useContext(Context);

export const IpInfoProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: IpInfoFromRequest;
}) => {
  return <Context.Provider value={value}>{children}</Context.Provider>;
};
