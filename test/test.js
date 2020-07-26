
'use strict';

const expect = require('chai').expect;
const ui = require('../dist/index');

describe('moonlight-ui function add test', () => {
  it('should return 2', () => {
    const result = ui.add(1, 1);
    expect(result).to.equal(2);
  });
});

describe('moonlight-ui function makePy test', () => {
  it('should return mayun', () => {
    const result = ui.makePy('马云');
    expect(result).to.equal('mayun');
  });
});
