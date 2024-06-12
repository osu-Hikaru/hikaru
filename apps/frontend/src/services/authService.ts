import { ToastProps } from "@radix-ui/react-toast";

export const login = async (
  username: string,
  password: string
): Promise<ToastProps> => {
  const formData = new FormData();

  formData.append("client_id", process.env.NEXT_PUBLIC_CLIENT_ID ?? "");
  formData.append("client_secret", process.env.NEXT_PUBLIC_CLIENT_SECRET ?? "");
  formData.append("username", username);
  formData.append("password", password);

  return fetch("/oauth/token", {
    method: "POST",
    body: formData,
    credentials: "include",
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error("Failed to login user.");
      }

      const resData = await response.json();

      if (resData.token_type === "Bearer") {
        return {
          title: "Successfully logged in.",
          description: "You will be redirected shortly.",
        };
      } else {
        throw new Error("Invalid token type.");
      }
    })
    .catch((error) => {
      console.error(`Error: ${error}`);
      return {
        title: "Something went wrong.",
        description: "Please try again later.",
        variant: "destructive",
      };
    });
};
