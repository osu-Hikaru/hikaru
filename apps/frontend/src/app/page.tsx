"use server";

import { cookies } from "next/headers";

import { LiveClock } from "@/components/custom/liveclock";

async function getData() {
  const cookieStore = cookies();
  const jwt = cookieStore.get("jwt");

  if (!jwt) {
    return {
      message: "Welcome to Hikaru! Please login to continue.",
      uptime: null,
    };
  }

  const res = await fetch(
    process.env.NEXT_PUBLIC_BACKEND_URL + "/api/v2/web/meta",
    {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        authorization: "Bearer " + jwt.value,
      },
    }
  );

  if (!res.ok) {
    if (res.status === 403) {
      return {
        message: "Welcome to Hikaru! Please login to continue.",
        uptime: null,
      };
    }

    throw new Error("Failed to fetch data");
  }

  const parsedResult = await res.json();
  return { message: "Welcome to Hikaru!", uptime: parsedResult.uptime };
}

export default async function Page() {
  const data = await getData();

  return (
    <div className="text-center">
      <p>{data.message}</p>
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
