import React, { useState } from "react";
import { useDeviceOrientation } from "./useDeviceOrientation";

const OrientationInfo = () => {
  const { orientation, requestAccess, error } = useDeviceOrientation();
  const [requested, setRequested] = useState(false);

  const handleGesture = async () => {
    if (requested) return;
    const granted = await requestAccess();
    setRequested(granted);
  };

  return (
    <div
      onClick={handleGesture}
      onTouchStart={handleGesture}
      style={{ width: "100vw", height: "100vh" }}
    >
      {orientation ? (
        <div>
          <div>α: {orientation.alpha?.toFixed(2) ?? "N/A"}</div>
          <div>β: {orientation.beta?.toFixed(2) ?? "N/A"}</div>
          <div>γ: {orientation.gamma?.toFixed(2) ?? "N/A"}</div>
        </div>
      ) : (
        <div>Tap anywhere to enable gyroscope</div>
      )}

      {error && <div className="error">{error.message}</div>}
    </div>
  );
};

export default OrientationInfo;
