import { ComponentType } from "react";

interface MyAppProps {
  Component: ComponentType;
  pageProps: any;
}

function MyApp({ Component, pageProps }: MyAppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
