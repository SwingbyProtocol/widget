import { Dropdown } from '@swingby-protocol/pulsar';
import { getNetworkDetails } from '@swingby-protocol/sdk';
import { useState } from 'react';

import { useSdkContext } from '../../../modules/sdk-context';

import { DropDownNode, DropTargetNode, NodeSelectorView, TextNode } from './styled';

export const NodeSelector = () => {
  const context = useSdkContext();
  const mode = context.mode;
  const bridge = context.servers.swapNode.btc_erc;

  const [nodes, setNodes] = useState([bridge]);
  const [selectedNode, setSelectedNode] = useState(nodes[0]);

  getNetworkDetails().then((networkDetails) => {
    const bridge = networkDetails[mode].swapNodes.btc_erc;
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
