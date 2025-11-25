import React from "react";
import { useDeviceOrientation } from "./useDeviceOrientation";
import ToggleButton from "./Toggle";

const OrientationInfo = (): React.ReactElement => {
  const { orientation, requestAccess, revokeAccess, error } =
    useDeviceOrientation();

  const handleToggle = async (isOn: boolean): Promise<void> => {
    if (isOn) {
      // Turn on - request access
      const granted = await requestAccess();
      if (!granted) {
        console.error("Failed to get device orientation permission");
      }
    } else {
      // Turn off - revoke access
      await revokeAccess();
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
      <ToggleButton
        onToggle={handleToggle}
        labelOn="Disable Gyroscope"
        labelOff="Enable Gyroscope"
      />
      {orientationInfo}
      {errorElement}
    </>
  );
};

export default OrientationInfo;
