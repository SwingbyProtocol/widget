import { Dropdown } from '@swingby-protocol/pulsar';
import { getBridgeFor, getNetworkDetails } from '@swingby-protocol/sdk';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import { useSdkContext } from '../../../modules/sdk-context';

import { DropDownNode, DropTargetNode, NodeSelectorView, TextNode } from './styled';

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
          selected={node === selectedNode}
          onClick={() => {
            setSelectedNode(node);
          }}
          key={node}
        >
          {node}
        </Dropdown.Item>
      ))}
    </>
  );
  return (
    <NodeSelectorView>
      <DropDownNode
        target={
          <DropTargetNode size="city">
            <TextNode>{selectedNode}</TextNode>
          </DropTargetNode>
        }
        data-testid="dropdown"
      >
        {nodeItems}
      </DropDownNode>
    </NodeSelectorView>
  );
};
