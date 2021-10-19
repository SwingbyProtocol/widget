export const getNodeDisplayName = (node: string | null) => {
  try {
    if (!node) {
      return null;
    }

    return new URL(node).host;
  } catch (err) {
    return node;
  }
};
