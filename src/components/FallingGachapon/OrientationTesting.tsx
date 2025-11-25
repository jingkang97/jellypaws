import React, { useState } from "react";
import { useDeviceOrientation } from "./useDeviceOrientation";

const OrientationInfo = (): React.ReactElement => {
  const { orientation, requestAccess, error } = useDeviceOrientation();
  const [permissionRequested, setPermissionRequested] = useState(false);

  const handleRequestAccess = async () => {
    const granted = await requestAccess();
    if (granted) {
      setPermissionRequested(true);
    }
  };

  const orientationInfo = orientation && (
    <ul>
      <li>
        ɑ: <code>{orientation.alpha?.toFixed(2) ?? "N/A"}</code>
      </li>
      <li>
        β: <code>{orientation.beta?.toFixed(2) ?? "N/A"}</code>
      </li>
      <li>
        γ: <code>{orientation.gamma?.toFixed(2) ?? "N/A"}</code>
      </li>
    </ul>
  );

  const errorElement = error ? (
    <div className="error">{error.message}</div>
  ) : null;

  return (
    <>
      {!permissionRequested && !orientation && (
        <button onClick={handleRequestAccess}>Request Gyroscope Access</button>
      )}
      {orientationInfo}
      {errorElement}
    </>
  );
};

export default OrientationInfo;
