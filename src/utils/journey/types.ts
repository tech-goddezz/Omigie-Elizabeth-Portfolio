import { LucideIcon } from 'lucide-react';

export type CheckpointPhase = 'approach' | 'read' | 'depart' | 'idle';

export interface CheckpointRange {
  approach: [number, number];
  read: [number, number];
  depart: [number, number];
}

export interface JourneyCheckpoint<T = unknown> {
  id: string;
  label: string;
  number?: string;
  normalizedPosition: number; // 0.0 to 1.0 along the journey
  range: CheckpointRange;
  data?: T;
}

export interface CheckpointActivationState {
  id: string;
  phase: CheckpointPhase;
  phaseProgress: number; // 0.0 to 1.0 within the current phase
  readability: number; // 0.0 to 1.0 (peaks at 1.0 in the read zone)
  opacity: number; // 0.0 to 1.0
  scale: number; // 0.9 to 1.0
  isCurrent: boolean;
}

export interface JourneyDeviceConfig {
  desktopHeightVh: number;
  tabletHeightVh: number;
  mobileHeightVh: number;
  springStiffness?: number;
  springDamping?: number;
  cameraLerpFactor?: number;
  dwellDeceleration?: number; // 0.0 (linear) to 1.0 (strong dwell in read zones)
}

export interface ConceptLocationData {
  tagline: string;
  description: string;
  icon: LucideIcon;
  color: string;
  glowColor: string;
  pos: [number, number, number];
  cameraStopZ: number;
}
