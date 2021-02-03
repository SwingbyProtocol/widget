onmessage = function ({ data }) {
  if (typeof data !== 'object' || typeof data.node !== 'string') {
    console.debug('Invalid message received', data);
  }

  const node = data.node;
  ping(node)
    .then((pingMs) => {
      postMessage({ node, pingMs });
    })
    .catch((err) => {
      console.warn('Failed to ping node', err);
      postMessage({ node, pingMs: null });
    });
};

function ping(node) {
  const startedAt = Date.now();
  return fetch(`${node}/api/v1/status`)
    .then((result) => {
      if (!result.ok) {
        throw new Error(`Failed to ping node: ${result.status}: ${result.response}`);
      }
    })
    .then(() => Date.now() - startedAt);
}
