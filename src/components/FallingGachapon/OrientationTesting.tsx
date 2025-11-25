import React, { useEffect } from "react";
import { useDeviceOrientation } from "./useDeviceOrientation";

const OrientationInfo = (): React.ReactElement => {
  const { orientation, requestAccess, revokeAccess, error } =
    useDeviceOrientation();

  // const onToggle = (toggleState: boolean): void => {
  //   const result = toggleState ? requestAccess() : revokeAccess();
  // };

  useEffect(() => {
    return () => {
      requestAccess();
    };
  }, []);

  const orientationInfo = orientation && (
    <ul>
      <li>
        ɑ: <code>{orientation.alpha}</code>
      </li>
      <li>
        β: <code>{orientation.beta}</code>
      </li>
      <li>
        γ: <code>{orientation.gamma}</code>
      </li>
    </ul>
  );

  const errorElement = error ? (
    <div className="error">{error.message}</div>
  ) : null;

  return (
    <>
      {/* <Toggle onToggle={onToggle} /> */}
      {orientationInfo}
      {errorElement}
    </>
  );
};

export default OrientationInfo;
