import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import jellySvg from "../assets/images/jelly.svg"; // or relative path like '../../assets/images/jelly.svg'
import Iridescence from "../Components/Background/Iridescence";
import "./LiquidGlass.css"; // Ensure you have the styles for the jelly and other elements
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

    // ...existing code...

    const words = lineRef.current?.querySelectorAll("span");
    tl.addLabel("wordsStart", "-=0.5");

    if (words) {
      words.forEach((word, i) => {
        tl.to(
          word,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.4,
            ease: "power2.out",
          },
          "wordsStart+=" + i * 0.15
        );
      });
    }

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
        color={[1, 1, 0.9]}
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
              color: "#1f1f1f",
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
        <div>
          {/* <Iridescence
        color={[1, 1, 0.99]}
        mouseReact={true}
        amplitude={1}
        speed={0.5}
      /> */}
          <div className="wrapper">
            {/* <a href="https://x.com/lucasromerodb">
              <div className="liquidGlass-wrapper dock">
                <div className="liquidGlass-effect"></div>
                <div className="liquidGlass-tint"></div>
                <div className="liquidGlass-shine"></div>
                <div className="liquidGlass-text">
                  <div className="dock">
                    <text style={{ color: "white" }}>Start Quiz</text>
                  </div>
                </div>
              </div>
            </a> */}

            <a ref={buttonRef} href="https://aerolab.co">
              <div className="liquidGlass-wrapper button">
                <div className="liquidGlass-effect"></div>
                <div className="liquidGlass-tint"></div>
                <div className="liquidGlass-shine"></div>
                <div className="liquidGlass-text">
                  <text style={{ color: "white" }}>Start Quiz</text>
                </div>
              </div>
            </a>
          </div>

          <svg style={{ display: "none" }}>
            <filter
              id="glass-distortion"
              x="0%"
              y="0%"
              width="100%"
              height="100%"
              filterUnits="objectBoundingBox"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.01 0.01"
                numOctaves="1"
                seed="5"
                result="turbulence"
              />

              <feComponentTransfer in="turbulence" result="mapped">
                <feFuncR
                  type="gamma"
                  amplitude="1"
                  exponent="10"
                  offset="0.5"
                />
                <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
                <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
              </feComponentTransfer>

              <feGaussianBlur
                in="turbulence"
                stdDeviation="3"
                result="softMap"
              />

              <feSpecularLighting
                in="softMap"
                surfaceScale="5"
                specularConstant="1"
                specularExponent="100"
                lighting-color="white"
                result="specLight"
              >
                <fePointLight x="-200" y="-200" z="300" />
              </feSpecularLighting>

              <feComposite
                in="specLight"
                operator="arithmetic"
                k1="0"
                k2="1"
                k3="1"
                k4="0"
                result="litImage"
              />

              <feDisplacementMap
                in="SourceGraphic"
                in2="softMap"
                scale="150"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default StartPage;
