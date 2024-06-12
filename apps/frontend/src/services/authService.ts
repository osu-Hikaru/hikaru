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

export const register = async (
  username: string,
  email: string,
  password: string
): Promise<ToastProps> => {
  const formData = new FormData();

  formData.append("user[username]", username);
  formData.append("user[user_email]", email);
  formData.append("user[password]", password);

  return fetch("/users", {
    method: "POST",
    body: formData,
  }).then(async (response) => {
    const jsonData = await response.json();

    switch (response.status) {
      case 200:
        return {
          title: "Successfully registered.",
          description: "You may now login.",
        };
      case 409:
        return {
          title: jsonData.message,
          description: "Change your details and try again.",
          variant: "destructive",
        };
      default:
        return {
          title: "Something went wrong.",
          description: "Please try again later.",
          variant: "destructive",
        };
    }
  });
};
