import { Dropdown } from '@swingby-protocol/pulsar';
import { getBridgeFor, getNetworkDetails } from '@swingby-protocol/sdk';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import { useSdkContext } from '../../modules/sdk-context';

import { DropTargetNode, NodeSelectorView, TextNode } from './styled';

export const NodeSelector = () => {
  const context = useSdkContext();
  const mode = context.mode;
  const currencyDeposit = useSelector((state) => state.swapForm.currencyDeposit);
  const currencyReceiving = useSelector((state) => state.swapForm.currencyDeposit);

  const bridgeFor = getBridgeFor({ context, currencyDeposit, currencyReceiving });

  const [nodes, setNodes] = useState([context.servers.swapNode[bridgeFor]]);
  const [selectedNode, setSelectedNode] = useState(nodes[0]);

  getNetworkDetails().then((networkDetails) => {
    const bridge = networkDetails[mode].swapNodes[bridgeFor];
    setNodes(bridge);
  });

  const nodeItems = (
    <>
      {nodes.map((node) => (
        <Dropdown.Item
          key={node}
          selected={node === selectedNode}
          onClick={() => {
            setSelectedNode(node);
            // Todo: Add logic for change the node
          }}
        >
          {node}
        </Dropdown.Item>
      ))}
    </>
  );
  return (
    <NodeSelectorView>
      <Dropdown
        target={
          <DropTargetNode size="city">
            <TextNode>{selectedNode}</TextNode>
          </DropTargetNode>
        }
      >
        {nodeItems}
      </Dropdown>
    </NodeSelectorView>
  );
};
