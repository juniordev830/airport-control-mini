import test from 'node:test';
import assert from 'node:assert/strict';
import { distance, moveToward, withinRadius, landingResult, missionState } from '../dist/rules.js';

test('distance uses coordinates', () => assert.equal(distance({x:0,y:0},{x:3,y:4}),5));
test('movement obeys speed without overshooting', () => {
  assert.deepEqual(moveToward({x:0,y:0},{x:100,y:0},20,1),{x:20,y:0});
  assert.deepEqual(moveToward({x:95,y:0},{x:100,y:0},20,1),{x:100,y:0});
  assert.throws(()=>moveToward({x:0,y:0},{x:1,y:1},-1,1),RangeError);
});
test('runway proximity includes boundary', () => {
  assert.equal(withinRadius({x:0,y:0},{x:3,y:4},5),true);
  assert.equal(withinRadius({x:0,y:0},{x:3,y:4},4.99),false);
});
test('landing requires authorization', () => {
  assert.equal(landingResult(true),'landed');
  assert.equal(landingResult(false),'missed');
});
test('mission reaches win or failure according to counts', () => {
  assert.equal(missionState(0,0,0,8,3),'active');
  assert.equal(missionState(8,0,8,8,3),'victory');
  assert.equal(missionState(2,3,5,8,3),'failure');
  assert.equal(missionState(7,2,9,8,3),'active');
  assert.equal(missionState(7,2,10,8,3),'failure');
  assert.throws(()=>missionState(-1,0,0,8,3),RangeError);
});
