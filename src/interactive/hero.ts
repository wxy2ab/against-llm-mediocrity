// Hero animation — a self-contained 2D-canvas visualization of the core thesis:
// the model samples where it's EASY (orange probability bump) rather than where
// value is HIGHEST (the mint Y* peak). Pure Canvas 2D — always composites and
// displays, no WebGL. Runs on every page (independent of the 3D layer).

interface Dot {
  t: number; // position in output space [0..1]
  x: number;
  y: number;
  vy: number;
  landY: number;
  landed: boolean;
  age: number;
}

const MINT = "#50d3b8";
const ORANGE = "#ff745c";
const MAX_DOTS = 60;

// value landscape: rolling plateau + tall narrow peak Y* on the right
const valueH = (t: number): number =>
  0.06 +
  0.18 * Math.exp(-((t - 0.28) ** 2) / 0.016) +
  0.1 * Math.exp(-((t - 0.52) ** 2) / 0.012) +
  0.84 * Math.exp(-((t - 0.8) ** 2) / 0.004);

// probability mass: a couple of "easy" hills over the central-left, ~0 at Y*
const probH = (t: number): number =>
  0.42 * Math.exp(-((t - 0.34) ** 2) / 0.02) + 0.18 * Math.exp(-((t - 0.12) ** 2) / 0.011);

export function startHero(canvas: HTMLCanvasElement, reduced: boolean): () => void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w = 0;
  let h = 0;
  let raf = 0;
  let last = performance.now();
  let spawnAcc = 0;
  let elapsed = 0;
  const dots: Dot[] = [];

  const PAD = 0.07;
  const px = (t: number) => (PAD + t * (1 - 2 * PAD)) * w;
  const py = (hh: number) => h * 0.94 - hh * h * 0.95;

  function resize(): void {
    const r = canvas.getBoundingClientRect();
    w = r.width;
    h = r.height;
    canvas.width = Math.max(2, Math.round(w * dpr));
    canvas.height = Math.max(2, Math.round(h * dpr));
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function curve(fn: (t: number) => number, stroke: string, fill: string): void {
    const N = 90;
    ctx!.beginPath();
    ctx!.moveTo(px(0), py(0));
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      ctx!.lineTo(px(t), py(fn(t)));
    }
    ctx!.lineTo(px(1), py(0));
    ctx!.closePath();
    ctx!.fillStyle = fill;
    ctx!.fill();
    ctx!.beginPath();
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const x = px(t);
      const y = py(fn(t));
      if (i === 0) ctx!.moveTo(x, y);
      else ctx!.lineTo(x, y);
    }
    ctx!.strokeStyle = stroke;
    ctx!.lineWidth = 2.5;
    ctx!.stroke();
  }

  function label(text: string, t: number, hh: number, color: string, dy = -10): void {
    ctx!.fillStyle = color;
    ctx!.font = "600 12px 'DM Mono', monospace";
    ctx!.textAlign = "center";
    ctx!.fillText(text, px(t), py(hh) + dy);
  }

  function draw(): void {
    ctx!.clearRect(0, 0, w, h);

    // baseline
    ctx!.strokeStyle = "rgba(238,243,242,0.14)";
    ctx!.lineWidth = 1;
    ctx!.beginPath();
    ctx!.moveTo(px(-0.02), py(0));
    ctx!.lineTo(px(1.02), py(0));
    ctx!.stroke();

    curve(probH, ORANGE, "rgba(255,116,92,0.12)");
    curve(valueH, MINT, "rgba(80,211,184,0.12)");

    // Y* peak marker with a pulsing ring
    const pkx = px(0.78);
    const pky = py(valueH(0.78));
    const pulse = reduced ? 0.5 : 0.5 + 0.5 * Math.sin(elapsed * 2.4);
    ctx!.beginPath();
    ctx!.arc(pkx, pky, 9 + pulse * 7, 0, Math.PI * 2);
    ctx!.strokeStyle = `rgba(80,211,184,${0.5 - pulse * 0.35})`;
    ctx!.lineWidth = 2;
    ctx!.stroke();
    ctx!.beginPath();
    ctx!.arc(pkx, pky, 5, 0, Math.PI * 2);
    ctx!.fillStyle = MINT;
    ctx!.fill();

    // sample dots
    for (const d of dots) {
      const a = Math.max(0, 1 - d.age / 6);
      ctx!.beginPath();
      ctx!.arc(d.x, d.y, 3, 0, Math.PI * 2);
      ctx!.fillStyle = `rgba(255,116,92,${0.85 * a})`;
      ctx!.fill();
    }

    label("p_θ", 0.34, probH(0.34), ORANGE, -8);
    label("Y*", 0.78, valueH(0.78), MINT, -22);
  }

  function tick(now: number): void {
    const dt = Math.min((now - last) / 1000, 1 / 30);
    last = now;
    elapsed += dt;

    // spawn samples into the easy (orange) basin
    spawnAcc += dt;
    while (spawnAcc > 0.18 && dots.length < MAX_DOTS) {
      spawnAcc -= 0.18;
      const t = 0.2 + Math.random() * 0.3;
      dots.push({ t, x: px(t), y: py(1.05), vy: 0, landY: py(valueH(t)) - 2, landed: false, age: 0 });
    }
    for (let i = dots.length - 1; i >= 0; i--) {
      const d = dots[i];
      d.age += dt;
      if (!d.landed) {
        d.vy += 900 * dt;
        d.y += d.vy * dt;
        if (d.y >= d.landY) {
          d.y = d.landY;
          d.landed = true;
        }
      }
      if (d.age > 6) dots.splice(i, 1);
    }

    draw();
    raf = requestAnimationFrame(tick);
  }

  resize();
  window.addEventListener("resize", resize, { passive: true });

  if (reduced) {
    // a few settled samples + a static frame
    for (let i = 0; i < 14; i++) {
      const t = 0.2 + (i / 14) * 0.3;
      dots.push({ t, x: px(t), y: py(valueH(t)) - 2, vy: 0, landY: py(valueH(t)) - 2, landed: true, age: 0 });
    }
    draw();
  } else {
    raf = requestAnimationFrame(tick);
  }

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", resize);
  };
}
