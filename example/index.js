const sleep = (timeout) =>
  new Promise((resolve) => setTimeout(resolve, timeout));

const mockRequest = async () => {
  await sleep(500);
  return {
    data: {
      foo: 'bar'
    }
  };
};

const cache = new Map();

const fetchUserData = async () => {
  const url = 'https://some-url';

  const cacheData = cache.get(url);
  if (cacheData) {
    console.log('cache hit ✅\n');
    return cacheData;
  }

  console.log('no cache hit ✖️\n');
  const request = mockRequest();
  cache.set(url, request);
  return request;
};

const fetchUserData_v1 = async () => {
  const url = 'https://some-url';

  const cacheData = cache.get(url);
  if (cacheData) {
    console.log('cache hit ✅\n');
    return cacheData;
  }

  console.log('no cache hit ✖️\n');
  const res = await mockRequest();
  cache.set(url, res);
  return res;
};

const benchmark = async (request) => {
  console.log('starting 1st request...');
  console.log('it will take 500ms to finish');
  console.time('1');
  request()
    .catch(() => {})
    .finally((res) => {
      console.timeEnd('1');
    });

  const delay = 200;
  console.log(`sleeping ${delay} ms...\n`);
  await sleep(delay);

  console.log('starting 2nd request...');
  console.time('2');
  return request()
    .catch(() => {})
    .finally(() => console.timeEnd('2'));
};

const main = async () => {
  console.log('Before:\n');
  await benchmark(fetchUserData_v1);
  console.log('\n\n');

  cache.clear();
  console.log('After:\n');
  await benchmark(fetchUserData);
};

main();
