import { useEffect, useRef, useState } from "react";

type LogoPhase = "idle" | "active" | "stopping";

type Particle = {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  kind: "spark" | "page";
  delay: number;
  duration: number;
};

const CYCLE_DURATION_MS = 2400;
const STOPPING_DURATION_MS = 950;
const SPARK_COLORS = ["#F59E0B", "#C83F32", "#2EC4B6", "#E8B949", "#1D5DEC"];
const LOGO_VIDEO_SRC =
  "/assets/aistudio/Animate_website_logo_aef5ab68_1080p_2d954ca3.mp4";
const LOGO_STATIC_SRC =
  "/assets/images/Gemini_Generated_Image_ipcbafipcbafipcb.png";

function createParticles(width: number, height: number): Particle[] {
  return Array.from({ length: 24 }, (_, index) => {
    const isPage = index < 6;
    const originX = isPage
      ? 45 + (index % 4) * 72
      : 195 + ((index % 5) - 2) * 20;
    const originY = isPage ? 44 + (index % 3) * 10 : 18 + (index % 3) * 6;
    const angle = isPage
      ? -1.5 + (index % 4) * 0.35
      : (Math.PI * 2 * index) / 18;
    const speed = isPage
      ? 0.7 + (index % 3) * 0.22
      : 0.4 + (index % 4) * 0.08;

    return {
      x: (originX / 360) * width,
      y: (originY / 92) * height,
      originX: (originX / 360) * width,
      originY: (originY / 92) * height,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - (isPage ? 0.3 : 0),
      size: isPage ? 6 + (index % 3) * 1.5 : 1.4 + (index % 3) * 0.6,
      rotation: (index * 0.7) % 6.28,
      rotationSpeed: isPage ? 0.03 + index * 0.002 : 0,
      color: isPage ? "#ffffff" : SPARK_COLORS[index % SPARK_COLORS.length],
      kind: isPage ? "page" : "spark",
      delay: isPage ? index * 130 : (index % 10) * 50,
      duration: isPage ? 1900 : 1400,
    };
  });
}

function drawPage(context: CanvasRenderingContext2D, particle: Particle): void {
  context.save();
  context.translate(particle.x, particle.y);
  context.rotate(particle.rotation);
  context.beginPath();
  context.moveTo(-particle.size, -particle.size * 0.6);
  context.quadraticCurveTo(
    0,
    -particle.size * 0.82,
    particle.size * 0.9,
    -particle.size * 0.4
  );
  context.lineTo(particle.size * 0.66, particle.size * 0.72);
  context.quadraticCurveTo(
    -particle.size * 0.1,
    particle.size * 0.52,
    -particle.size * 0.84,
    particle.size * 0.42
  );
  context.closePath();
  context.fillStyle = "rgba(255,255,255,0.96)";
  context.shadowColor = "rgba(13,40,71,0.25)";
  context.shadowBlur = 2.5;
  context.shadowOffsetY = 1.5;
  context.fill();
  context.shadowColor = "transparent";
  context.strokeStyle = "#94a3b8";
  context.lineWidth = 0.75;
  context.stroke();
  context.restore();
}

function drawParticles(
  canvas: HTMLCanvasElement,
  particles: Particle[],
  cycleElapsed: number,
  fadeMultiplier: number
): void {
  const context = canvas.getContext("2d");
  if (!context) return;
  const ratio = window.devicePixelRatio || 1;
  context.clearRect(0, 0, canvas.width / ratio, canvas.height / ratio);

  particles.forEach((particle) => {
    const rawAge = cycleElapsed - particle.delay;
    if (rawAge < 0) return;
    const age = rawAge % CYCLE_DURATION_MS;
    if (age > particle.duration) return;

    const progress = Math.min(age / particle.duration, 1);
    const baseOpacity =
      progress < 0.15
        ? progress / 0.15
        : 1 - Math.max(0, progress - 0.68) / 0.32;

    const frames = age / 16.67;
    particle.x = particle.originX + particle.vx * frames;
    particle.y =
      particle.originY +
      particle.vy * frames +
      (particle.kind === "page" ? 0.004 * frames * frames : 0);
    particle.rotation =
      ((particle.delay * 0.01) % 6.28) + particle.rotationSpeed * frames;

    context.globalAlpha = Math.max(0, baseOpacity * fadeMultiplier);
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<number | null>(null);
  const startTimestampRef = useRef<number | null>(null);
  const stopTimeoutRef = useRef<number | null>(null);
  const idleTimeoutRef = useRef<number | null>(null);
  const stoppingStartedAtRef = useRef<number | null>(null);

  const [phase, setPhase] = useState<LogoPhase>("idle");
  const [videoReady, setVideoReady] = useState(false);

  const clearTimers = () => {
    if (stopTimeoutRef.current !== null) {
      window.clearTimeout(stopTimeoutRef.current);
      stopTimeoutRef.current = null;
    }
    if (idleTimeoutRef.current !== null) {
      window.clearTimeout(idleTimeoutRef.current);
      idleTimeoutRef.current = null;
    }
  };

  const startAnimation = () => {
    clearTimers();
    stoppingStartedAtRef.current = null;
    if (phase === "idle") {
      startTimestampRef.current = performance.now();
    }
    setPhase("active");

    const vid = videoRef.current;
    if (vid) {
      vid.loop = true;
      vid.playbackRate = 1.15;
      vid.play().catch(() => {});
    }
  };

  const scheduleGracefulStop = () => {
    clearTimers();
    if (phase === "idle") return;

    const now = performance.now();
    const started = startTimestampRef.current ?? now;
    const elapsed = now - started;
    const remainderInCycle =
      CYCLE_DURATION_MS - (elapsed % CYCLE_DURATION_MS);
    // Keep animating for the remainder of the current cycle + 1 additional cycle, then smoothly wind down
    const extraRunMs = Math.min(
      remainderInCycle + CYCLE_DURATION_MS,
      CYCLE_DURATION_MS * 1.65
    );

    stopTimeoutRef.current = window.setTimeout(() => {
      stoppingStartedAtRef.current = performance.now();
      setPhase("stopping");
      const vid = videoRef.current;
      if (vid) {
        vid.playbackRate = 0.75; // Smoothly decelerate video during stopping phase
      }

      idleTimeoutRef.current = window.setTimeout(() => {
        setPhase("idle");
        stoppingStartedAtRef.current = null;
        startTimestampRef.current = null;
        if (vid) {
          vid.pause();
          vid.playbackRate = 1;
          try {
            vid.currentTime = 0;
          } catch {}
        }
      }, STOPPING_DURATION_MS);
    }, extraRunMs);
  };

  // Play one initial welcome cycle on mount so every visitor sees the live animated logo
  useEffect(() => {
    startTimestampRef.current = performance.now();
    setPhase("active");
    const vid = videoRef.current;
    if (vid) {
      vid.loop = true;
      vid.playbackRate = 1.15;
      vid.play().catch(() => {});
    }

    stopTimeoutRef.current = window.setTimeout(() => {
      stoppingStartedAtRef.current = performance.now();
      setPhase("stopping");
      if (vid) vid.playbackRate = 0.75;
      idleTimeoutRef.current = window.setTimeout(() => {
        setPhase("idle");
        if (vid) {
          vid.pause();
          vid.playbackRate = 1;
          try {
            vid.currentTime = 0;
          } catch {}
        }
      }, STOPPING_DURATION_MS);
    }, CYCLE_DURATION_MS * 1.5);

    return () => clearTimers();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || phase === "idle") {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      return;
    }

    const bounds = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.floor(bounds.width * ratio));
    canvas.height = Math.max(1, Math.floor(bounds.height * ratio));
    const context = canvas.getContext("2d");
    context?.setTransform(ratio, 0, 0, ratio, 0, 0);

    const particles = createParticles(bounds.width, bounds.height);
    if (startTimestampRef.current === null) {
      startTimestampRef.current = performance.now();
    }

    const render = (now: number) => {
      const elapsed = now - (startTimestampRef.current ?? now);
      let fadeMultiplier = 1;
      if (phase === "stopping" && stoppingStartedAtRef.current !== null) {
        const stopProgress = Math.min(
          (now - stoppingStartedAtRef.current) / STOPPING_DURATION_MS,
          1
        );
        fadeMultiplier = 1 - stopProgress * stopProgress;
      }

      drawParticles(canvas, particles, elapsed, fadeMultiplier);
      frameRef.current = requestAnimationFrame(render);
    };

    frameRef.current = requestAnimationFrame(render);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [phase]);

  const stateClass =
    phase === "active"
      ? " is-active"
      : phase === "stopping"
        ? " is-active is-stopping"
        : "";

  const showVideoLayer = videoReady && phase !== "idle";

  return (
    <span
      className={`sahifa-logo-shell${stateClass}`}
      data-logo-phase={phase}
      onMouseEnter={startAnimation}
      onMouseLeave={scheduleGracefulStop}
      onFocus={startAnimation}
      onBlur={scheduleGracefulStop}
    >
      {/* Crisp resting SAHIFA logo image (fades out cleanly while video layer is playing so there is never double-vision) */}
      <img
        src={LOGO_STATIC_SRC}
        alt="Sahifa"
        className={`sahifa-logo-static-img${
          showVideoLayer && phase === "active" ? " is-hidden" : ""
        }`}
        draggable={false}
      />

      {/* Bundled high-res animated logo video visible to all users */}
      <video
        ref={videoRef}
        src={LOGO_VIDEO_SRC}
        poster={LOGO_STATIC_SRC}
        muted
        playsInline
        preload="auto"
        onLoadedData={() => setVideoReady(true)}
        onCanPlay={() => setVideoReady(true)}
        aria-hidden="true"
        className={`sahifa-logo-video${showVideoLayer ? " is-playing" : ""}${
          phase === "stopping" ? " is-fading-out" : ""
        }`}
      />

      {/* Extra interactive particle & page trail during active & stopping phases */}
      <canvas
        ref={canvasRef}
        className="sahifa-logo-canvas"
        aria-hidden="true"
      />
    </span>
  );
}
