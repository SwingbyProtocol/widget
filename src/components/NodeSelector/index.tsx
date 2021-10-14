import { Dropdown, Modal } from '@swingby-protocol/pulsar';
import { buildContext, getBridgeFor, getNetworkDetails } from '@swingby-protocol/sdk';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DefaultRootState, useSelector } from 'react-redux';

import { useSdkContext, useUpdateSdkContext } from '../../modules/store/sdkContext';

import { NodeSelectorContainer, StyledButton, StyledModalContent } from './styled';
import { NodeName } from './NodeName';

const UPDATE_LIST_INTERVAL_MS = 60000;
const PING_LIST_INTERVAL_MS = 15000;
const PING_INTERVAL_MS = 5000;

type Props = { swap?: DefaultRootState['swaps'][string] };

export const NodeSelector = ({ swap }: Props) => {
  const context = useSdkContext();
  const currencyDeposit = useSelector((state) => state.swapForm.currencyDeposit);
  const currencyReceiving = useSelector((state) => state.swapForm.currencyReceiving);
  const { updateSdkContext } = useUpdateSdkContext();
  const [isModalOpen, setModalOpen] = useState(false);
  const [pings, setPings] = useState<Record<string, number | null>>({});
  const worker = useRef<Worker | null>(null);

  const closeModal = useCallback(() => setModalOpen(false), []);
  const openModal = useCallback(() => setModalOpen(true), []);

  const currentBridge = useMemo(() => {
    if (swap) {
      return getBridgeFor({ ...swap, context });
    }

    try {
      return getBridgeFor({ context, currencyDeposit, currencyReceiving });
    } catch (e) {
      return null;
    }
  }, [context, swap, currencyDeposit, currencyReceiving]);

  const [nodes, setNodes] = useState<string[]>([
    (currentBridge ? context.servers.swapNode[currentBridge] : null) ?? '',
  ]);
  const selectedNode = useMemo(
    () => (currentBridge ? context.servers.swapNode[currentBridge] : null) ?? '',
    [context, currentBridge],
  );
  const sortedNodes = useMemo(() => {
    const array = [...nodes];
    array.sort((a, b) => (pings[a] ?? Infinity) - (pings[b] ?? Infinity));
    return array;
  }, [nodes, pings]);

  useEffect(() => {
    if (!worker.current) {
      worker.current = new Worker('/ping-node.js', { type: 'module' });
    }

    let cancelled = false;
    const listener = ({ data: { node, pingMs } }: WorkerEventMap['message']) => {
      if (cancelled) return;
      setPings((pings) => ({ ...pings, [node]: pingMs }));
    };

    worker.current?.addEventListener('message', listener);
    return () => {
      cancelled = true;
      worker.current?.removeEventListener('message', listener);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const updateList = async () => {
      if (!currentBridge) return;

      const result = await getNetworkDetails({ mode: context.mode, bridge: currentBridge });
      if (cancelled) {
        return;
      }

      const nodes = [...result.swapNodes]
        .map((it) => it.restUri)
        .filter((it): it is string => {
          try {
            return new URL(it!).protocol === 'https:';
          } catch (e) {
            return false;
          }
        });
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
    const doPing = () => {
      worker.current?.postMessage({ node: selectedNode });
    };

    const id = setInterval(doPing, PING_INTERVAL_MS);
    doPing();

    return () => clearInterval(id);
  }, [selectedNode]);

  useEffect(() => {
    if (!isModalOpen) return;

    const doPingAll = () => {
      nodes.forEach((it) => {
        worker.current?.postMessage({ node: it });
      });
    };

    const id = setInterval(doPingAll, PING_LIST_INTERVAL_MS);
    doPingAll();

    return () => clearInterval(id);
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
                if (!currentBridge) return;

                updateSdkContext(
                  await buildContext({
                    ...context,
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
