import "@/styles/globals.css";
import { StoreProvide } from "@/utils/Store";
import { SessionProvider } from "next-auth/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <StoreProvide>
        <Component {...pageProps} />
      </StoreProvide>
    </SessionProvider>
  );
}
