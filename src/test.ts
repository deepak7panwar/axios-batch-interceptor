import client from './apiClient';
// All requests should run at the same time and produce only one request
// to the backend. All requests should return or reject.
function runTest() {
  const batchUrl = '/file-batch-api';
  // Should return [{id:"fileid1"},{id:"fileid2"}]
  const c = client();
  c.get(batchUrl, { params: { ids: ['fileid1', 'fileid2'] } })
    .then((d) => console.log(d.data))
    .catch((d) => console.log('error received'));
  // Should return [{id:"fileid2"}]
  c.get(batchUrl, { params: { ids: ['fileid2'] } })
    .then((d) => console.log(d.data))
    .catch((d) => console.log('error received'));
  // Should reject as the fileid3 is missing from the response
  c.get(batchUrl, { params: { ids: ['fileid3'] } })
    .then((d) => console.log(d.data))
    .catch((d) => console.log('error received'));
}

runTest();
setTimeout(() => {
  const batchUrl = '/file-batch-api';
  // Should return [{id:"fileid1"},{id:"fileid2"}]
  const c = client();
  c.get(batchUrl, { params: { ids: ['fileid5', 'fileid7'] } })
    .then((d) => console.log(d.data))
    .catch((d) => console.log('error received'));
  // Should return [{id:"fileid2"}]
  c.get(batchUrl, { params: { ids: ['fileid2'] } })
    .then((d) => console.log(d.data))
    .catch((d) => console.log('error received'));
  // Should reject as the fileid3 is missing from the response
  c.get(batchUrl, { params: { ids: ['fileid3'] } })
    .then((d) => console.log(d.data))
    .catch((d) => console.log('error received'));
}, 1000);
