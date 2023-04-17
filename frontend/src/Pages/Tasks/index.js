import { Select, Row, Spin, Col, Popconfirm, Modal, DatePicker } from "antd";
import { Fragment, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import {
  EditOutlined,
  PlusCircleOutlined,
  RedoOutlined,
} from "@ant-design/icons";
import AddNewTaskForm from "./AddNewTaskForm";
import { DeleteOutlined } from "@material-ui/icons";
import { Notify } from "../../components/common/Notify";

const { RangePicker } = DatePicker;
const { Option } = Select;

const dateFormat = "YYYY-MM-DD";
const myStorage = window.localStorage;
const currentUsername = myStorage.getItem("user");

const Tasks = () => {
  const submitTaskRef = useRef();
  const navigate = useNavigate();
  const [activePins, setActivePins] = useState([]);
  const [editPinData, setEditPinData] = useState({});
  const [endTime, setEndTime] = useState("2023-12-31");
  const [refreshData, setRefreshData] = useState(false);
  const [pinsLoading, setPinsLoading] = useState(false);
  const [completedPins, setCompletedPins] = useState([]);
  const [categoryNames, setCategoryNames] = useState([]);
  const [startTime, setStartTime] = useState("2023-01-01");
  const [addNewTaskModal, setAddNewTaskModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);


  const reset = () => {
    setStartTime("2023-01-01");
    setEndTime("2023-12-31");
    setSelectedCategory(null);
    setRefreshData(!refreshData);
  };

  const getPins = async () => {
    try {
      setPinsLoading(true);
      const allPins = await axios.get(process.env.REACT_APP_API_URL + "/pins", {
        params: { user: currentUsername },
      });
      setActivePins(
        allPins?.data
          ?.filter((pin) =>
            selectedCategory !== null
              ? pin.completed !== true &&
                pin.category === selectedCategory &&
                moment(pin.time).format(dateFormat) >= startTime &&
                moment(pin.time).format(dateFormat) <= endTime
              : pin.completed !== true &&
                moment(pin.time).format(dateFormat) >= startTime &&
                moment(pin.time).format(dateFormat) <= endTime
          )
          ?.sort((a, b) => new Date(a.time) - new Date(b.time))
      );
      setCompletedPins(
        allPins?.data
          ?.filter((pin) => pin.completed === true)
          ?.sort((a, b) => new Date(b.time) - new Date(a.time))
      );
      const receivedPins = allPins.data;
      for (let i = 0; i < receivedPins?.length; i++) {
        if (
          receivedPins[i].category !== undefined &&
          receivedPins[i].category !== null &&
          receivedPins[i].completed !== true &&
          receivedPins[i].user === currentUsername
        ) {
          setCategoryNames((prevState) => [
            ...prevState.filter((el) => el !== receivedPins[i]?.category),
            receivedPins[i]?.category,
          ]);
        }
      }
      setPinsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getPins();
  }, [refreshData, startTime, selectedCategory]);

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

  const handlePinDelete = async (id) => {
    try {
      const res = await axios.delete(
        process.env.REACT_APP_API_URL + `/pins/${id}`
      );
      if (res) {
        Notify({
          type: "success",
          title: "Notify",
          message: "Pin was successfully deleted",
        });
        setRefreshData(!refreshData);
      }
    } catch (err) {
      Notify({
        type: "error",
        title: "title",
        message: "message",
      });
    }
  };

  return (
    <Fragment>
      {pinsLoading ? (
        <Row justify={"center"} gutter={24} style={{ marginTop: 20 }}>
          <Spin />
        </Row>
      ) : (
        <>
          <Row
            gutter={24}
            style={{
              marginTop: 20,
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              flexFlow: "unset",
            }}
          >
            <Col span={12} style={{ marginLeft: 24 }}>
              <RangePicker
                style={{ width: "100%" }}
                onChange={(e) => {
                  if (e === null) {
                    setStartTime("2023-01-01");
                    setEndTime("2023-12-31");
                  } else {
                    setStartTime(e[0].format(dateFormat));
                    setEndTime(e[1].format(dateFormat));
                  }
                }}
              />
            </Col>
            <Col span={12}>
              <Select
                allowClear
                placeholder="Category"
                bordered={false}
                style={{
                  width: "70%",
                  borderRadius: 6,
                  border: "1px solid rgba(5, 145, 255, 0.1)",
                }}
                onChange={(e) => {
                  setSelectedCategory(e);
                }}
              >
                {categoryNames?.map((category, i) => (
                  <Option key={i} value={category}>
                    {category}
                  </Option>
                ))}
              </Select>
            </Col>
          </Row>
          <Row
            gutter={24}
            style={{ display: "flex", alignItems: "center", flexFlow: "unset" }}
          >
            <Col
              span={12}
              style={{
                marginLeft: 24,
              }}
            >
              <span
                style={{
                  backgroundColor: "tomato",
                  color: "#FFF",
                  padding: "7px 20px",
                  borderRadius: 14,
                }}
                onClick={() => {
                  setAddNewTaskModal(true);
                  setEditPinData({});
                }}
              >
                <PlusCircleOutlined /> Add New Task
              </span>
              <span
                onClick={() => reset()}
                style={{
                  position: "absolute",
                  left: 180,
                  cursor: "pointer",
                }}
              >
                <RedoOutlined style={{ fontSize: 20 }} />
              </span>
            </Col>
            <Col span={12} />
          </Row>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {activePins?.map((pin, i) => (
              <div
                key={i}
                style={{
                  position: "relative",
                  borderRadius: 20,
                  border: generateBorderColor(pin),
                  padding: 15,
                  margin: "15px 20px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div>
                  <div>
                    <strong>Task: </strong>
                    <span style={{ wordBreak: "break-word" }}>{pin.desc}</span>
                  </div>
                  <div>
                    <strong>Place:</strong> {pin.title}
                  </div>
                  {pin.category ? (
                    <div>
                      <strong>Category:</strong> {pin.category}
                    </div>
                  ) : null}
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
                    position: "absolute",
                    right: 15,
                    bottom: 10,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      color: "#371df0ad",
                      cursor: "pointer",
                      marginRight: 10,
                      fontSize: 20,
                    }}
                    onClick={() => {
                      navigate(`/tasks/${pin._id}/edit`);
                    }}
                  >
                    <EditOutlined />
                  </span>
                  <Popconfirm
                    title="Are you sure you want to delete?"
                    placement="left"
                    onConfirm={() => handlePinDelete(pin._id)}
                    okText="Yes"
                    cancel="No"
                  >
                    <span
                      style={{
                        color: "red",
                        cursor: "pointer",
                        fontSize: 15,
                      }}
                    >
                      <DeleteOutlined />
                    </span>
                  </Popconfirm>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <Modal
        title={editPinData?.title ? "Edit Task" : "Add Task"}
        bodyStyle={{ height: 330 }}
        open={addNewTaskModal}
        onCancel={() => {
          setAddNewTaskModal(false);
          setEditPinData({});
        }}
        onOk={() => submitTaskRef.current.click()}
        okText="Save"
        destroyOnClose={true}
      >
        <AddNewTaskForm
          activePins={activePins}
          setActivePins={setActivePins}
          refreshData={refreshData}
          setRefreshData={setRefreshData}
          currentUsername={currentUsername}
          editPinData={editPinData}
          setAddNewTaskModal={setAddNewTaskModal}
          submitTaskRef={submitTaskRef}
        />
      </Modal>
    </Fragment>
  );
};

export default Tasks;
