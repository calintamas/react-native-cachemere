import { addPrefix } from '../utils'

describe('Should add a prefix to a string', () => {
  const tests = [
    {
      before: 'test',
      after: '__cachemere__test'
    },
    {
      before: '_test',
      after: '__cachemere___test'
    },
    {
      before: 'test_',
      after: '__cachemere__test_'
    },
    {
      before: '',
      after: '__cachemere__'
    }
  ];

  tests.forEach((item) => {
    test(`Adding prefix to ${item.before} should be ${item.after}`, () => {
      expect(addPrefix(item.before)).toBe(item.after)
    });
  })
});
