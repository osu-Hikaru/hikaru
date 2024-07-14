"use client";

import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { getSettings, toggleSetting } from "@/services/settingsService";

import Cookies from "js-cookie";

export default function PageManage() {
  const jwt = Cookies.get("jwt");
  const [motdValue, setMotdValue] = useState("Loading...");
  const [motdDisabled, setMotdDisabled] = useState(true);

  useEffect(() => {
    getSettings().then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          setMotdValue(data.settings.motd);
          setMotdDisabled(false);
        });
      }
    });
  }, []);

  return (
    <div>
      <div id="motdContainer">
        <Input
          id="motd"
          value={motdValue}
          disabled={motdDisabled}
          onBlur={(event) => toggleSetting("motd", event.target.value, jwt)}
          onChange={(event) => setMotdValue(event.target.value)}
        />
      </div>
      <Switch id="enable-registration" />
      <Label htmlFor="enable-registration">Registration</Label>
    </div>
  );
}
