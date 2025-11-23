import { useRef, useState, useEffect } from "react";
import Matter from "matter-js";
import "./FallingGachapon.css";

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
  mouseConstraintStiffness = 0.2,
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

    const {
      Engine,
      Render,
      World,
      Bodies,
      Runner,
      Mouse,
      MouseConstraint,
      Body,
    } = Matter;

    if (!containerRef.current || !canvasContainerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const width = containerRect.width;
    const height = containerRect.height;
    if (width <= 0 || height <= 0) return;

    const engine = Engine.create();
    // increase solver iterations to reduce tunneling
    engine.positionIterations = 10;
    engine.velocityIterations = 8;
    engine.world.gravity.y = gravity;

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

    // ---- circular ring (use overlapping static circles for a seam-free wall) ----
    const createCircularRingWithCircles = (
      cx: number,
      cy: number,
      radius: number,
      segments = 64,
      thicknessFactor = 0.06,
      angleOffset = 0
    ) => {
      const bodies: any[] = [];
      const thetaStep = (Math.PI * 2) / segments;
      const thickness = Math.max(12, radius * thicknessFactor);
      for (let i = 0; i < segments; i++) {
        const theta = angleOffset + i * thetaStep;
        const x = cx + Math.cos(theta) * radius;
        const y = cy + Math.sin(theta) * radius;
        const circle = Bodies.circle(x, y, thickness / 2, {
          isStatic: true,
          render: {
            fillStyle: "transparent",
            strokeStyle: "rgba(0,0,0,0.12)",
            lineWidth: 1,
          },
        });
        bodies.push(circle);
      }
      return bodies;
    };

    const cx = width / 2;
    const cy = height / 2;
    const ringRadius = Math.min(width, height) / 2 - containerPadding;
    const ringSegments = Math.max(32, Math.floor(Math.min(width, height) / 20));

    const outerRing = createCircularRingWithCircles(
      cx,
      cy,
      ringRadius,
      Math.max(48, ringSegments),
      0.06,
      0
    );
    const innerRing = createCircularRingWithCircles(
      cx,
      cy,
      Math.max(8, ringRadius - 12),
      Math.max(40, ringSegments),
      0.05,
      Math.PI / ringSegments
    );
    const ringBodies = [...outerRing, ...innerRing];

    // extra rectangular fence to be extra-safe
    const fencePadding = 8;
    const boxThickness = Math.max(24, Math.min(64, ringRadius * 0.08));
    const fenceSpan = ringRadius * 2 + boxThickness * 2 + fencePadding * 2;
    const topWall = Bodies.rectangle(
      cx,
      cy - ringRadius - boxThickness / 2 - fencePadding,
      fenceSpan,
      boxThickness,
      { isStatic: true, render: { fillStyle: "transparent" } }
    );
    const bottomWall = Bodies.rectangle(
      cx,
      cy + ringRadius + boxThickness / 2 + fencePadding,
      fenceSpan,
      boxThickness,
      { isStatic: true, render: { fillStyle: "transparent" } }
    );
    const leftWall = Bodies.rectangle(
      cx - ringRadius - boxThickness / 2 - fencePadding,
      cy,
      boxThickness,
      fenceSpan,
      { isStatic: true, render: { fillStyle: "transparent" } }
    );
    const rightWall = Bodies.rectangle(
      cx + ringRadius + boxThickness / 2 + fencePadding,
      cy,
      boxThickness,
      fenceSpan,
      { isStatic: true, render: { fillStyle: "transparent" } }
    );
    const fenceBodies = [topWall, bottomWall, leftWall, rightWall];

    // ---- create image balls (DOM imgs) and corresponding circle bodies ----
    // use fixed palette from public/gachapon/ and create ~6 balls (random colours)
    const palette = ["blue.png", "green.png", "pink.png", "yellow.png"];
    // increase cap here to allow more balls (use ballMax prop to control)
    const ballCount = Math.min(ballMax, 8);
    const filenames = Array.from(
      { length: ballCount },
      () => palette[Math.floor(Math.random() * palette.length)]
    );

    const ballElems: HTMLImageElement[] = [];
    const ballBodies: any[] = [];

    // compute rad: slightly larger balls (bumped values)
    const avgRadius = Math.max(
      16, // minimum radius
      Math.min(
        48, // maximum radius
        (Math.min(width, height) / (Math.sqrt(ballCount || 4) * 5)) * 1.25 // scale factor for larger balls
      )
    );

    for (let i = 0; i < ballCount; i++) {
      const name = filenames[i];
      // images are expected in public/gachapon/<name>
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
      img.style.pointerEvents = "none"; // let canvas mouse handle interaction
      img.style.userSelect = "none";
      img.style.transform = "translate(-50%, -50%)";
      // starting positions spread near top of ring
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
        // hide Matter's canvas sprite (we render the image as a DOM element)
        render: { visible: false },
      });

      ballElems.push(img);
      ballBodies.push(body);
      containerRef.current!.appendChild(img);
    }

    // use render.canvas for correct mouse coords
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: mouseConstraintStiffness,
        render: { visible: false },
      },
    });
    render.mouse = mouse;

    World.add(engine.world, [
      ...ringBodies,
      ...fenceBodies,
      mouseConstraint,
      ...ballBodies,
    ]);

    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    // show overlay border for the ring
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

    // sync loop: position DOM imgs to match bodies
    let mounted = true;
    const updateLoop = () => {
      if (!mounted) return;
      for (let i = 0; i < ballBodies.length; i++) {
        const b = ballBodies[i];
        const el = ballElems[i];
        const x = b.position.x;
        const y = b.position.y;
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.style.transform = `translate(-50%, -50%) rotate(${b.angle}rad)`;
      }
      requestAnimationFrame(updateLoop);
    };
    updateLoop();

    return () => {
      mounted = false;
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
