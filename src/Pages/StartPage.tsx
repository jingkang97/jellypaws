import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const StartPage: React.FC = () => {
  const whatRef = useRef<HTMLSpanElement>(null);
  const areYouRef = useRef<HTMLSpanElement>(null);
  const jellyRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    // 1. Slide in "What" from left with more punch
    tl.from(whatRef.current, {
      x: -300,
      //   opacity: 0,
      duration: 0.8,
      ease: "back.out(1.7)",
    });

    // 2. Slide in "are you?" from right
    tl.from(areYouRef.current, {
      x: 300,
      //   opacity: 0,
      duration: 0.8,
      ease: "back.out(1.7)",
    });

    // 3. Jelly wobble
    tl.to(jellyRef.current, {
      scaleX: 1.6,
      scaleY: 0.4,
      duration: 0.3,
      ease: "back.out(3)",
    })
      .to(jellyRef.current, {
        scaleX: 0.6,
        scaleY: 1.5,
        duration: 0.3,
        ease: "back.out(3)",
      })
      .to(jellyRef.current, {
        scaleX: 1.2,
        scaleY: 0.8,
        duration: 0.3,
        ease: "back.out(2)",
      })
      .to(jellyRef.current, {
        scaleX: 1,
        scaleY: 1,
        duration: 0.6,
        ease: "elastic.out(1, 0.4)",
      });

    // 4. Word-by-word fade in
    const words = lineRef.current?.querySelectorAll("span");
    tl.to(
      words,
      {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 0.4,
        ease: "power2.out",
      },
      "+=0.2"
    );

    // 5. Button pop-in
    tl.from(buttonRef.current, {
      //   scale: 0.4,
      //   opacity: 0,
      duration: 0.6,
      ease: "back.out(2)",
    });
  }, []);

  const line = "Discover your true flavour";

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#fff",
        padding: 24,
      }}
    >
      {/* <img
        src="/jelly.png"
        alt="Jelly"
        style={{
          width: 180,
          height: 180,
          objectFit: "contain",
          marginBottom: 32,
        }}
      /> */}

      {/* Title */}
      <h1
        style={{
          margin: 0,
          fontSize: "2.5rem",
          fontWeight: 700,
          textAlign: "center",
          color: "#666",
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <span ref={whatRef} style={{ opacity: 1 }}>
          What
        </span>
        <span
          ref={jellyRef}
          style={{
            fontFamily: "GummyBear",
            color: "#ff69b4",
            display: "inline-block",
            transformOrigin: "center",
            fontSize: "2.6rem",
          }}
        >
          Jelly
        </span>
        <span ref={areYouRef} style={{ opacity: 1 }}>
          are you?
        </span>
      </h1>

      {/* Word-by-word subtitle */}
      <h2
        ref={lineRef}
        style={{
          margin: "24px 0 32px 0",
          fontSize: "1.25rem",
          fontWeight: 400,
          color: "#666",
          textAlign: "center",
          display: "flex",
          gap: "0.4ch",
          flexWrap: "wrap",
        }}
      >
        {line.split(" ").map((word, i) => (
          <span
            key={i}
            style={{
              opacity: 0,
              transform: "translateY(8px)",
              display: "inline-block",
            }}
          >
            {word}
          </span>
        ))}
      </h2>

      {/* Pop-in Button */}
      <button
        ref={buttonRef}
        style={{
          padding: "14px 36px",
          fontSize: "1.1rem",
          fontWeight: 600,
          color: "#fff",
          background: "#ff69b4",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          transformOrigin: "center",
        }}
        onClick={() => {
          // TODO: handle start quiz
        }}
      >
        Start Quiz
      </button>
    </div>
  );
};

export default StartPage;
