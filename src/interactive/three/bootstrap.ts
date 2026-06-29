import type { ShellHandle } from "../app";
import type { AppState, MismatchId } from "../types";
import { SceneManager } from "./SceneManager";
import { PipelineScene } from "./scenes/PipelineScene";
import { SamplingTheaterScene } from "./scenes/SamplingTheaterScene";
import { RegimesScene } from "./scenes/RegimesScene";
import { GovernanceScene } from "./scenes/GovernanceScene";
import { createMismatchScene } from "./scenes/mismatch";

export function start(shell: ShellHandle): void {
  const { ctx, store, frames } = shell;
  const mgr = new SceneManager();

  mgr.register("pipeline", new PipelineScene(frames.pipeline.overlay, ctx), frames.pipeline.stage);
  mgr.register(
    "sampling",
    new SamplingTheaterScene(frames.sampling.overlay, ctx),
    frames.sampling.stage,
  );
  mgr.register("regimes", new RegimesScene(frames.regimes.overlay, ctx), frames.regimes.stage);
  mgr.register(
    "governance",
    new GovernanceScene(frames.governance.overlay, ctx),
    frames.governance.stage,
  );

  const mountMismatch = (id: MismatchId) => {
    mgr.register("mismatch", createMismatchScene(id, frames.mismatch.overlay, ctx), frames.mismatch.stage);
  };
  mountMismatch(store.get().activeMismatch);

  const push = (s: AppState) => {
    mgr.get("pipeline")?.setParams({ governed: s.governed, releaseNonce: s.releaseNonce });
    mgr.get("sampling")?.setParams({
      train: s.samplingTrain,
      cause: s.samplingCause,
      sampleNonce: s.sampleNonce,
      burstNonce: s.burstNonce,
      resetNonce: s.samplingResetNonce,
    });
    mgr.get("regimes")?.setParams({ regime: s.regime });
    mgr.get("governance")?.setParams({
      governanceMethod: s.governanceMethod,
      governanceOn: s.governanceOn,
    });
    mgr.get("mismatch")?.setParams({
      keepVariable: s.keepVariable,
      trueState: s.trueState,
      evidence: s.evidence,
      routing: s.routing,
      invokeNonce: s.invokeNonce,
      budget: s.budget,
      ladder: s.ladder,
      polish: s.polish,
      constraint: s.constraint,
      optimizeProxy: s.optimizeProxy,
    });
  };
  push(store.get());

  store.subscribe((s, prev) => {
    if (s.lang !== prev.lang) mgr.forEach((sc) => sc.setLang(s.lang));
    if (s.activeMismatch !== prev.activeMismatch) {
      mgr.unregister("mismatch");
      mountMismatch(s.activeMismatch);
    }
    push(s);
  });

  mgr.start();
}
