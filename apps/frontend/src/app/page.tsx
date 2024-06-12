"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { LiveClock } from "@/components/custom/liveclock";

export default function Page() {
  const [data, setData] = useState({ motd: "Fetching data...", uptime: null });

  async function fetchData() {
    const jwt = Cookies.get("jwt");

    if (!jwt) {
      setData({
        motd: "Welcome to Hikaru! Please login to continue.",
        uptime: null,
      });
      return;
    }

    const res = await fetch("/api/v2/web/meta", {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        authorization: "Bearer " + jwt,
      },
    });

    if (!res.ok) {
      setData({
        motd: "Welcome to Hikaru! Please login to continue.",
        uptime: null,
      });
      return;
    }

    const parsedResult = await res.json();
    setData({ motd: parsedResult.motd, uptime: parsedResult.uptime });
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="text-center">
      <p>{data.motd}</p>
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
