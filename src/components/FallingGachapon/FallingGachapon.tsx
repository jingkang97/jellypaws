import { useRef, useState, useEffect } from "react";
import Matter from "matter-js";
import "./FallingGachapon.css";
import { Body as MatterBody } from "matter-js";
interface FallingGachaponProps {
  trigger?: "auto" | "scroll" | "click" | "hover";
  backgroundColor?: string;
  wireframes?: boolean;
  gravity?: number;
  mouseConstraintStiffness?: number;
  containerPadding?: number;
}

const FallingGachapon: React.FC<FallingGachaponProps> = ({
  trigger = "auto",
  backgroundColor = "transparent",
  wireframes = false,
  gravity = 0.56,
  mouseConstraintStiffness = 0.9,
  containerPadding = 2,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);

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

    // Create walls: left, right, and bottom
    const wallThickness = 20;

    // Create walls array (mutable for resize)
    let walls: MatterBody[] = [];

    const createWalls = (w: number, h: number): MatterBody[] => {
      return [
        // Left wall (from top to bottom)
        Bodies.rectangle(wallThickness / 2, h / 2, wallThickness, h, {
          isStatic: true,
          render: { visible: false },
        }),
        // Right wall (from top to bottom)
        Bodies.rectangle(w - wallThickness / 2, h / 2, wallThickness, h, {
          isStatic: true,
          render: { visible: false },
        }),
        // Bottom wall
        Bodies.rectangle(w / 2, h - wallThickness / 2, w, wallThickness, {
          isStatic: true,
          render: { visible: false },
        }),
      ];
    };

    walls = createWalls(width, height);

    // --- Create balls ---
    const palette = ["blue.png", "green.png", "pink.png", "yellow.png"];
    const ballCount = 18;

    // Ensure uniform distribution of colors
    const colorCount = palette.length;
    const ballsPerColor = Math.floor(ballCount / colorCount);
    const remainder = ballCount % colorCount;

    // Create array with equal distribution
    const filenames: string[] = [];
    palette.forEach((color, index) => {
      const count = ballsPerColor + (index < remainder ? 1 : 0);
      for (let i = 0; i < count; i++) {
        filenames.push(color);
      }
    });

    // Shuffle the array to randomize order
    for (let i = filenames.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [filenames[i], filenames[j]] = [filenames[j], filenames[i]];
    }

    const ballElems: HTMLImageElement[] = [];
    const ballBodies: MatterBody[] = [];

    // Make balls bigger - scale based on screen size
    // Use a percentage of the screen width, with min/max bounds
    const avgRadius = Math.max(
      40, // Minimum radius (80px diameter)
      Math.min(
        60, // Maximum radius (240px diameter)
        Math.min(width, height) * 0.15 // 15% of the smaller dimension
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

      // Starting positions at the top of the screen, randomly distributed
      // Account for wall thickness on left and right
      const startX =
        wallThickness +
        avgRadius +
        Math.random() * (width - wallThickness * 2 - avgRadius * 2);
      const startY = avgRadius + Math.random() * 100; // Near top

      const body = Bodies.circle(startX, startY, avgRadius, {
        restitution: 0.3, // Some bounce when hitting the bottom
        frictionAir: 0.01, // Less air resistance
        friction: 0.8, // High friction so they don't slide much
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
    World.add(engine.world, [...walls, mouseConstraint, ...ballBodies]);

    // Handle window resize to update wall positions
    let resizeTimeout: number | null = null;
    const handleResize = () => {
      // Debounce resize events
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }

      resizeTimeout = window.setTimeout(() => {
        if (!containerRef.current || !mounted) return;

        const newRect = containerRef.current.getBoundingClientRect();
        const newWidth = newRect.width;
        const newHeight = newRect.height;

        if (newWidth <= 0 || newHeight <= 0) return;

        // Update render size
        render.options.width = newWidth;
        render.options.height = newHeight;
        render.canvas.width = newWidth;
        render.canvas.height = newHeight;

        // Update walls - remove old ones and create new ones
        World.remove(engine.world, walls);
        walls = createWalls(newWidth, newHeight);
        World.add(engine.world, walls);
      }, 100);
    };

    window.addEventListener("resize", handleResize);

    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

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
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      window.removeEventListener("resize", handleResize);
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
      <div ref={canvasContainerRef} className="falling-text-canvas" />
    </div>
  );
};

export default FallingGachapon;
