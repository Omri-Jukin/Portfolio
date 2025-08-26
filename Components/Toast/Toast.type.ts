import { ToastTransition } from "react-toastify";

export type ToastType =
  | "success"
  | "error"
  | "warning"
  | "info"
  | "default"
  | "sunny"
  | "rainy"
  | "snowy"
  | "cloudy"
  | "thunderstorm"
  | "mist"
  | "haze"
  | "smoke"
  | "dust"
  | "fog"
  | "sand"
  | "ash"
  | "squall"
  | "tornado"
  | "lunar"
  | "night"
  | "day"
  | "sunrise"
  | "sunset"
  | "rainbow"
  | "rainbow-light"
  | "rainbow-dark"
  | "dark"
  | "light"
  | "colored";

export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export type ToastProps = {
  type: ToastType; // available selection from: success, error, warning, info, default
  position: ToastPosition; // available selection from: top-left, top-center, top-right, bottom-left, bottom-center, bottom-right
  autoClose: number; // auto close after ms, default is 5000
  newestOnTop: boolean; // newest toast on top
  pauseOnFocusLoss: boolean; // pause on focus loss
  pauseOnHover: boolean; // pause on hover
  theme: "light" | "dark" | "colored"; // available selection from: light, dark, colored, default is dark
  transition: ToastTransition; // available selection from: Bounce, Slide, Zoom, Flip, Slide, Rotate, default is Bounce
};
