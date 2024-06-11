export class BridgePPY {
  private static instance: BridgePPY;
  private access_token: string = "";
  private refresh_token: string = "";

  private constructor() {
    if (!BridgePPY.instance) {
      BridgePPY.instance = this;
      if (process.env.BRIDGE_ENABLED === "true") {
        this.authorize();
      } else {
        console.log("BridgePPY Authorization disabled.");
      }
    }
    return BridgePPY.instance;
  }

  public static getInstance(): BridgePPY {
    if (!BridgePPY.instance) {
      BridgePPY.instance = new BridgePPY();
    }
    return BridgePPY.instance;
  }

  private authorize(): void {
    const formData = new FormData();

    if (
      process.env.BRIDGE_USERNAME &&
      process.env.BRIDGE_PASSWORD &&
      process.env.BRIDGE_CLIENT_ID &&
      process.env.BRIDGE_CLIENT_SECRET &&
      process.env.BRIDGE_SCOPE &&
      process.env.BRIDGE_GRANT_TYPE
    ) {
      formData.append("username", process.env.BRIDGE_USERNAME);
      formData.append("password", process.env.BRIDGE_PASSWORD);
      formData.append("client_id", process.env.BRIDGE_CLIENT_ID);
      formData.append("client_secret", process.env.BRIDGE_CLIENT_SECRET);
      formData.append("scope", process.env.BRIDGE_SCOPE);
      formData.append("grant_type", process.env.BRIDGE_GRANT_TYPE);
    }

    fetch("https://osu.ppy.sh/oauth/token", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    })
      .then(async (response) => {
        const jsonRes = await response.json();

        this.access_token = jsonRes.access_token;
        this.refresh_token = jsonRes.refresh_token;

        console.log("BridgePPY Authorization successful.");

        setTimeout(() => {
          this.authorize();
        }, jsonRes.expires_in * 1000);
      })
      .catch((error) => {
        console.log(
          "BridgePPY Authorization failed, limited featureset available."
        );
        console.log(error);
      });
  }

  public beatmapsetSearch(query: string): Promise<any> {
    return new Promise((resolve, reject) => {});
  }
}
