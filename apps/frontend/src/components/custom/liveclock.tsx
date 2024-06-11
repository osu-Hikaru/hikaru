"use client";

import React from "react";

interface LiveClockProps {
  seconds: number;
}

export const LiveClock: React.FC<LiveClockProps> = (props) => {
  const [time, setTime] = React.useState(props.seconds);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  function format(sec: number) {
    function pad(s: number) {
      return (s < 10 ? "0" : "") + s;
    }

    let hours = Math.floor(sec / (60 * 60));
    let minutes = Math.floor((sec % (60 * 60)) / 60);
    let seconds = Math.floor(sec % 60);

    return pad(hours) + ":" + pad(minutes) + ":" + pad(seconds);
  }

  return (
    <div>
      <p>Server Uptime: {format(time)}</p>
    </div>
  );
};

export default LiveClock;
