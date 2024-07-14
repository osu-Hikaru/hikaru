export const getSettings = () => {
  return fetch("/web/meta");
};

export const toggleSetting = (setting: string, value: any, jwt?: string) => {
  if (!jwt) {
    return fetch(`/api/v2/web/settings?setting=${setting}&value=${value}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  fetch(`/api/v2/web/settings?setting=${setting}&value=${value}`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + jwt,
      "Content-Type": "application/json",
    },
  }).then((response) => {
    console.log(response);
  });
};
