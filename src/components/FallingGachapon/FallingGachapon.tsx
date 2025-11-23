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
    // create a circular boundary made from short static rectangles (no gaps)
    // const createCircularBoundaryRectangles = (
    //   cx: number,
    //   cy: number,
    //   radius: number,
    //   segments = 100,
    //   thicknessFactor = 1,
    //   angleOffset = 0
    // ) => {
    //   const bodies: any[] = [];
    //   const thetaStep = (Math.PI * 2) / segments;
    //   const thickness = Math.max(12, radius * thicknessFactor);
    //   // chord length between adjacent vertices on the circle
    //   const chord = 2 * radius * Math.sin(Math.PI / segments);
    //   // slightly extend each rectangle to overlap neighbors and avoid seams
    //   const segLength = Math.max(8, chord * 1.08);

    //   for (let i = 0; i < segments; i++) {
    //     const theta = angleOffset + i * thetaStep;
    //     const x = cx + Math.cos(theta) * radius;
    //     const y = cy + Math.sin(theta) * radius;
    //     const rect = Bodies.rectangle(x, y, segLength, thickness, {
    //       isStatic: true,
    //       angle: theta,
    //       render: {
    //         fillStyle: "opaque",
    //         strokeStyle: "rgba(0,0,0,0.12)",
    //         lineWidth: 1,
    //       },
    //     });
    //     bodies.push(rect);
    //   }
    //   return bodies;
    // };

    function createCircularBoundaryRectangles(
      x: number,
      y: number,
      sides: number,
      radius: number,
      options: CircularBoundaryOptions = {}
    ): MatterBody {
      const {
        width = 20,
        extraLength = 1.15,
        initialRotation = 0,
        ...bodyOptions
      } = options;

      const theta = (2 * Math.PI) / sides;
      const sideLength = ((2 * radius * theta) / 2) * extraLength;

      const parts: MatterBody[] = [];

      for (let i = 0; i < sides; i++) {
        const part = Bodies.rectangle(0, 0, sideLength, width);

        MatterBody.rotate(part, i * theta);
        MatterBody.translate(part, {
          x: radius * Math.sin(i * theta),
          y: -radius * Math.cos(i * theta),
        });

        parts.push(part);
      }

      const ret = MatterBody.create(bodyOptions);
      MatterBody.setParts(ret, parts);

      if (initialRotation) {
        MatterBody.rotate(ret, initialRotation);
      }

      MatterBody.translate(ret, { x, y });

      return ret;
    }

    const cx = width / 2;
    const cy = height / 2;
    const ringRadius = Math.min(width, height) / 2 - containerPadding;
    const ringSegments = Math.max(32, Math.floor(Math.min(width, height) / 20));

    const ring = createCircularBoundaryRectangles(
      cx,
      cy,
      ringSegments, // how many segments
      ringRadius, // radius
      {
        width: 20,
        extraLength: 1.15,
        initialRotation: 0,
        isStatic: true,
        render: {
          fillStyle: "opaque",
          // strokeStyle: "rgba(0,0,0,0.12)",
          lineWidth: 1,
        },
      }
    );

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
    const ballCount = Math.min(ballMax, 10);
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
      ring,
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
