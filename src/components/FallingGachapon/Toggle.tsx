import { useState } from "react";

interface ToggleButtonProps {
  onToggle: (isOn: boolean) => void | Promise<void>;
  initialValue?: boolean;
  labelOn?: string;
  labelOff?: string;
}

function ToggleButton({
  onToggle,
  initialValue = false,
  labelOn = "Turn Off",
  labelOff = "Turn On",
}: ToggleButtonProps) {
  const [isOn, setIsOn] = useState(initialValue);

  const handleToggle = async () => {
    const newState = !isOn;
    setIsOn(newState);
    await onToggle(newState);
  };

  return (
    <div>
      <button onClick={handleToggle}>{isOn ? labelOn : labelOff}</button>
      {isOn && <p>The toggle is ON!</p>}
    </div>
  );
}

export default ToggleButton;
