onmessage = function (e) {
  console.log('Message received from main script', e);
  const node = e.data.node;

  const startedAt = Date.now();
  fetch(`${node}/api/v1/status`)
    .then((result) => {
      if (!result.ok) {
        throw new Error(`Failed to ping node: ${result.status}: ${result.response}`);
      }
    })
    .then(() => {
      postMessage({ node, pingMs: Date.now() - startedAt });
    })
    .catch((err) => {
      console.warn('Failed to ping node', err);
      postMessage({ node, pingMs: null });
    });
};
