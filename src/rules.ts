/** Deterministic air-traffic rules, independently testable without Phaser. */
export type Point = Readonly<{ x: number; y: number }>;
export type MissionState = 'active' | 'victory' | 'failure';

export function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** Move by at most speed*deltaSeconds; never overshoot the target. */
export function moveToward(from: Point, target: Point, speed: number, deltaSeconds: number): Point {
  if (!Number.isFinite(speed) || !Number.isFinite(deltaSeconds) || speed < 0 || deltaSeconds < 0) {
    throw new RangeError('Speed and elapsed time must be finite and nonnegative');
  }
  const separation = distance(from, target);
  if (separation === 0) return { ...target };
  const fraction = Math.min(1, speed * deltaSeconds / separation);
  return { x: from.x + (target.x - from.x) * fraction, y: from.y + (target.y - from.y) * fraction };
}

export function withinRadius(a: Point, b: Point, radius: number): boolean {
  return radius >= 0 && Number.isFinite(radius) && distance(a, b) <= radius;
}

/** Only an aircraft granted clearance can land safely. */
export function landingResult(cleared: boolean): 'landed' | 'missed' {
  return cleared ? 'landed' : 'missed';
}

export function missionState(landed: number, missed: number, handled: number, target: number, maxMisses: number): MissionState {
  if (!Number.isInteger(landed) || !Number.isInteger(missed) || !Number.isInteger(handled) ||
      !Number.isInteger(target) || !Number.isInteger(maxMisses) ||
      landed < 0 || missed < 0 || handled < 0 || target <= 0 || maxMisses <= 0) {
    throw new RangeError('Invalid mission counters');
  }
  if (missed >= maxMisses) return 'failure';
  if (landed >= target) return 'victory';
  if (handled >= target + maxMisses - 1) return 'failure';
  return 'active';
}

/**
 * Estimated seconds until the aircraft enters the landing circle.
 * Speed and radius must be finite; this is a constant-speed game estimate.
 */
export function estimatedArrivalSeconds(from: Point, runway: Point, speed: number, radius = 0): number {
  if (!Number.isFinite(speed) || speed <= 0 || !Number.isFinite(radius) || radius < 0 ||
      ![from.x, from.y, runway.x, runway.y].every(Number.isFinite)) {
    throw new RangeError('Arrival estimate requires finite positions, positive speed and nonnegative radius');
  }
  return Math.max(0, distance(from, runway) - radius) / speed;
}
