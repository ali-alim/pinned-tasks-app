import { Fragment, useState } from "react";
import { Select, Row, Spin, Form, Col,  Popconfirm } from "antd";
import axios from "axios";
import { CheckOutlined, DeleteOutlined } from "@material-ui/icons";
import { Notify } from "../components/common/Notify";
import { EditOutlined } from "@ant-design/icons";
import { categoryNames } from "../constants/categories";

const { Option } = Select;

const Tasks = ({
  pins,
  setPins,
  showCompleted = false,
  pinsLoading,
  refreshData,
  setRefreshData,
  handlePinDelete,
  addNewTaskModal,
  setAddNewTaskModal,
}) => {
  const [form] = Form.useForm();
  const [selectedCategory, setSelectedCategory] = useState("all");
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
          <Row gutter={24} justify="end">
            <Col span={11}>
              <Select
                allowClear
                placeholder="Filter by category"
                bordered={false}
                style={{ width: "100%", borderRadius: 20, border: "1px solid rgba(5, 145, 255, 0.1)" }}
                onChange={(e) => setSelectedCategory(e)}
              >
                {categoryNames.map((category, i) => (
                  <Option key={i} value={category.toLocaleLowerCase()}>
                    {category}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col span={1} />
          </Row>

          {!showCompleted
            ? todoTasks
                .filter((pin) => (
                  selectedCategory !== "all" ? pin.completed !== true && pin?.category === selectedCategory : 
                  pin.completed !== true
                ))
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
                        alignItems: "center",
                      }}
                    >
                      <Popconfirm
                        title="Are you sure you want to delete?"
                        placement="left"
                        onConfirm={() => handlePinDelete(pin._id)}
                        okText="Yes"
                        cancel="No"
                      >
                        <span style={{ color: "red", cursor: "pointer" }}>
                          <DeleteOutlined />
                        </span>
                      </Popconfirm>
                      <span
                        style={{ color: "#371df0ad", cursor: "pointer" }}
                      >
                        <EditOutlined />
                      </span>
                      <Popconfirm
                        title="Are you sure you want to complete?"
                        placement="left"
                        onConfirm={() => handleCompleted(pin)}
                        okText="Yes"
                        cancel="No"
                      >
                        <span style={{ color: "green", cursor: "pointer" }}>
                          <CheckOutlined />
                        </span>
                      </Popconfirm>
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
