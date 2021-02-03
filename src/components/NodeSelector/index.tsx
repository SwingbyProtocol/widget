import { Dropdown, Modal } from '@swingby-protocol/pulsar';
import { buildContext, getBridgeFor, getNetworkDetails } from '@swingby-protocol/sdk';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DefaultRootState, useSelector } from 'react-redux';

import { useSdkContext, useUpdateSdkContext } from '../../modules/store/sdkContext';

import { NodeSelectorContainer, StyledButton, StyledModalContent } from './styled';
import { NodeName } from './NodeName';
import { pingNode } from './pingNode';

const UPDATE_LIST_INTERVAL_MS = 30000;
const PING_INTERVAL_MS = 15000;

type Props = { swap?: DefaultRootState['swaps'][string] };

export const NodeSelector = ({ swap }: Props) => {
  const context = useSdkContext();
  const currencyDeposit = useSelector((state) => state.swapForm.currencyDeposit);
  const currencyReceiving = useSelector((state) => state.swapForm.currencyReceiving);
  const { updateSdkContext } = useUpdateSdkContext();
  const [isModalOpen, setModalOpen] = useState(false);
  const [pings, setPings] = useState<Record<string, number | null>>({});

  const closeModal = useCallback(() => setModalOpen(false), []);
  const openModal = useCallback(() => setModalOpen(true), []);

  const currentBridge = useMemo(() => {
    if (swap) {
      return getBridgeFor({ ...swap, context });
    }

    return getBridgeFor({ context, currencyDeposit, currencyReceiving });
  }, [context, swap, currencyDeposit, currencyReceiving]);

  const [nodes, setNodes] = useState<string[]>([context.servers.swapNode[currentBridge] ?? '']);
  const selectedNode = useMemo(() => context.servers.swapNode[currentBridge] ?? '', [
    context,
    currentBridge,
  ]);
  const sortedNodes = useMemo(() => {
    const array = [...nodes];
    array.sort((a, b) => (pings[a] ?? Infinity) - (pings[b] ?? Infinity));
    return array;
  }, [nodes, pings]);

  useEffect(() => {
    let cancelled = false;
    const updateList = async () => {
      const result = await getNetworkDetails();
      if (cancelled) {
        return;
      }

      const nodes = [...result[context.mode].swapNodes[currentBridge]].filter((it) => !!it);
      nodes.sort();

      setNodes(nodes);
    };

    const id = setInterval(updateList, UPDATE_LIST_INTERVAL_MS);
    updateList();

    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [context.mode, currentBridge]);

  useEffect(() => {
    if (!selectedNode) return;
    let cancelled = false;

    const doPing = async () => {
      const ping = await pingNode(selectedNode);
      if (cancelled) return;
      setPings((pings) => ({ ...pings, [selectedNode]: ping }));
    };

    const id = setInterval(doPing, PING_INTERVAL_MS);
    doPing();

    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [selectedNode]);

  useEffect(() => {
    if (!isModalOpen) return;
    let cancelled = false;

    const doPingAll = async () => {
      await Promise.all(
        nodes.map(async (it) => {
          const ping = await pingNode(it);
          if (cancelled) return;
          setPings((pings) => ({ ...pings, [it]: ping }));
        }),
      );
    };

    const id = setInterval(doPingAll, PING_INTERVAL_MS);
    doPingAll();

    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [isModalOpen, nodes]);

  return (
    <NodeSelectorContainer>
      <StyledButton variant="secondary" size="street" onClick={openModal}>
        <NodeName node={selectedNode} pingMs={pings[selectedNode]} />
      </StyledButton>

      <Modal open={isModalOpen} onClose={closeModal}>
        <StyledModalContent>
          {sortedNodes.map((node) => (
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
                closeModal();
              }}
            >
              <NodeName node={node} pingMs={pings[node]} />
            </Dropdown.Item>
          ))}
        </StyledModalContent>
      </Modal>
    </NodeSelectorContainer>
  );
};
