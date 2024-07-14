"use client";

import React, { useState, useEffect } from "react";
import { LiveClock } from "@/components/ui/live-clock";

export default function Page() {
  const [data, setData] = useState({
    settings: {
      motd: "Fetching data...",
      registrationEnabled: false,
    },
    uptime: null,
  });

  async function fetchData() {
    const res = await fetch("/web/meta", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      setData({
        settings: {
          motd: "An error occured! Please try again later.",
          registrationEnabled: false,
        },
        uptime: null,
      });
      return;
    }

    const parsedResult = await res.json();
    setData({
      settings: {
        motd: parsedResult.settings.motd,
        registrationEnabled: parsedResult.settings.registrationEnabled,
      },
      uptime: parsedResult.uptime,
    });
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="text-center">
      <p>{data.settings.motd}</p>
      <br />
      {data.uptime !== null && (
        <>
          {data.uptime === 0 ? (
            <div>Loading...</div>
          ) : (
            <LiveClock seconds={data.uptime} />
          )}
        </>
      )}
    </div>
  );
}
