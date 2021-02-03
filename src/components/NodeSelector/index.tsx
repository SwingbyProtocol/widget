import { Dropdown, Modal } from '@swingby-protocol/pulsar';
import { buildContext, getBridgeFor, getNetworkDetails } from '@swingby-protocol/sdk';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DefaultRootState, useSelector } from 'react-redux';

import { useSdkContext, useUpdateSdkContext } from '../../modules/store/sdkContext';
import { fetch } from '../../modules/fetch';
import { logger } from '../../modules/logger';

import { getNodeDisplayName } from './getNodeDisplayName';
import { NodeSelectorContainer, StyledButton } from './styled';
import { NodeName } from './NodeName';

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

      const nodes = [...result[context.mode].swapNodes[currentBridge]];
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
      try {
        const startedAt = Date.now();
        const result = await fetch(`${selectedNode}/api/v1/status`);
        if (!result.ok) {
          throw new Error(`Failed to ping node: ${result.status}: ${result.response}`);
        }

        if (cancelled) {
          return;
        }

        const finishedAt = Date.now();
        setPings((pings) => ({ ...pings, [selectedNode]: (finishedAt - startedAt) / 1000 }));
      } catch (e) {
        logger.warn(e, 'Failed to ping node');

        if (cancelled) {
          return;
        }

        setPings((pings) => ({ ...pings, [selectedNode]: null }));
      }
    };

    const id = setInterval(doPing, PING_INTERVAL_MS);
    doPing();

    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [selectedNode]);

  return (
    <NodeSelectorContainer>
      <StyledButton variant="secondary" size="street" onClick={openModal}>
        <NodeName node={selectedNode} ping={pings[selectedNode ?? '']} />
      </StyledButton>

      <Modal open={isModalOpen} onClose={closeModal}>
        <Modal.Content>
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
                closeModal();
              }}
            >
              {getNodeDisplayName(node)}
            </Dropdown.Item>
          ))}
        </Modal.Content>
      </Modal>
    </NodeSelectorContainer>
  );
};