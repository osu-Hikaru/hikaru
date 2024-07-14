import React, { useState, useEffect } from "react";
import { getSettings, toggleSetting } from "@/services/settingsService";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface SettingToggleProps {
  settingKey: string;
  labelText: string;
  jwt: string;
}

const SettingInput: React.FC<SettingToggleProps> = ({
  settingKey,
  labelText,
  jwt,
}) => {
  const [value, setValue] = useState(false);
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
      <Label htmlFor={settingKey}>{labelText}</Label>
      <Switch
        id={settingKey}
        checked={value}
        disabled={disabled}
        onCheckedChange={async (event) => {
          setDisabled(true);
          await toggleSetting(settingKey, event, jwt);
          setValue(event);
          setDisabled(false);
        }}
      />
    </div>
  );
};

export default SettingInput;
