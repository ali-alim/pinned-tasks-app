import axios from "axios";
import moment from "moment";
import { isEmpty } from "lodash";
import { useEffect } from "react";
import { format } from "timeago.js";
import { useNavigate } from "react-router-dom";
import { Button, Checkbox, Col, DatePicker, Input, Row, Form } from "antd";
import { Notify } from "../../../components/common/Notify";
import { DeleteOutlined } from "@ant-design/icons";

const AddNewTaskForm = ({
  id = null,
  activePins,
  refreshData,
  setActivePins,
  setRefreshData,
  currentUsername,
  newPlace = null,
  editPinData = {},
  submitTaskRef = {},
  setNewPlace = () => {},
  onDeleteAction = () => {},
  setCurrentPlaceId = () => {},
  setAddNewTaskModal = () => {},
  hasLocation = false,
  selectedCategory = null,
  setSelectedCategory = () => {},
}) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isEmpty(editPinData)) {
      const fieldsData = {
        desc: editPinData?.desc,
        title: editPinData?.title,
        time: moment(editPinData?.time),
        category: editPinData?.category,
      };
      form.setFieldsValue(fieldsData);
    }
  }, [refreshData]);

  return (
    <Form
      style={{ width: "100%" }}
      form={form}
      layout="vertical"
      onFinish={async (values) => {
        const data = {};
        data["desc"] = values.desc;
        data["title"] = values.title;
        data["time"] = values.time;
        data["completed"] = values.completed;
        data["category"] = values.category || selectedCategory;
        if (newPlace) {
          data["lat"] = newPlace?.lat;
          data["long"] = newPlace?.long;
          data["user"] = currentUsername;
        }
        if (isEmpty(editPinData)) {
          data["user"] = currentUsername;
        }
        if (editPinData._id) {
          try {
            const res = await axios.patch(
              process.env.REACT_APP_API_URL + `/pins/${editPinData._id}`,
              data
            );
            if (!id) {
              setActivePins([...activePins, res.data]);
              setRefreshData(!refreshData);
            } else {
              navigate("/tasks");
            }
            Notify({
              type: "success",
              title: "Notify",
              message: "Pin was successfully edited",
            });
            setAddNewTaskModal(false);
            setCurrentPlaceId(null);
            form.resetFields();
          } catch (err) {
            console.log(err);
          }
        } else {
          try {
            const res = await axios.post(
              process.env.REACT_APP_API_URL + "/pins",
              data
            );
            Notify({
              type: "success",
              title: "Notify",
              message: "Pin was successfully added",
            });
            setActivePins([...activePins, res.data]);
            if (newPlace) {
              setNewPlace(null);
            }
            if (selectedCategory) {
              setSelectedCategory(null);
            }
            setRefreshData(!refreshData);
            setAddNewTaskModal(false);
          } catch (err) {
            console.log(err);
          }
        }
      }}
    >
      <Row gutter={24}>
        <Col span={24}>
          <Form.Item label="Task" name="desc" style={{ marginBottom: 5 }}>
            <Input
              className="desc"
              rules={[
                {
                  required: true,
                  message: "requiredField",
                },
              ]}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={24}>
          <Form.Item label="Place" name="title" style={{ marginBottom: 5 }}>
            <Input
              className="desc"
              rules={[
                {
                  required: true,
                  message: "requiredField",
                },
              ]}
            />
          </Form.Item>
        </Col>
      </Row>
      {!hasLocation && selectedCategory === null ? (
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              label="Category"
              name="category"
              style={{ marginBottom: 5 }}
            >
              <Input
                className="category"
                rules={[
                  {
                    required: true,
                    message: "requiredField",
                  },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
      ) : null}
      <Row gutter={24} align="middle">
        <Col span={13}>
          <Form.Item name="time" style={{ marginBottom: 5 }}>
            <DatePicker
              showTimezone={false}
              className="desc"
              rules={[
                {
                  required: true,
                  message: "requiredField",
                },
              ]}
            />
          </Form.Item>
        </Col>
        <Col span={8} style={{ marginTop: 15 }}>
          <Form.Item name="completed" valuePropName="checked">
            <Checkbox>Done</Checkbox>
          </Form.Item>
        </Col>
      </Row>
      {editPinData?.user ? (
        <Row>
          <Col span={24}>
            <span className="username">
              Created by <b>{editPinData?.user}</b>
            </span>
            <span style={{ marginLeft: 5 }} className="date">
              {format(editPinData?.createdAt)}
            </span>
          </Col>
        </Row>
      ) : null}

      <Row
        gutter={24}
        justify="center"
        style={{
          marginTop: 15,
          marginBottom: 5,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Col span={12} />
        <Col span={12}>
          {newPlace || hasLocation || id ? (
            <div
              style={{
                position: "absolute",
                right: 10,
                bottom: `${newPlace ? "35px" : "10px"}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {hasLocation ? (
                <span
                  style={{ marginBottom: 19, color: "tomato", fontSize: 20 }}
                  onClick={() => onDeleteAction(editPinData?._id)}
                >
                  <DeleteOutlined />
                </span>
              ) : null}
              {id ? (
                <button
                  style={{
                    marginBottom: 20,
                    padding: "5px 16px",
                    backgroundColor: "#FFF",
                    border: "1px solid #F5F5F5",
                    cursor: "pointer",
                    borderRadius: 10,
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/tasks");
                  }}
                >
                  Back
                </button>
              ) : null}
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </div>
          ) : (
            <Button
              ref={submitTaskRef}
              htmlType="submit"
              style={{
                display: "none",
              }}
            />
          )}
        </Col>
      </Row>
    </Form>
  );
};

export default AddNewTaskForm;
