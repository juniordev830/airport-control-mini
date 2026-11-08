import test from 'node:test';
import assert from 'node:assert/strict';
import { initialScore, scoreEvent } from '../dist/scoring.js';

test('successful landing grants base points and increases streak', () => {
  const first = scoreEvent(initialScore(), 'landed');
  assert.deepEqual(first, { points: 100, streak: 1 });
  const second = scoreEvent(first, 'landed');
  assert.deepEqual(second, { points: 225, streak: 2 });
});

test('streak reward caps at five consecutive successful landings', () => {
  let state = initialScore();
  for (let i = 0; i < 12; i += 1) state = scoreEvent(state, 'landed');
  assert.deepEqual(state, { points: 1600, streak: 5 });
});

test('misses reset streak and never make score negative', () => {
  assert.deepEqual(scoreEvent(initialScore(), 'missed'), { points: 0, streak: 0 });
  const first = scoreEvent(initialScore(), 'landed');
  const missed = scoreEvent(first, 'missed');
  assert.deepEqual(missed, { points: 40, streak: 0 });
  assert.deepEqual(scoreEvent(missed, 'landed'), { points: 140, streak: 1 });
});

test('reducer does not mutate previous score snapshot', () => {
  const before = Object.freeze({ points: 250, streak: 3 });
  const after = scoreEvent(before, 'landed');
  assert.deepEqual(before, { points: 250, streak: 3 });
  assert.deepEqual(after, { points: 400, streak: 4 });
});

test('invalid state, events and integer overflow are rejected', () => {
  for (const state of [
    { points: -1, streak: 0 },
    { points: NaN, streak: 0 },
    { points: 5, streak: 6 },
    { points: 0, streak: 1.25 }
  ]) {
    assert.throws(() => scoreEvent(state, 'landed'), RangeError);
  }
  assert.throws(() => scoreEvent(initialScore(), 'unknown'), RangeError);
  assert.throws(() => scoreEvent({ points: Number.MAX_SAFE_INTEGER, streak: 5 }, 'landed'), RangeError);
});
