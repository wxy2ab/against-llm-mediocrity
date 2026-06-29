// Shared types for the Value Preservation Lab.
// NOTE: this module must stay free of `three` imports so the non-3D shell
// (app/content/state) never pulls the heavy WebGL graph into its bundle.

export type Lang = "zh" | "en";

// Six primitive mismatches, ordered along the value-preservation pipeline.
export type MismatchId =
  | "observation"
  | "state"
  | "fitting"
  | "support"
  | "aggregation"
  | "specification";

export const MISMATCH_ORDER: MismatchId[] = [
  "observation",
  "state",
  "fitting",
  "support",
  "aggregation",
  "specification",
];

export type Regime = "mediocre" | "local" | "extraordinary";

// Which mismatch causes the "irreducible wall" in the Sampling Theater.
export type SamplingCause = "support" | "specification" | "observation";

export type SectionId =
  | "pipeline"
  | "sampling"
  | "mismatch"
  | "regimes"
  | "governance";

// One source of truth, mutated only through the store.
export interface AppState {
  lang: Lang;
  // Pipeline
  governed: boolean;
  releaseNonce: number;
  // Sampling Theater (centerpiece)
  samplingTrain: number; // 0..100
  samplingCause: SamplingCause;
  sampleNonce: number; // bump → drop one sample
  burstNonce: number; // bump → rain a burst
  samplingResetNonce: number;
  // Six mismatches
  activeMismatch: MismatchId;
  keepVariable: boolean; // observation: keep V*
  trueState: number; // state: 0|1 which world is real
  evidence: boolean; // state: discriminating evidence pulled
  routing: number; // fitting: 0..100 spotlight alignment
  invokeNonce: number; // fitting: explicit invoke pulse
  budget: number; // support: 0..100 sampling budget dome
  ladder: boolean; // support: control-space ladder built
  polish: number; // aggregation: 0..100 local polish
  constraint: boolean; // aggregation: global constraint added
  optimizeProxy: number; // specification: 0..100 climb proxy
  counterexample: boolean; // specification: counterexample dropped
  // Regimes
  regime: Regime;
  // Governance
  governanceMethod: number; // 0..3
  governanceOn: boolean;
}

// Params handed from the store to a 3D scene. Superset; each scene reads what it needs.
export interface SceneParams {
  governed?: boolean;
  releaseNonce?: number;
  train?: number;
  cause?: SamplingCause;
  sampleNonce?: number;
  burstNonce?: number;
  resetNonce?: number;
  keepVariable?: boolean;
  trueState?: number;
  evidence?: boolean;
  routing?: number;
  invokeNonce?: number;
  budget?: number;
  ladder?: boolean;
  polish?: number;
  constraint?: boolean;
  optimizeProxy?: number;
  counterexample?: boolean;
  regime?: Regime;
  governanceMethod?: number;
  governanceOn?: boolean;
}

export interface AppContext {
  lang: Lang;
  prefersReducedMotion: boolean;
  supports3D: boolean;
}
