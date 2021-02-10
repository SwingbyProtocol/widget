import React, { useContext } from 'react';

type ContextType = { shouldBlockIp: boolean; ip: string | null };

const Context = React.createContext<ContextType>({
  shouldBlockIp: false,
  ip: null,
});

export const useIpInfo = () => useContext(Context);

export const IpInfoProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: ContextType;
}) => {
  return <Context.Provider value={value}>{children}</Context.Provider>;
};
