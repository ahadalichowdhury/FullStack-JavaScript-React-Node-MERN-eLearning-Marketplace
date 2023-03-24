import "@/styles/globals.css";
import "bootstrap/dist/css/bootstrap.css";
import TopNav from "@/components/TopNav";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "../context/index";

export default function App({ Component, pageProps }) {
  return (
    <Provider>
      <ToastContainer position="top-center" />
      <TopNav />
      <Component {...pageProps} />;
    </Provider>
  );
}
