import { Dropdown, Button } from '@swingby-protocol/pulsar';
import { buildContext, getBridgeFor, getNetworkDetails } from '@swingby-protocol/sdk';
import { useEffect, useMemo, useState } from 'react';
import { DefaultRootState, useSelector } from 'react-redux';

import { useSdkContext, useUpdateSdkContext } from '../../modules/store/sdkContext';

import { getNodeDisplayName } from './getNodeDisplayName';
import { NodeSelectorContainer } from './styled';

const UPDATE_LIST_INTERVAL_MS = 30000;

type Props = { swap?: DefaultRootState['swaps'][string] };

export const NodeSelector = ({ swap }: Props) => {
  const context = useSdkContext();
  const currencyDeposit = useSelector((state) => state.swapForm.currencyDeposit);
  const currencyReceiving = useSelector((state) => state.swapForm.currencyReceiving);
  const { updateSdkContext } = useUpdateSdkContext();

  const currentBridge = useMemo(() => {
    if (swap) {
      return getBridgeFor({ ...swap, context });
    }

    return getBridgeFor({ context, currencyDeposit, currencyReceiving });
  }, [context, swap, currencyDeposit, currencyReceiving]);

  const [nodes, setNodes] = useState([context.servers.swapNode[currentBridge]]);
  const selectedNode = useMemo(() => context.servers.swapNode[currentBridge], [
    context,
    currentBridge,
  ]);

  useEffect(() => {
    let cancelled = false;
    const updateList = async () => {
      const result = await getNetworkDetails();
      if (cancelled) {
        return;
      }

      setNodes(result[context.mode].swapNodes[currentBridge]);
    };

    const id = setInterval(updateList, UPDATE_LIST_INTERVAL_MS);
    updateList();

    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [context.mode, currentBridge]);

  return (
    <NodeSelectorContainer>
      <Dropdown
        target={
          <Button variant="secondary" size="street">
            {getNodeDisplayName(selectedNode)}
          </Button>
        }
      >
        {nodes.map((node) => (
          <Dropdown.Item
            key={node}
            selected={node === selectedNode}
            onClick={async () => {
              updateSdkContext(
                await buildContext({
                  mode: context.mode,
                  servers: { swapNode: { [currentBridge]: node } },
                }),
              );
            }}
          >
            {getNodeDisplayName(node)}
          </Dropdown.Item>
        ))}
      </Dropdown>
    </NodeSelectorContainer>
  );
};
