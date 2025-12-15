import Marquee from "react-fast-marquee";

const ConveyorBelt = () => {
  const wheels = Array(10).fill(0);
  return (
    <div>
      <div
        style={{
          height: "200px",
          width: "100vw",
          background: "black",
        }}
      >
        <div
          style={{
            position: "relative",
          }}
        >
          {/* Belt (background) */}
          <Marquee
            speed={100}
            direction="right"
            autoFill
            gradient={true}
            gradientColor="#effaff"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 1,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "200px",
                width: "300px",
                fontSize: "200px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#86827F",
                fontFamily: "Quicksand, sans-serif",
                borderBottom: "5px solid #645F59",
                fontWeight: "900",
              }}
            >
              <span className="pulse">&gt;</span>
            </div>
          </Marquee>

          {/* Plates (foreground) */}
          <Marquee
            speed={100}
            direction="right"
            autoFill
            gradient={true}
            gradientColor="#effaff"
            gradientWidth={"50px"}
            style={{
              position: "absolute",
              top: "-70px", // lift plates above belt
              left: 0,
              zIndex: 2,
              pointerEvents: "none",
            }}
          >
            <img
              className="jelly-jiggle"
              src="/conveyor-jellies/plate1.png"
              style={{
                height: "200px",
                filter: "drop-shadow(0 10px 4px rgba(0,0,0,0.35))",
                marginRight: "50px",
                marginLeft: "50px",
                ["--jiggle-delay" as any]: `${Math.random() * 3}s`,
              }}
              alt="Plate"
            />
            <img
              className="jelly-jiggle"
              src="/conveyor-jellies/plate2.png"
              style={{
                height: "200px",
                filter: "drop-shadow(0 10px 4px rgba(0,0,0,0.35))",
                ["--jiggle-delay" as any]: `${Math.random() * 3}s`,
              }}
              alt="Plate"
            />
          </Marquee>
        </div>
      </div>
      <div
        style={{
          marginTop: "0px", // slightly overlap belt bottom
          height: "100px",
          width: "100vw",
          overflow: "hidden",
          borderTop: "10px solid #544F63",
          borderBottom: "10px solid #544F63",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {wheels.map((_, i) => (
          <img
            key={i}
            className="wheel-spin"
            src="/wheel_v2.png"
            style={{ height: "100px", marginRight: "70px" }}
            alt="Wheel"
          />
        ))}{" "}
      </div>
    </div>
  );
};

export default ConveyorBelt;
