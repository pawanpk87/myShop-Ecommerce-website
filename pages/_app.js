import "@/styles/globals.css";
import { StoreProvide } from "@/utils/Store";

export default function App({ Component, pageProps }) {
  return (
    <StoreProvide>
      <Component {...pageProps} />
    </StoreProvide>
  );
}
