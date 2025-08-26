import { ToastContainer } from "react-toastify";
import type { ToastProps } from "./Toast.type";

export default function Toast({
  position,
  autoClose,
  newestOnTop,
  pauseOnFocusLoss,
  pauseOnHover,
  theme,
  transition,
}: ToastProps) {
  return (
    <ToastContainer
      position={position}
      autoClose={autoClose}
      newestOnTop={newestOnTop}
      pauseOnFocusLoss={pauseOnFocusLoss}
      pauseOnHover={pauseOnHover}
      theme={theme}
      transition={transition}
    />
  );
}
