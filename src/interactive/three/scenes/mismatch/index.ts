import type { AppContext, MismatchId } from "../../../types";
import type { LabScene } from "../../Scene";
import { AggregationScene } from "./AggregationScene";
import { FittingScene } from "./FittingScene";
import { ObservationScene } from "./ObservationScene";
import { SpecificationScene } from "./SpecificationScene";
import { StateScene } from "./StateScene";
import { SupportScene } from "./SupportScene";

export function createMismatchScene(
  id: MismatchId,
  overlay: HTMLElement,
  ctx: AppContext,
): LabScene {
  switch (id) {
    case "observation":
      return new ObservationScene(overlay, ctx);
    case "state":
      return new StateScene(overlay, ctx);
    case "fitting":
      return new FittingScene(overlay, ctx);
    case "support":
      return new SupportScene(overlay, ctx);
    case "aggregation":
      return new AggregationScene(overlay, ctx);
    case "specification":
      return new SpecificationScene(overlay, ctx);
  }
}
