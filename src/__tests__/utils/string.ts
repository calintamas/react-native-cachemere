/* eslint-env jest */
import { addPrefix } from '../../utils/string';

describe('utils/string', () => {
  it('should add a prefix to a string', () => {
    const str = 'test';
    const prefix = 'prefix_';

    const result = addPrefix(str, prefix);

    expect(result).toBe('prefix_test');
  });
});
