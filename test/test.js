
'use strict';

const expect = require('chai').expect;
const ui = require('../dist/index');

describe('moonlight-ui function add test', () => {
  it('should return 2', () => {
    const result = ui.add(1, 1);
    expect(result).to.equal(2);
  });
});
