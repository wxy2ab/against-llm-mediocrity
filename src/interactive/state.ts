import type { AppState } from "./types";

export type Subscriber = (state: AppState, prev: AppState) => void;

export interface Store {
  get(): AppState;
  set(patch: Partial<AppState>): void;
  subscribe(fn: Subscriber): () => void;
}

/** ~30-line observable store. One source of truth, no framework. */
export function createStore(initial: AppState): Store {
  let state = initial;
  const subs = new Set<Subscriber>();
  return {
    get: () => state,
    set(patch) {
      const prev = state;
      state = { ...state, ...patch };
      for (const fn of subs) fn(state, prev);
    },
    subscribe(fn) {
      subs.add(fn);
      return () => subs.delete(fn);
    },
  };
}

export function initialState(lang: AppState["lang"]): AppState {
  return {
    lang,
    governed: false,
    releaseNonce: 0,
    samplingTrain: 0,
    samplingCause: "support",
    sampleNonce: 0,
    burstNonce: 0,
    samplingResetNonce: 0,
    activeMismatch: "observation",
    keepVariable: false,
    trueState: 0,
    evidence: false,
    routing: 30,
    invokeNonce: 0,
    budget: 35,
    ladder: false,
    polish: 0,
    constraint: false,
    optimizeProxy: 0,
    counterexample: false,
    regime: "mediocre",
    governanceMethod: 0,
    governanceOn: false,
  };
}
