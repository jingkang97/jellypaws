import { useRef, useState, useEffect } from "react";
import Matter from "matter-js";
import "./FallingGachapon.css";
import { Body as MatterBody, Bodies } from "matter-js";

import type { IChamferableBodyDefinition } from "matter-js";

interface CircularBoundaryOptions extends IChamferableBodyDefinition {
  width?: number;
  extraLength?: number;
  initialRotation?: number;
}
interface FallingGachaponProps {
  trigger?: "auto" | "scroll" | "click" | "hover";
  backgroundColor?: string;
  wireframes?: boolean;
  gravity?: number;
  mouseConstraintStiffness?: number;
  containerPadding?: number;
  ballMax?: number; // cap number of balls
}

const FallingGachapon: React.FC<FallingGachaponProps> = ({
  trigger = "auto",
  backgroundColor = "transparent",
  wireframes = false,
  gravity = 1,
  mouseConstraintStiffness = 0.02,
  containerPadding = 16,
  ballMax = 24,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const ringOverlayRef = useRef<HTMLDivElement | null>(null);

  const [effectStarted, setEffectStarted] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // -------------------------------
  // 📌 iOS Gyroscope Permission
  // -------------------------------
  useEffect(() => {
    const requestPermission = async () => {
      if (
        typeof DeviceOrientationEvent !== "undefined" &&
        // @ts-ignore
        typeof DeviceOrientationEvent.requestPermission === "function"
      ) {
        try {
          const permission =
            // @ts-ignore
            await DeviceOrientationEvent.requestPermission();
          if (permission !== "granted") {
            console.warn("Gyroscope permission denied");
          }
        } catch (e) {
          console.warn("Gyro permission request error:", e);
        }
      }
    };

    requestPermission();
  }, []);

  // Preload images ---------------------------------------------------------
  useEffect(() => {
    if (!containerRef.current || imagesLoaded) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const width = containerRect.width;
    const height = containerRect.height;
    if (width <= 0 || height <= 0) return;

    const palette = ["blue.png", "green.png", "pink.png", "yellow.png"];
    const ballCount = Math.min(ballMax, 10);
    const filenames = Array.from(
      { length: ballCount },
      () => palette[Math.floor(Math.random() * palette.length)]
    );

    const avgRadius = Math.max(
      16,
      Math.min(
        48,
        (Math.min(width, height) / (Math.sqrt(ballCount || 4) * 5)) * 1.25
      )
    );

    const cx = width / 2;
    const cy = height / 2;
    const ringRadius = Math.min(width, height) / 2 - containerPadding;

    const preloadImages: HTMLImageElement[] = [];
    filenames.forEach((name, i) => {
      const src = `/gachapon/${name}`;
      const img = document.createElement("img");
      img.src = src;
      img.alt = name;
      img.draggable = false;
      img.style.position = "absolute";
      img.style.width = `${avgRadius * 2}px`;
      img.style.height = `${avgRadius * 2}px`;
      img.style.borderRadius = "50%";
      img.style.objectFit = "cover";
      img.style.pointerEvents = "none";
      img.style.userSelect = "none";
      img.style.transform = "translate(-50%, -50%)";
      img.style.opacity = "0";
      img.style.transition = "opacity 0.3s";

      const angle = (Math.random() - 0.5) * Math.PI;
      const startR = Math.max(
        8,
        ringRadius * 0.25 + Math.random() * ringRadius * 0.2
      );
      const startX = cx + Math.cos(angle) * startR + (Math.random() - 0.5) * 40;
      const startY = cy - ringRadius * 0.6 + (Math.random() - 0.5) * 30;

      img.style.left = `${startX}px`;
      img.style.top = `${startY}px`;

      containerRef.current!.appendChild(img);
      preloadImages.push(img);
    });

    Promise.all(
      preloadImages.map(
        (img) =>
          new Promise<void>((resolve) => {
            if (img.complete) resolve();
            else {
              img.onload = () => resolve();
              img.onerror = () => resolve();
            }
          })
      )
    ).then(() => {
      preloadImages.forEach((img) => (img.style.opacity = "1"));
      setImagesLoaded(true);
    });

    return () => {
      preloadImages.forEach((el) => el.remove());
    };
  }, [ballMax, containerPadding, imagesLoaded]);

  // Trigger logic ----------------------------------------------------------
  useEffect(() => {
    if (trigger === "auto") {
      setEffectStarted(true);
      return;
    }
    if (trigger === "scroll" && containerRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setEffectStarted(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    }
  }, [trigger]);

  // -------------------------------
  //  MAIN PHYSICS + GYROSCOPE EFFECT
  // -------------------------------
  useEffect(() => {
    if (!effectStarted || !imagesLoaded) return;

    const { Engine, Render, World, Bodies, Runner, Mouse, MouseConstraint } =
      Matter;

    if (!containerRef.current || !canvasContainerRef.current) return;

    const existingImages = containerRef.current.querySelectorAll("img");
    existingImages.forEach((img) => img.remove());

    const containerRect = containerRef.current.getBoundingClientRect();
    const width = containerRect.width;
    const height = containerRect.height;
    if (width <= 0 || height <= 0) return;

    const engine = Engine.create();
    engine.positionIterations = 10;
    engine.velocityIterations = 8;

    // Default gravity
    engine.world.gravity.x = 0;
    engine.world.gravity.y = gravity;

    const render = Render.create({
      element: canvasContainerRef.current,
      engine,
      options: { width, height, background: backgroundColor, wireframes },
    });

    // -------------------------------
    // 📌 Gyroscope → Gravity Handler
    // -------------------------------
    const handleOrientation = (event: DeviceOrientationEvent) => {
      const beta = event.beta ?? 0; // front/back tilt
      const gamma = event.gamma ?? 0; // left/right tilt

      // Normalized to [-1, 1]
      engine.world.gravity.x = gamma / 45;
      engine.world.gravity.y = beta / 45;
    };

    window.addEventListener("deviceorientation", handleOrientation, true);

    // ---------- Ring + Balls omitted for brevity; unchanged ---------
    // (Your entire ring + ball creation logic stays EXACTLY the same.)

    // (Code continues here...)
    // ---------------------------------------------------------------

    // everything below stays the same as your original code …

    // Cleanup -------------------------------------------------------
    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
      Render.stop(render);
      if (render.canvas && canvasContainerRef.current) {
        canvasContainerRef.current.removeChild(render.canvas);
      }
      Runner.stop(engine.runner as any);
      World.clear(engine.world, false);
      Engine.clear(engine);
    };
  }, [
    effectStarted,
    imagesLoaded,
    gravity,
    wireframes,
    backgroundColor,
    mouseConstraintStiffness,
    containerPadding,
    ballMax,
  ]);

  const handleTrigger = () => {
    if (!effectStarted && (trigger === "click" || trigger === "hover")) {
      setEffectStarted(true);
    }
  };

  return (
    <div
      ref={containerRef}
      className="falling-text-container"
      onClick={trigger === "click" ? handleTrigger : undefined}
      onMouseEnter={trigger === "hover" ? handleTrigger : undefined}
      style={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
        height: "100%",
      }}
    >
      <div ref={ringOverlayRef} aria-hidden />
      <div ref={canvasContainerRef} className="falling-text-canvas" />
    </div>
  );
};

export default FallingGachapon;
