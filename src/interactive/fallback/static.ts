import type { LabContent } from "../content";
import type { AppState, SectionId } from "../types";

// Static 2D SVG diagrams shown when WebGL is unavailable or the user prefers
// reduced motion. Each conveys the same core idea as its 3D scene. Colors use
// the page CSS variables (--mint = value, --orange = probability).

const FONT = 'font-family:"DM Mono",monospace;fill:var(--muted);font-size:13px';

export function fallbackSVG(id: SectionId, t: LabContent, s: AppState): string {
  switch (id) {
    case "pipeline":
      return pipelineSVG(t);
    case "sampling":
      return samplingSVG(t, s);
    case "mismatch":
      return mismatchSVG(t, s);
    case "regimes":
      return regimesSVG(t, s);
    case "governance":
      return governanceSVG(t);
  }
}

function frame(inner: string, h = 360): string {
  return `<svg viewBox="0 0 1000 ${h}" role="img" preserveAspectRatio="xMidYMid meet" class="fallback-svg">${inner}</svg>`;
}

function pipelineSVG(t: LabContent): string {
  const nodes = t.pipeline.nodes;
  const n = nodes.length;
  const x0 = 70;
  const x1 = 930;
  const y = 150;
  const step = (x1 - x0) / (n - 1);
  const conduit = `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="var(--line)" stroke-width="10" stroke-linecap="round"/>`;
  const dots = nodes
    .map((node, i) => {
      const x = x0 + i * step;
      const gate =
        i < n - 1
          ? `<circle cx="${x + step / 2}" cy="${y}" r="9" fill="none" stroke="var(--orange)" stroke-width="2" opacity="0.7"/>`
          : "";
      return `
        <g>
          <circle cx="${x}" cy="${y}" r="16" fill="var(--surface-3)" stroke="var(--mint)" stroke-width="2"/>
          <text x="${x}" y="${y + 4}" text-anchor="middle" style="${FONT};fill:var(--ink);font-size:11px">${node.sym}</text>
          <text x="${x}" y="${y + 40}" text-anchor="middle" style="${FONT};font-size:11px">${escapeText(node.name)}</text>
          ${gate}
        </g>`;
    })
    .join("");
  // payload dimming left→right
  const payload = nodes
    .map((_, i) => {
      const x = x0 + i * step;
      const op = (1 - (i / (n - 1)) * 0.7).toFixed(2);
      return `<circle cx="${x}" cy="${y - 60}" r="7" fill="var(--mint)" opacity="${op}"/>`;
    })
    .join("");
  return frame(`
    ${conduit}
    <text x="${x0}" y="${y - 80}" style="${FONT};fill:var(--mint)">${escapeText(t.pipeline.ideal)} → ${escapeText(t.pipeline.real)}</text>
    ${payload}
    ${dots}
    <text x="500" y="300" text-anchor="middle" style="${FONT};font-size:12px">${escapeText(t.pipeline.aha)}</text>
  `);
}

function valuePath(): string {
  // mint value terrain: low plateau center, tall narrow peak right (Y*)
  return "M70,300 C220,300 300,290 430,292 C520,293 560,150 600,150 C640,150 680,290 760,292 C840,294 900,300 930,300";
}
function probPath(): string {
  // orange probability: fat bump over central plateau, ~0 at the peak
  return "M70,300 C200,300 280,180 430,180 C520,180 540,300 700,300 C820,300 900,300 930,300";
}

function samplingSVG(t: LabContent, s: AppState): string {
  const sm = t.sampling;
  // sample dots clustered in the wrong (central) basin
  const dots = Array.from({ length: 26 }, (_, i) => {
    const x = 300 + ((i * 53) % 230);
    const yy = 250 + ((i * 37) % 45);
    return `<circle cx="${x}" cy="${yy}" r="3.5" fill="var(--orange)" opacity="0.7"/>`;
  }).join("");
  const train = s.samplingTrain;
  return frame(`
    <line x1="60" y1="300" x2="940" y2="300" stroke="var(--line)"/>
    <path d="${valuePath()}" fill="none" stroke="var(--mint)" stroke-width="3"/>
    <path d="${probPath()}" fill="none" stroke="var(--orange)" stroke-width="3" opacity="0.85"/>
    ${dots}
    <circle cx="600" cy="150" r="6" fill="var(--mint)"/>
    <text x="600" y="135" text-anchor="middle" style="${FONT};fill:var(--mint)">${escapeText(sm.expected)}</text>
    <text x="430" y="165" text-anchor="middle" style="${FONT};fill:var(--orange)">${escapeText(sm.actual)}</text>
    <line x1="560" y1="150" x2="560" y2="300" stroke="var(--orange)" stroke-width="3" stroke-dasharray="4 4" opacity="0.8"/>
    <text x="556" y="330" text-anchor="end" style="${FONT};fill:var(--orange);font-size:11px">${escapeText(sm.irreducible)}</text>
    <rect x="60" y="20" width="${Math.round(train * 0.65 * 8)}" height="8" rx="4" fill="var(--mint)" opacity="0.55"/>
    <text x="60" y="14" style="${FONT};font-size:11px">${escapeText(sm.closeableMeter)}</text>
  `);
}

function mismatchSVG(t: LabContent, s: AppState): string {
  const item = t.mismatch.items[s.activeMismatch];
  return frame(
    `
    <text x="500" y="120" text-anchor="middle" style="${FONT};fill:var(--ink);font-size:22px">${escapeText(item.name)}</text>
    <text x="500" y="160" text-anchor="middle" style="${FONT};fill:var(--orange);font-size:14px">${escapeText(item.station)}</text>
    <foreignObject x="120" y="190" width="760" height="120">
      <p xmlns="http://www.w3.org/1999/xhtml" style="margin:0;text-align:center;color:var(--muted);font:14px/1.6 'Noto Sans SC',sans-serif">${escapeText(item.definition)}</p>
    </foreignObject>
  `,
    340,
  );
}

function regimesSVG(t: LabContent, s: AppState): string {
  const item = t.regimes.items[s.regime];
  const prob =
    s.regime === "extraordinary"
      ? "M70,300 C300,300 420,150 600,150 C780,150 900,300 930,300"
      : s.regime === "local"
        ? "M70,300 C260,300 320,170 470,170 C560,170 600,260 760,290 C850,300 900,300 930,300"
        : "M70,300 C200,300 280,180 420,180 C520,180 560,300 700,300 C820,300 900,300 930,300";
  return frame(`
    <line x1="60" y1="300" x2="940" y2="300" stroke="var(--line)"/>
    <path d="${valuePath()}" fill="none" stroke="var(--mint)" stroke-width="3"/>
    <path d="${prob}" fill="none" stroke="var(--orange)" stroke-width="3"/>
    <text x="500" y="40" text-anchor="middle" style="${FONT};fill:var(--ink);font-size:18px">${escapeText(item.name)}</text>
    <text x="500" y="64" text-anchor="middle" style="${FONT};font-size:12px">${escapeText(item.insight)}</text>
  `);
}

function governanceSVG(t: LabContent): string {
  const flow = t.governance.flow;
  const steps = flow
    .map((step, i) => {
      const x = 90 + i * 175;
      return `
      <rect x="${x - 70}" y="150" width="140" height="60" rx="10" fill="var(--surface-3)" stroke="var(--mint)" stroke-width="1.5"/>
      <foreignObject x="${x - 66}" y="158" width="132" height="48">
        <p xmlns="http://www.w3.org/1999/xhtml" style="margin:0;text-align:center;color:var(--ink);font:12px/1.3 'Noto Sans SC',sans-serif">${escapeText(step)}</p>
      </foreignObject>
      ${i < flow.length - 1 ? `<text x="${x + 88}" y="185" text-anchor="middle" style="${FONT};fill:var(--orange);font-size:18px">→</text>` : ""}`;
    })
    .join("");
  return frame(
    `${steps}<text x="500" y="280" text-anchor="middle" style="${FONT};font-size:12px">${escapeText(t.governance.aha)}</text>`,
    320,
  );
}

function escapeText(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
