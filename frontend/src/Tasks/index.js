import { Fragment, useState } from "react";
import { Modal, Row, Spin } from "antd";
import AddNewTaskForm from "./AddNewTaskForm";

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
  setAddNewTaskModal
}) => {
  const sortedArr = pins.sort((a, b) => new Date(a.time) - new Date(b.time));
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

  return (
    <Fragment>
      {pinsLoading ? (
        <Row justify={"center"}>
          <Spin />
        </Row>
      ) : (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* <button
            style={{ padding: 15, margin: "15px 20px" }}
            onClick={() => setAddNewTaskModal(true)}
          >
            Add New Task Without Pin
          </button> */}
          {!showCompleted
            ? sortedArr
                .filter((pin) => pin.completed !== true)
                .map((pin, i) => (
                  <div
                    key={i}
                    style={{
                      borderRadius: 20,
                      border: generateBorderColor(pin),
                      padding: 15,
                      margin: "15px 20px",
                      display:'flex',
                      justifyContent: "space-around",
                      alignItems:'center'
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
                    <div>
                      <span
                        style={{ color: "red", cursor: "pointer" }}
                        onClick={() => handlePinDelete(pin._id)}
                      >
                        X
                      </span>
                    </div>
                  </div>
                ))
            : sortedArr
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
      <Modal
        open={addNewTaskModal}
        onCancel={() => setAddNewTaskModal(false)}
        onOk={() => setAddNewTaskModal(false)}
      >
        <AddNewTaskForm
          setPins={setPins}
          currentUsername={currentUsername}
          noPin={true}
        />
      </Modal>
    </Fragment>
  );
};

export default Tasks;
