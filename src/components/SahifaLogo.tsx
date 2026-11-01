import { useEffect, useRef, useState } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  kind: "spark" | "page";
  life: number;
  delay: number;
};

const SPARK_COLORS = ["#F59E0B", "#C83F32", "#2EC4B6", "#E8B949"];

function createParticles(width: number, height: number): Particle[] {
  return Array.from({ length: 38 }, (_, index) => {
    const isPage = index < 8;
    const originX = isPage ? 55 + (index % 4) * 92 : 190;
    const originY = isPage ? 42 + (index % 3) * 13 : 16;
    const angle = isPage
      ? -1.7 + (index % 4) * 0.35
      : (Math.PI * 2 * index) / 30;
    const speed = isPage ? 0.8 + (index % 3) * 0.25 : 0.45 + (index % 4) * 0.07;

    return {
      x: (originX / 360) * width,
      y: (originY / 82) * height,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - (isPage ? 0.35 : 0),
      size: isPage ? 7 + (index % 3) * 2 : 1.5 + (index % 3) * 0.7,
      rotation: (index * 0.7) % 6.28,
      rotationSpeed: isPage ? 0.035 + index * 0.002 : 0,
      color: isPage ? "#ffffff" : SPARK_COLORS[index % SPARK_COLORS.length],
      kind: isPage ? "page" : "spark",
      life: 0,
      delay: isPage ? index * 90 : (index % 10) * 35,
    };
  });
}

function drawPage(context: CanvasRenderingContext2D, particle: Particle): void {
  context.save();
  context.translate(particle.x, particle.y);
  context.rotate(particle.rotation);
  context.beginPath();
  context.moveTo(-particle.size, -particle.size * 0.65);
  context.lineTo(particle.size * 0.9, -particle.size * 0.45);
  context.lineTo(particle.size * 0.65, particle.size * 0.75);
  context.lineTo(-particle.size * 0.85, particle.size * 0.45);
  context.closePath();
  context.fillStyle = "rgba(255,255,255,.95)";
  context.shadowColor = "rgba(13,40,71,.32)";
  context.shadowBlur = 3;
  context.shadowOffsetY = 2;
  context.fill();
  context.shadowColor = "transparent";
  context.beginPath();
  context.moveTo(particle.size * 0.9, -particle.size * 0.45);
  context.lineTo(particle.size * 0.35, -particle.size * 0.15);
  context.lineTo(particle.size * 0.65, particle.size * 0.75);
  context.strokeStyle = "#a9b9c6";
  context.lineWidth = 0.8;
  context.stroke();
  context.restore();
}

function drawParticles(canvas: HTMLCanvasElement, particles: Particle[], elapsed: number): void {
  const context = canvas.getContext("2d");
  if (!context) return;
  context.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((particle) => {
    const age = elapsed - particle.delay;
    if (age < 0) return;
    const progress = Math.min(age / (particle.kind === "page" ? 2200 : 1500), 1);
    const opacity = progress < 0.12 ? progress / 0.12 : 1 - Math.max(0, progress - 0.72) / 0.28;
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vy += particle.kind === "page" ? 0.008 : 0;
    particle.rotation += particle.rotationSpeed;

    context.globalAlpha = Math.max(0, opacity);
    if (particle.kind === "page") {
      drawPage(context, particle);
    } else {
      context.fillStyle = particle.color;
      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();
    }
    context.globalAlpha = 1;
  });
}

export function SahifaLogo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !active) {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      return;
    }

    const bounds = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    canvas.width = bounds.width * ratio;
    canvas.height = bounds.height * ratio;
    const context = canvas.getContext("2d");
    context?.scale(ratio, ratio);
    const particles = createParticles(bounds.width, bounds.height);
    const startedAt = performance.now();

    const render = (now: number) => {
      drawParticles(canvas, particles, (now - startedAt) % 2800);
      frameRef.current = requestAnimationFrame(render);
    };

    frameRef.current = requestAnimationFrame(render);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [active]);

  return (
    <span
      className={`sahifa-logo-shell${active ? " is-active" : ""}`}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
    >
      <canvas ref={canvasRef} className="sahifa-logo-canvas" aria-hidden="true" />
      <svg viewBox="0 0 360 92" role="img" aria-label="Sahifa" className="sahifa-logo-art">
        <defs>
          <pattern id="pattern-s" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(18)">
            <rect width="22" height="22" fill="#159A9C" />
            <path d="M0 5l11-5 11 5-11 5zM0 17l11-5 11 5-11 5z" fill="#F5A623" />
            <path d="M3 0v22M16 0v22" stroke="#fff" strokeWidth="2.5" opacity=".82" />
            <path d="M7 7c3-5 8-5 11 0" fill="none" stroke="#1B4965" strokeWidth="2" />
          </pattern>
          <pattern id="pattern-a1" width="24" height="24" patternUnits="userSpaceOnUse">
            <rect width="24" height="24" fill="#A31621" />
            <path d="M4 16c0-8 9-10 13-5 3 4-1 10-7 8 4-2 4-5 1-6-3-1-4 2-7 3z" fill="none" stroke="#E8B949" strokeWidth="2" />
            <circle cx="19" cy="5" r="1.5" fill="#F5D66A" /><circle cx="6" cy="5" r="1" fill="#F5D66A" />
          </pattern>
          <pattern id="pattern-h-left" width="18" height="18" patternUnits="userSpaceOnUse">
            <rect width="18" height="18" fill="#1D5DEC" />
            <path d="M9 0l3 5 5 4-5 3-3 6-3-6-5-3 5-4zM0 0l18 18M18 0L0 18" fill="none" stroke="#F4FAFF" strokeWidth="1.25" />
          </pattern>
          <pattern id="pattern-h-right" width="24" height="24" patternUnits="userSpaceOnUse">
            <rect width="24" height="24" fill="#1D5DEC" />
            <path d="M2 19c8-1 5-12 13-13 5-1 6 4 2 6-4 2-7-1-5-4M9 22c1-6 8-7 12-3" fill="none" stroke="#fff" strokeWidth="1.7" />
            <path d="M4 5c2-3 5-2 6 1M18 18c2 2 4 1 4-1" fill="none" stroke="#F2A33A" strokeWidth="1.4" />
          </pattern>
          <pattern id="pattern-i" width="22" height="24" patternUnits="userSpaceOnUse">
            <rect width="22" height="24" fill="#F3B749" />
            <path d="M11 3l3 5 5 3-5 3-3 6-3-6-5-3 5-3z" fill="#E06D1A" stroke="#F8D56A" strokeWidth="1" />
          </pattern>
          <pattern id="pattern-f" width="26" height="24" patternUnits="userSpaceOnUse">
            <rect width="26" height="24" fill="#16264C" />
            <path d="M1 18c10-1 7-13 17-14 6-1 7 5 2 7-5 2-8-2-6-5M10 22c1-7 9-8 14-3" fill="none" stroke="#D99B26" strokeWidth="2.5" />
            <circle cx="6" cy="5" r="2" fill="#C63D38" /><circle cx="21" cy="19" r="2" fill="#159A9C" />
          </pattern>
          <pattern id="pattern-a2" width="24" height="24" patternUnits="userSpaceOnUse" patternTransform="rotate(-12)">
            <rect width="24" height="24" fill="#F07A32" />
            <path d="M0 0h24v5H0zM0 10h24v4H0z" fill="#1E40AF" />
            <path d="M5 0v24M16 0v24" stroke="#F4D341" strokeWidth="3" /><path d="M10 0v24" stroke="#C92D48" strokeWidth="2" />
            <path d="M21 0v24" stroke="#fff" strokeWidth="1.5" />
          </pattern>
          <filter id="logo-depth" x="-20%" y="-25%" width="150%" height="165%">
            <feDropShadow dx="2" dy="3" stdDeviation="1.3" floodColor="#0D2847" floodOpacity=".38" />
          </filter>
          <linearGradient id="ribbon-gold" x1="0" x2="1"><stop stopColor="#F59E0B" /><stop offset=".5" stopColor="#FFD166" /><stop offset="1" stopColor="#C85A17" /></linearGradient>
          <linearGradient id="ribbon-blue" x1="0" x2="1"><stop stopColor="#1E40AF" /><stop offset=".5" stopColor="#5AA9E6" /><stop offset="1" stopColor="#0D2847" /></linearGradient>
        </defs>

        <g className="sahifa-letter-wave" filter="url(#logo-depth)">
          <g className="sahifa-letter sahifa-letter-1">
            <path d="M49 24C40 12 18 13 12 28c-6 15 8 21 22 25 11 4 13 10 6 15-9 8-24 1-28-8l-9 9c11 19 39 20 50 4 10-15-1-27-20-34-10-4-13-8-7-13 6-5 15-1 19 5z" fill="none" stroke="#0D2847" strokeWidth="8" strokeLinejoin="round" />
            <path d="M49 24C40 12 18 13 12 28c-6 15 8 21 22 25 11 4 13 10 6 15-9 8-24 1-28-8l-9 9c11 19 39 20 50 4 10-15-1-27-20-34-10-4-13-8-7-13 6-5 15-1 19 5z" fill="url(#pattern-s)" />
            <path d="M8 38c-10-8-11-19-2-27" fill="none" stroke="#0D2847" strokeWidth="5" />
          </g>
          <g className="sahifa-letter sahifa-letter-2">
            <path d="M58 72L75 17l11-9 13 9 20 55-13 2-5-15H75l-4 15zm21-25h18l-9-19z" fill="#7A1215" stroke="#0D2847" strokeWidth="4" strokeLinejoin="round" fillRule="evenodd" />
            <path d="M58 68L75 13l11-9 13 9 20 55-13 2-5-15H75l-4 15zm21-25h18l-9-19z" fill="url(#pattern-a1)" stroke="#E8B949" strokeWidth="2.4" strokeLinejoin="round" fillRule="evenodd" />
          </g>
          <g className="sahifa-letter sahifa-letter-3">
            <path d="M124 13l9-3 3 24 17 1 2-26 10 1-2 64-10 1-1-28-17 1 2 27-10 1z" fill="#102F75" stroke="#0D2847" strokeWidth="5" strokeLinejoin="round" />
            <path d="M124 13l9-3 3 24 17 1 2-26 10 1-2 64-10 1-1-28-17 1 2 27-10 1z" fill="url(#pattern-h-left)" stroke="#0D2847" strokeWidth="2" strokeLinejoin="round" />
            <path d="M149 35c3-5 8-7 12-3 4 4 1 10-4 10-5 0-6-6-2-8" fill="none" stroke="#fff" strokeWidth="2" />
          </g>
          <g className="sahifa-letter sahifa-letter-4">
            <path d="M177 17l8-7 10 8-3 45-8 12-9-10z" fill="#C85A17" stroke="#0D2847" strokeWidth="4" strokeLinejoin="round" />
            <path d="M178 16l8-7 10 8-3 45-8 12-9-10z" fill="url(#pattern-i)" stroke="#C85A17" strokeWidth="2.3" strokeLinejoin="round" />
          </g>
          <g className="sahifa-letter sahifa-letter-5">
            <path d="M207 71l4-57 42 0-2 13-29 1-1 12 24-1-1 12-24 1-1 20z" fill="#51211D" stroke="#0D2847" strokeWidth="5" strokeLinejoin="round" />
            <path d="M207 68l4-57 42 0-2 13-29 1-1 12 24-1-1 12-24 1-1 20z" fill="url(#pattern-f)" stroke="#0D2847" strokeWidth="2.2" strokeLinejoin="round" />
          </g>
          <g className="sahifa-letter sahifa-letter-6">
            <path d="M264 72l13-58Q293 2 308 15l17 57h-13l-4-17h-28l-4 17zm19-29h21l-10-23z" fill="#124E66" stroke="#0D2847" strokeWidth="5" strokeLinejoin="round" fillRule="evenodd" />
            <path d="M264 68l13-58Q293 2 308 15l17 57h-13l-4-17h-28l-4 17zm19-29h21l-10-23z" fill="url(#pattern-a2)" stroke="#0D2847" strokeWidth="2.2" strokeLinejoin="round" fillRule="evenodd" />
            <path d="M278 48c15 7 31 5 48-18" fill="none" stroke="#F4D341" strokeWidth="8" strokeLinecap="round" />
            <path d="M278 48c15 7 31 5 48-18" fill="none" stroke="#1E40AF" strokeWidth="3.2" strokeLinecap="round" />
          </g>
        </g>

        <g className="sahifa-rosette" transform="translate(187 7)" aria-hidden="true">
          <g fill="#F59E0B" stroke="#C85A17" strokeWidth="1.2">
            <ellipse cy="-9" rx="4" ry="8" /><ellipse cy="-9" rx="4" ry="8" transform="rotate(45)" /><ellipse cy="-9" rx="4" ry="8" transform="rotate(90)" /><ellipse cy="-9" rx="4" ry="8" transform="rotate(135)" /><ellipse cy="-9" rx="4" ry="8" transform="rotate(180)" /><ellipse cy="-9" rx="4" ry="8" transform="rotate(225)" /><ellipse cy="-9" rx="4" ry="8" transform="rotate(270)" /><ellipse cy="-9" rx="4" ry="8" transform="rotate(315)" />
          </g>
          <circle r="4.5" fill="#159A9C" stroke="#0D2847" strokeWidth="1.4" />
        </g>

        <g className="sahifa-flow-art" aria-hidden="true">
          <path className="sahifa-splash-arc" d="M25 78C-7 64-14 38 4 18c8-9 17-13 30-14" fill="none" stroke="#2EC4B6" strokeWidth="5" strokeLinecap="round" />
          <path className="sahifa-splash-highlight" d="M24 76C2 63-1 45 11 30" fill="none" stroke="#A8F9FF" strokeWidth="1.5" strokeLinecap="round" />
          <path className="sahifa-ribbon sahifa-ribbon-gold" d="M-15 76C72 27 145 87 373 27" fill="none" stroke="url(#ribbon-gold)" strokeWidth="6" strokeLinecap="round" />
          <path className="sahifa-ribbon sahifa-ribbon-blue" d="M-12 25C84 77 205 8 374 66" fill="none" stroke="url(#ribbon-blue)" strokeWidth="5" strokeLinecap="round" />
          <g className="sahifa-burst-lines" fill="none" stroke="#F59E0B" strokeWidth="1.4" strokeDasharray="3 4"><path d="M187-6c-10-13-22-17-32-14" /><path d="M193-7c8-15 20-20 30-18" /><path d="M201 2c15-5 25-3 34 4" /></g>
        </g>
      </svg>
    </span>
  );
}
