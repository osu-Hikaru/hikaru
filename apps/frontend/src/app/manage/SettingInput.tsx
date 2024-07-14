import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { getSettings, toggleSetting } from "@/services/settingsService";

interface SettingInputProps {
  settingKey: string;
  jwt: string;
}

const SettingInput: React.FC<SettingInputProps> = ({ settingKey, jwt }) => {
  const [value, setValue] = useState("Loading...");
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    getSettings().then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          setValue(data.settings[settingKey]);
          setDisabled(false);
        });
      }
    });
  }, [settingKey]);

  return (
    <div
      id={`${settingKey}Container`}
      style={{ display: "flex", alignItems: "center" }}
    >
      <Input
        id={settingKey}
        value={value}
        disabled={disabled}
        onBlur={async (event) => {
          setDisabled(true);
          await toggleSetting(settingKey, event.target.value, jwt);
          setDisabled(false);
        }}
        onChange={(event) => {
          setValue(event.target.value);
        }}
      />
    </div>
  );
};

export default SettingInput;
