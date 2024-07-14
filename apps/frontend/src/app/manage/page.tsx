"use client";

import React from "react";
import Cookies from "js-cookie";
import SettingInput from "./SettingInput";
import SettingSwitch from "./SettingSwitch";

export default function PageManage() {
  const jwt = Cookies.get("jwt") || "";

  return (
    <div>
      <SettingInput settingKey="motd" jwt={jwt} />
      <SettingSwitch
        settingKey="registrationEnabled"
        labelText={"Registration"}
        jwt={jwt}
      />
    </div>
  );
}
