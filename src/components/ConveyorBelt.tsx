import Marquee from "react-fast-marquee";

const ConveyorBelt = () => {
  const wheels = Array(20).fill(0);
  return (
    <div>
      <div
        style={{
          height: "200px",
          width: "100vw",
          background: "red",
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
                background: "#FEF4E3",
                color: "#EDDDC7",
                fontFamily: "Quicksand, sans-serif",
                borderBottom: "5px solid #E6CBA8",
                fontWeight: "900",
              }}
            >
              &gt;
            </div>
          </Marquee>

          {/* Plates (foreground) */}
          <Marquee
            speed={100}
            direction="right"
            autoFill
            style={{
              position: "absolute",
              top: "-70px", // lift plates above belt
              left: 0,
              zIndex: 2,
              pointerEvents: "none",
            }}
          >
            <img
              src="/conveyor-jellies/plate1.png"
              style={{
                height: "200px",
                filter: "drop-shadow(0 10px 4px rgba(0,0,0,0.35))",
                marginRight: "50px",
                marginLeft: "50px",
              }}
              alt="Plate"
            />
            <img
              src="/conveyor-jellies/plate2.png"
              style={{
                height: "200px",
                filter: "drop-shadow(0 6px 4px rgba(0,0,0,0.15))",
              }}
              alt="Plate"
            />
          </Marquee>
        </div>
      </div>
      <div
        style={{
          marginTop: "0px", // slightly overlap belt bottom
          //   zIndex: 3,
          height: "80px",
          width: "100vw",
          overflow: "hidden",
          borderTop: "5px solid #000000",
          borderBottom: "5px solid #000000",
          display: "flex",
          alignItems: "center",
        }}
      >
        {wheels.map((_, i) => (
          <img
            key={i}
            src="/wheel.png"
            style={{ height: "100px", marginRight: "70px" }}
            alt="Wheel"
          />
        ))}{" "}
      </div>
    </div>
  );
};

export default ConveyorBelt;
