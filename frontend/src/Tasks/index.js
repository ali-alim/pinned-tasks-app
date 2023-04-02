import { Fragment, useState } from "react";
import { Checkbox, Row, Spin, Form, Col } from "antd";
import axios from "axios";
import { CheckOutlined, DeleteOutlined } from "@material-ui/icons";
import { Notify } from "../components/common/Notify";

const Tasks = ({
  pins,
  setPins,
  currentUsername,
  showCompleted = false,
  pinsLoading,
  refreshData,
  setRefreshData,
  handlePinDelete,
  addNewTaskModal,
  setAddNewTaskModal,
}) => {
  const [form] = Form.useForm();
  const todoTasks = pins
    .slice()
    .sort((a, b) => new Date(a.time) - new Date(b.time));
  const completedTasks = pins
    .slice()
    .sort((a, b) => new Date(b.time) - new Date(a.time));
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const today = new Date();
  const tomorrow = new Date(today.getDate() + 1);
  const generateBorderColor = (pin) => {
    return new Date(pin.time).toDateString() === today.toDateString()
      ? "1px solid #D25E8F"
      : new Date(pin.time).toDateString() < tomorrow.toDateString()
      ? "1px solid #B877D4"
      : "1px solid #49D8BE";
  };

  const handleCompleted = async (pin) => {
    const data = {};
    data["title"] = pin.title;
    data["desc"] = pin.desc;
    data["time"] = pin.time;
    data["completed"] = true;
    data["time"] = new Date();
    try {
      const res = await axios.put(
        process.env.REACT_APP_API_URL + `/pins/${pin._id}`,
        data
      );
      setPins([...pins, res.data]);
      Notify({
        type: "success",
        title: "Notify",
        message: "Pin was successfully completed",
      });
      form.resetFields();
      setRefreshData(!refreshData);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Fragment>
      {pinsLoading ? (
        <Row justify={"center"}>
          <Spin />
        </Row>
      ) : (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {!showCompleted
            ? todoTasks
                .filter((pin) => pin.completed !== true)
                .map((pin, i) => (
                  <div
                    key={i}
                    style={{
                      borderRadius: 20,
                      border: generateBorderColor(pin),
                      padding: 15,
                      margin: "15px 20px",
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <strong>Task:</strong> {pin.desc.substring(0, 31)}
                      <br />
                      <strong>Place:</strong> {pin.title}
                      <br />
                      <strong>Time:</strong>{" "}
                      {new Date(pin.time).toLocaleDateString()}
                      {new Date(pin.time).toDateString() ===
                      today.toDateString() ? (
                        <span style={{ color: "#D25E8F", marginLeft: 5 }}>
                          Today
                        </span>
                      ) : (
                        <span style={{ color: "#49D8BE", marginLeft: 5 }}>
                          {daysOfWeek[new Date(pin.time).getDay()]}
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "space-between",
                      }}
                    >
                      <span
                        style={{ color: "red", cursor: "pointer" }}
                        onClick={() => handlePinDelete(pin._id)}
                      >
                        <DeleteOutlined />
                      </span>
                      <span
                        style={{ color: "green", cursor: "pointer" }}
                        onClick={() => handleCompleted(pin)}
                      >
                        <CheckOutlined />
                      </span>
                    </div>
                  </div>
                ))
            : completedTasks
                .filter((pin) => pin.completed === true)
                .map((pin, j) => (
                  <div
                    key={j}
                    style={{
                      borderRadius: 20,
                      border: "1px solid black",
                      padding: 15,
                      margin: "15px 20px",
                    }}
                  >
                    <strong>Task:</strong> {pin.desc.substring(0, 31)}
                    <br />
                    <strong>Place:</strong> {pin.title}
                    <br />
                    <strong>Time:</strong>{" "}
                    {new Date(pin.time).toLocaleDateString()}
                  </div>
                ))}
        </div>
      )}
    </Fragment>
  );
};

export default Tasks;
