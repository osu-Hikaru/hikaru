export const getSettings = () => {
  return fetch("/web/meta");
};

export const toggleSetting = (setting: string, value: any, jwt: string) => {
  return new Promise(async (resolve, reject) => {
    const response = await fetch(`/api/v2/web/settings`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + jwt,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ setting: String(setting), value: String(value) }),
    });

    if (response.ok) {
      resolve(response);
    } else {
      reject(response);
    }
  });
};
