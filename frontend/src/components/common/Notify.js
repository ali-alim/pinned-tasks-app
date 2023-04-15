import { notification } from "antd";

export const Notify = ({ type, title = "", message = "", duration = 4.5 }) => {
  notification[type]({
    message: title,
    description: message,
    duration: duration,
    placement: "topLeft",
  });
};

export const onFailure = (error) => {
  Notify({
    type: "error",
    title: "Oops...",
    message: error?.message || "Something went wrong!",
  });
};
