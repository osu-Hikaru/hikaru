"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function PageManage() {
  return (
    <div>
      <Switch id="enable-registration" />
      <Label htmlFor="enable-registration">Registration</Label>
    </div>
  );
}
