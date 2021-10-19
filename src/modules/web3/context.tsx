import React, { useContext, useMemo, useEffect, useState } from 'react';
import type { Wallet } from 'bnc-onboard/dist/src/interfaces'; // eslint-disable-line import/no-internal-modules
import { useTheme } from 'styled-components';
import { getBridgeFor } from '@swingby-protocol/sdk';
import { useSelector } from 'react-redux';

import { useSdkContext } from '../store/sdkContext';
import { useDetails } from '../details';
import { logger } from '../logger';

import { initOnboard } from './onboard';

const Context = React.createContext<{
  address: string | null;
  wallet: Wallet | null;
  onboard: ReturnType<typeof initOnboard> | null;
}>({ address: null, wallet: null, onboard: null });

export const OnboardProvider = ({ children }: { children?: React.ReactNode }) => {
  const context = useSdkContext();
  const [address, setAddress] = useState<string | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [onboard, setOnboard] = useState<ReturnType<typeof initOnboard> | null>(null);
  const currencyDeposit = useSelector((state) => state.swapForm.currencyDeposit);
  const currencyReceiving = useSelector((state) => state.swapForm.currencyReceiving);
  const { swap } = useDetails();
  const theme = useTheme();

  const currentBridge = useMemo(() => {
    if (swap) {
      return getBridgeFor({ ...swap, context });
    }

    try {
      return getBridgeFor({ context, currencyDeposit, currencyReceiving });
    } catch (err) {
      return null;
    }
  }, [context, swap, currencyDeposit, currencyReceiving]);

  useEffect(() => {
    if (!currentBridge) {
      logger.debug('"currentBridge" is not defined, will skip');
      return;
    }

    setOnboard(
      initOnboard({
        mode: context.mode,
        bridge: currentBridge,
        subscriptions: { address: setAddress, wallet: setWallet },
      }),
    );
  }, [context, currentBridge]);

  useEffect(() => {
    onboard?.config({ darkMode: theme.pulsar.id !== 'PulsarLight' });
  }, [onboard, theme]);

  const value = useMemo(() => ({ address, wallet, onboard }), [address, wallet, onboard]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useOnboard = () => useContext(Context);
