import { useRef, useState, useEffect } from "react";
import Matter from "matter-js";
import "./FallingGachapon.css";
import { Body as MatterBody } from "matter-js";

import type { IChamferableBodyDefinition } from "matter-js";

interface CircularBoundaryOptions extends IChamferableBodyDefinition {
  width?: number;
  extraLength?: number;
  initialRotation?: number;
  sides?: number;
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

  useEffect(() => {
    if (!effectStarted) return;

    const { Engine, Render, World, Bodies, Runner, Mouse, MouseConstraint } =
      Matter;

    if (!containerRef.current || !canvasContainerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const width = containerRect.width;
    const height = containerRect.height;
    if (width <= 0 || height <= 0) return;

    const engine = Engine.create();
    engine.positionIterations = 10;
    engine.velocityIterations = 8;
    engine.world.gravity.y = gravity;
    engine.world.gravity.x = 0;

    // Gyroscope/orientation support
    let deviceOrientation: { beta: number; gamma: number } | null = null;
    let orientationListenerAttached = false;

    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta !== null && event.gamma !== null) {
        deviceOrientation = {
          beta: event.beta, // front-to-back tilt (-180 to 180)
          gamma: event.gamma, // left-to-right tilt (-90 to 90)
        };
      }
    };

    // Function to request and setup device orientation
    const setupDeviceOrientation = async () => {
      if (orientationListenerAttached) {
        console.log("Device orientation already attached");
        return;
      }

      try {
        // Check if we need to request permission (iOS 13+)
        const needsPermission =
          typeof DeviceOrientationEvent !== "undefined" &&
          typeof (DeviceOrientationEvent as any).requestPermission ===
            "function";

        console.log(
          "Setting up device orientation, needsPermission:",
          needsPermission
        );

        if (needsPermission) {
          // iOS 13+ - must request permission from user gesture
          console.log("Requesting device orientation permission...");
          try {
            const response = await (
              DeviceOrientationEvent as any
            ).requestPermission();
            console.log("Permission response:", response);

            if (response === "granted") {
              window.addEventListener(
                "deviceorientation",
                handleDeviceOrientation
              );
              orientationListenerAttached = true;
              console.log(
                "Device orientation permission granted and listener attached"
              );
            } else {
              console.log("Permission denied or not granted:", response);
              // Try to add listener anyway - sometimes it still works
              window.addEventListener(
                "deviceorientation",
                handleDeviceOrientation
              );
              orientationListenerAttached = true;
            }
          } catch (error) {
            console.error("Permission request failed:", error);
            // Try to add listener anyway for testing
            try {
              window.addEventListener(
                "deviceorientation",
                handleDeviceOrientation
              );
              orientationListenerAttached = true;
            } catch (e) {
              console.error("Could not attach listener:", e);
            }
          }
        } else if (typeof window !== "undefined") {
          // Android and other browsers - no permission needed
          console.log("No permission needed, attaching listener directly");
          window.addEventListener("deviceorientation", handleDeviceOrientation);
          orientationListenerAttached = true;
        }
      } catch (error) {
        console.error("Device orientation setup error:", error);
      }
    };

    // Setup orientation on ANY user interaction with the component
    // This ensures it works on iOS where permission must be requested from user gesture
    const handleUserInteraction = async (e: Event) => {
      // Don't prevent default - we want other interactions to work
      await setupDeviceOrientation();
    };

    // Try to setup on multiple interaction types
    const container = containerRef.current;
    let setupOnTouch: (() => void) | null = null;
    let setupOnClick: (() => void) | null = null;
    
    if (container) {
      // Store handlers so we can remove them later
      setupOnTouch = () => {
        console.log("Touch interaction detected - requesting gyroscope permission");
        handleUserInteraction();
      };
      setupOnClick = () => {
        console.log("Click interaction detected - requesting gyroscope permission");
        handleUserInteraction();
      };

      container.addEventListener("touchstart", setupOnTouch, {
        capture: false,
        once: false,
        passive: true, // Make it passive so it doesn't block scrolling
      });
      container.addEventListener("click", setupOnClick, {
        capture: false,
        once: false,
        passive: true,
      });
    }

    // For non-iOS devices, try to setup immediately
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

    if (!isIOS) {
      // Non-iOS devices don't need permission, so try immediately
      setupDeviceOrientation();
    }

    // Update gravity based on device orientation
    const updateGravity = () => {
      if (!deviceOrientation) return;

      // Convert device orientation to gravity vector
      // gamma: left(-90) to right(+90) -> affects x-axis
      // beta: front(-180) to back(+180) -> affects y-axis

      // Clamp gamma and beta to reasonable ranges
      const clampedGamma = Math.max(-90, Math.min(90, deviceOrientation.gamma));
      const clampedBeta = Math.max(-90, Math.min(90, deviceOrientation.beta));

      // Convert to radians and map to gravity effect
      const gammaRad = (clampedGamma * Math.PI) / 180;
      const betaRad = (clampedBeta * Math.PI) / 180;

      // Scale the effect - higher sensitivity for more dramatic response
      // gamma controls horizontal tilt (x-axis gravity)
      // beta controls vertical tilt (y-axis gravity adjustment)
      const sensitivity = 0.8; // Increase for more sensitivity
      engine.world.gravity.x = Math.sin(gammaRad) * gravity * sensitivity;
      engine.world.gravity.y =
        gravity * (1 + Math.sin(betaRad) * sensitivity * 0.5);
    };

    // Smooth gravity updates
    let gravityUpdateInterval: number | null = null;
    if (typeof window !== "undefined") {
      gravityUpdateInterval = window.setInterval(updateGravity, 16); // ~60fps
    }

    const render = Render.create({
      element: canvasContainerRef.current,
      engine,
      options: {
        width,
        height,
        background: backgroundColor,
        wireframes,
      },
    });

    // --- Create circular boundary ring ---
    function createCircularBoundaryRing(
      x: number,
      y: number,
      radius: number,
      options: CircularBoundaryOptions = {}
    ): MatterBody[] {
      const {
        width = 20,
        extraLength = 1.15,
        sides = 64,
        initialRotation = 0,
        isStatic = true,
      } = options;

      const thetaStep = (2 * Math.PI) / sides;
      const chord = 2 * radius * Math.sin(Math.PI / sides);
      const segLength = chord * extraLength;

      const ringParts: MatterBody[] = [];
      for (let i = 0; i < sides; i++) {
        const theta = i * thetaStep + initialRotation;
        const part = Bodies.rectangle(
          x + Math.sin(theta) * radius,
          y - Math.cos(theta) * radius,
          segLength,
          width,
          {
            angle: theta,
            isStatic,
            render: { visible: false },
          }
        );
        ringParts.push(part);
      }
      return ringParts;
    }

    const cx = width / 2;
    const cy = height / 2;
    const ringRadius = Math.min(width, height) / 2 - containerPadding;
    const ringSegments = Math.max(64, Math.floor(Math.min(width, height) / 20));

    const ringBodies = createCircularBoundaryRing(cx, cy, ringRadius, {
      width: 20,
      extraLength: 1.15,
      sides: ringSegments,
      isStatic: true,
    });

    // Extra rectangular fence to be safe
    const fencePadding = 8;
    const boxThickness = Math.max(24, Math.min(64, ringRadius * 0.08));
    const fenceSpan = ringRadius * 2 + boxThickness * 2 + fencePadding * 2;
    const topWall = Bodies.rectangle(
      cx,
      cy - ringRadius - boxThickness / 2 - fencePadding,
      fenceSpan,
      boxThickness,
      { isStatic: true, render: { visible: false } }
    );
    const bottomWall = Bodies.rectangle(
      cx,
      cy + ringRadius + boxThickness / 2 + fencePadding,
      fenceSpan,
      boxThickness,
      { isStatic: true, render: { visible: false } }
    );
    const leftWall = Bodies.rectangle(
      cx - ringRadius - boxThickness / 2 - fencePadding,
      cy,
      boxThickness,
      fenceSpan,
      { isStatic: true, render: { visible: false } }
    );
    const rightWall = Bodies.rectangle(
      cx + ringRadius + boxThickness / 2 + fencePadding,
      cy,
      boxThickness,
      fenceSpan,
      { isStatic: true, render: { visible: false } }
    );
    const fenceBodies = [topWall, bottomWall, leftWall, rightWall];

    // --- Create balls ---
    const palette = ["blue.png", "green.png", "pink.png", "yellow.png"];
    const ballCount = Math.min(ballMax, 10);
    const filenames = Array.from(
      { length: ballCount },
      () => palette[Math.floor(Math.random() * palette.length)]
    );

    const ballElems: HTMLImageElement[] = [];
    const ballBodies: MatterBody[] = [];

    const avgRadius = Math.max(
      16,
      Math.min(
        48,
        (Math.min(width, height) / (Math.sqrt(ballCount || 4) * 5)) * 1.25
      )
    );

    for (let i = 0; i < ballCount; i++) {
      const name = filenames[i];
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

      // starting positions near top of ring
      const angle = (Math.random() - 0.5) * Math.PI;
      const startR = Math.max(
        8,
        ringRadius * 0.25 + Math.random() * ringRadius * 0.2
      );
      const startX = cx + Math.cos(angle) * startR + (Math.random() - 0.5) * 40;
      const startY = cy - ringRadius * 0.6 + (Math.random() - 0.5) * 30;

      const body = Bodies.circle(startX, startY, avgRadius, {
        restitution: 0.6,
        frictionAir: 0.02,
        friction: 0.1,
        render: { visible: false },
      });

      ballElems.push(img);
      ballBodies.push(body);
      containerRef.current!.appendChild(img);
    }

    // --- Mouse constraint ---
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.05, render: { visible: false } }, // lower stiffness prevents dragging balls through walls
    });
    render.mouse = mouse;

    // --- Add all bodies ---
    World.add(engine.world, [
      ...ringBodies,
      ...fenceBodies,
      mouseConstraint,
      ...ballBodies,
    ]);

    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    // Overlay border for ring
    if (ringOverlayRef.current) {
      const overlay = ringOverlayRef.current;
      const size = ringRadius * 2;
      overlay.style.position = "absolute";
      overlay.style.left = `${cx - ringRadius}px`;
      overlay.style.top = `${cy - ringRadius}px`;
      overlay.style.width = `${size}px`;
      overlay.style.height = `${size}px`;
      overlay.style.border = "2px solid rgba(0,0,0,0.12)";
      overlay.style.borderRadius = "50%";
      overlay.style.pointerEvents = "none";
      overlay.style.boxSizing = "border-box";
    }

    // Sync DOM images with physics
    let mounted = true;
    const updateLoop = () => {
      if (!mounted) return;
      for (let i = 0; i < ballBodies.length; i++) {
        const b = ballBodies[i];
        const el = ballElems[i];
        el.style.left = `${b.position.x}px`;
        el.style.top = `${b.position.y}px`;
        el.style.transform = `translate(-50%, -50%) rotate(${b.angle}rad)`;
      }
      requestAnimationFrame(updateLoop);
    };
    updateLoop();

    return () => {
      mounted = false;

      // Clean up device orientation listeners
      if (orientationListenerAttached) {
        window.removeEventListener(
          "deviceorientation",
          handleDeviceOrientation
        );
      }
      if (gravityUpdateInterval !== null) {
        clearInterval(gravityUpdateInterval);
      }

      // Clean up user interaction listeners
      if (container && setupOnTouch && setupOnClick) {
        container.removeEventListener("touchstart", setupOnTouch);
        container.removeEventListener("click", setupOnClick);
      }

      Render.stop(render);
      Runner.stop(runner);
      if (render.canvas && canvasContainerRef.current) {
        canvasContainerRef.current.removeChild(render.canvas);
      }
      ballElems.forEach((el) => {
        if (el.parentElement) el.parentElement.removeChild(el);
      });
      World.clear(engine.world, false);
      Engine.clear(engine);
    };
  }, [
    effectStarted,
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
