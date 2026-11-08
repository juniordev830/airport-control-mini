/** Scoring for the fictional radar arcade game (not real air-traffic rules). */
export type ScoreState = Readonly<{ points: number; streak: number }>;
export type LandingEvent = 'landed' | 'missed';

export function initialScore(): ScoreState {
  return { points: 0, streak: 0 };
}

/**
 * Authorized landings grant 100 points, plus 25 for each consecutive
 * success up to five. A missed clearance resets the streak and subtracts
 * 60 points without allowing a negative score.
 */
export function scoreEvent(state: ScoreState, event: LandingEvent): ScoreState {
  if (!state || !Number.isSafeInteger(state.points) || state.points < 0 ||
      !Number.isSafeInteger(state.streak) || state.streak < 0 || state.streak > 5) {
    throw new RangeError('Invalid scoring state');
  }
  if (event !== 'landed' && event !== 'missed') {
    throw new RangeError('Unexpected landing event');
  }
  if (event === 'missed') {
    return { points: Math.max(0, state.points - 60), streak: 0 };
  }
  const streak = Math.min(5, state.streak + 1);
  const reward = 100 + (streak - 1) * 25;
  if (!Number.isSafeInteger(state.points + reward)) {
    throw new RangeError('Score exceeded safe integer bounds');
  }
  return { points: state.points + reward, streak };
}
