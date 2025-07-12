import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import jellySvg from "../assets/images/jelly.svg"; // or relative path like '../../assets/images/jelly.svg'
import Iridescence from "../Components/Background/Iridescence";

const StartPage: React.FC = () => {
  const whatRef = useRef<HTMLSpanElement>(null);
  const areYouRef = useRef<HTMLSpanElement>(null);
  const jellyRef = useRef<HTMLImageElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const jellyImgRef = useRef<HTMLImageElement>(null);
  useGSAP(() => {
    const tl = gsap.timeline();

    tl.from(jellyImgRef.current, {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });

    tl.addLabel("titleEnter", "-=0.2"); // start just before jelly image ends

    // 2. Floating animation (looping after entrance)
    tl.to(jellyImgRef.current, {
      y: "-=10",
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    tl.from(
      whatRef.current,
      {
        x: -300,
        ease: "back.out(1.7)",
        opacity: 0,
        duration: 0.7,
      },
      "titleEnter"
    );

    tl.from(
      areYouRef.current,
      {
        x: 300,
        ease: "back.out(1.7)",
        opacity: 0,
        duration: 0.7,
      },
      "titleEnter"
    );

    tl.from(
      jellyRef.current,
      {
        // scale: 0.5,

        ease: "back.out(1.7)",
        opacity: 0,
        duration: 0.7,
      },
      "titleEnter"
    );

    tl.to(
      jellyRef.current,
      {
        keyframes: [
          // Step 1: Squash - thinner width, taller height
          {
            scaleX: 0.6,
            scaleY: 1.4,
            duration: 0.2,
            ease: "power1.out",
          },
          // Step 2: Stretch - wider width, shorter height
          {
            scaleX: 1.3,
            scaleY: 0.7,
            duration: 0.12,
            ease: "power1.inOut",
          },
          // Step 3: Slight settle
          {
            scaleX: 0.9,
            scaleY: 1.2,
            duration: 0.12,
            ease: "power1.inOut",
          },
          // Step 4: Settle to normal with elastic bounce
          {
            scaleX: 1,
            scaleY: 1,
            duration: 1,
            ease: "elastic.out(1, 0.4)",
          },
        ],
      },
      "-=0.4"

      // "-=0.4" // <-- Start the jelly wobble while the text is still sliding in (overlapping slightly)
    );

    const words = lineRef.current?.querySelectorAll("span");

    // Start words animation sooner: reduce overlap time here (e.g. "-=0.2" instead of "-=0.8")
    tl.addLabel("wordsStart", "-=0.5");

    words.forEach((word) => {
      if (word.classList.contains("true-word")) {
        // More dramatic animation for "true"
        tl.to(
          word,
          {
            opacity: 1,
            y: 0,
            scale: 2,
            rotation: 15,
            duration: 0.4,
            color: "#ff4081", // pink
            fontWeight: "bold", // or 700
            textDecoration: "underline",
            ease: "back.out(4)",
          },
          "wordsStart+=" + Array.from(words).indexOf(word) * 0.15
        ).to(
          word,
          {
            scale: 1,
            rotation: 0,
            duration: 0.5,
            ease: "elastic.out(1, 0.6)",
          },
          ">"
        );
      } else {
        // Normal fade + slide for other words
        tl.to(
          word,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.4,
            ease: "power2.out",
          },
          "wordsStart+=" + Array.from(words).indexOf(word) * 0.15
        );
      }
    });

    tl.from(buttonRef.current, {
      scale: 0.4,
      opacity: 0,
      duration: 0.6,
      ease: "back.out(2)",
    });
  }, []);

  const line = "Discover your true flavour";

  return (
    <div>
      <Iridescence
        color={[1, 1, 0.99]}
        mouseReact={true}
        amplitude={1}
        speed={0.3}
      />

      <div
        style={{
          minHeight: "100vh ",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          // background: "#000",
          padding: 24,
        }}
      >
        <img
          ref={jellyImgRef}
          src={jellySvg}
          alt="Jelly"
          style={{
            width: 180,
            height: 180,
            objectFit: "contain",
            marginBottom: 32,
          }}
        />

        {/* Title */}
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: 700,
            color: "#444",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.4ch", // tighter spacing
            margin: 0,
            textAlign: "center",
          }}
        >
          <span
            ref={whatRef}
            className="what"
            style={{ display: "inline-block" }}
          >
            What
          </span>

          <span
            ref={jellyRef}
            className="jelly"
            style={{
              fontFamily: "GummyBear",
              color: "#ff69b4",
              fontSize: "2.6rem",
              // display: "inline-block",
            }}
          >
            Jelly
          </span>
          <span
            ref={areYouRef}
            className="are-you"
            style={{ display: "inline-block" }}
          >
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
              className={
                word.toLowerCase() === "true" ? "true-word" : undefined
              }
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
          className="button"
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
    </div>
  );
};

export default StartPage;
