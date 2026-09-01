import * as THREE from 'three';
import { JourneyCheckpoint, CheckpointActivationState, CheckpointPhase } from './types';

// Pre-allocated static vectors to eliminate GC pressure and allocations in 60-120fps animation loops
export const POOLED_VEC3_A = new THREE.Vector3();
export const POOLED_VEC3_B = new THREE.Vector3();
export const POOLED_VEC3_C = new THREE.Vector3();

/**
 * Smooth step interpolation helper
 */
export function smoothstep(min: number, max: number, value: number): number {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

/**
 * Calculates a checkpoint's real-time activation state from current normalized journey progress.
 * Does not allocate new objects.
 */
export function evaluateCheckpointState(
  progress: number,
  checkpoint: JourneyCheckpoint
): CheckpointActivationState {
  const { approach, read, depart } = checkpoint.range;
  const p = Math.max(0, Math.min(1, progress));

  let phase: CheckpointPhase = 'idle';
  let phaseProgress = 0;
  let readability = 0;
  let opacity = 0;
  let scale = 0.9;

  if (p >= approach[0] && p < approach[1]) {
    phase = 'approach';
    phaseProgress = (p - approach[0]) / Math.max(0.0001, approach[1] - approach[0]);
    opacity = smoothstep(approach[0], approach[1], p);
    scale = 0.9 + opacity * 0.1;
    readability = opacity * 0.7;
  } else if (p >= read[0] && p <= read[1]) {
    phase = 'read';
    phaseProgress = (p - read[0]) / Math.max(0.0001, read[1] - read[0]);
    opacity = 1.0;
    scale = 1.0;
    readability = 1.0;
  } else if (p > depart[0] && p <= depart[1]) {
    phase = 'depart';
    phaseProgress = (p - depart[0]) / Math.max(0.0001, depart[1] - depart[0]);
    opacity = 1.0 - smoothstep(depart[0], depart[1], p);
    scale = 0.9 + opacity * 0.1;
    readability = opacity * 0.6;
  } else {
    phase = 'idle';
    opacity = 0;
    scale = 0.9;
    readability = 0;
  }

  const isCurrent = p >= approach[0] && p <= depart[1];

  return {
    id: checkpoint.id,
    phase,
    phaseProgress,
    readability,
    opacity,
    scale,
    isCurrent,
  };
}

/**
 * Maps linear scroll progress to a non-linear journey progress that naturally decelerates
 * through readable zones so checkpoints have ample readable dwell time without halting the scroll.
 * @param progress Linear progress (0..1)
 * @param checkpoints Array of journey checkpoints
 * @param strength Dwell strength factor (0.0 = linear, 0.4 = subtle deceleration)
 */
export function applyDwellDeceleration(
  progress: number,
  checkpoints: JourneyCheckpoint[],
  strength = 0.35
): number {
  if (strength <= 0 || checkpoints.length === 0) return progress;
  const p = Math.max(0, Math.min(1, progress));

  for (let i = 0; i < checkpoints.length; i++) {
    const cp = checkpoints[i];
    const [rStart, rEnd] = cp.range.read;
    const rMid = (rStart + rEnd) / 2;
    const rHalfWidth = (rEnd - rStart) / 2;

    if (p >= rStart && p <= rEnd && rHalfWidth > 0.001) {
      // Offset from center normalized to [-1, 1]
      const rel = (p - rMid) / rHalfWidth;
      // S-curve deceleration: compression toward the center
      const compressed = Math.sin((rel * Math.PI) / 2);
      const easedP = rMid + compressed * rHalfWidth * (1 - strength);
      // Blend with linear
      return p * (1 - strength) + easedP * strength;
    }
  }

  return p;
}

/**
 * Finds the currently active checkpoint by normalized progress.
 */
export function getActiveCheckpoint<T>(
  progress: number,
  checkpoints: JourneyCheckpoint<T>[]
): JourneyCheckpoint<T> {
  const p = Math.max(0, Math.min(1, progress));

  for (let i = 0; i < checkpoints.length; i++) {
    const cp = checkpoints[i];
    if (p >= cp.range.approach[0] && p <= cp.range.depart[1]) {
      return cp;
    }
  }

  // Fallback to nearest checkpoint by normalizedPosition
  let closest = checkpoints[0];
  let minDiff = Math.abs(p - closest.normalizedPosition);
  for (let i = 1; i < checkpoints.length; i++) {
    const diff = Math.abs(p - checkpoints[i].normalizedPosition);
    if (diff < minDiff) {
      minDiff = diff;
      closest = checkpoints[i];
    }
  }

  return closest;
}
