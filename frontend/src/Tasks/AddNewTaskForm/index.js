import moment from "moment";
import { useEffect } from "react";
import { Button, Checkbox, Col, DatePicker, Input, Row, Form } from "antd";
import { format } from "timeago.js";
import axios from "axios";
import { Notify } from "../../components/common/Notify";
import { DeleteOutlined, SaveOutlined } from "@material-ui/icons";

const AddNewTaskForm = ({
  pins,
  setPins,
  refreshData,
  setRefreshData,
  currentUsername,
  editPinData = {},
  newPlace = null,
  setNewPlace = () => {},
  handlePinDelete = () => {},
  setCurrentPlaceId = () => {},
  setAddNewTaskModal = () => {},
  hasLocation = false,
  selectedCategory = null,
  setSelectedCategory = () => {},
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editPinData?.title) {
      const fieldsData = {
        desc: editPinData?.desc,
        title: editPinData?.title,
        time: moment(editPinData?.time),
        category: editPinData?.category || "",
      };
      form.setFieldsValue(fieldsData);
    }
  }, [editPinData]);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={async (values) => {
        const data = {};
        data["desc"] = values.desc;
        data["title"] = values.title;
        data["time"] = values.time;
        data["completed"] = values.completed;
        data["category"] = values.category;
        if (newPlace) {
          data["lat"] = newPlace?.lat;
          data["long"] = newPlace?.long;
          data["user"] = currentUsername;
        }
        if (!hasLocation) {
          data["user"] = currentUsername;
          data["category"] = selectedCategory;
        }
        if (editPinData._id) {
          try {
            const res = await axios.put(
              process.env.REACT_APP_API_URL + `/pins/${editPinData._id}`,
              data
            );
            setPins([...pins, res.data]);
            Notify({
              type: "success",
              title: "Notify",
              message: "Pin was successfully edited",
            });
            setCurrentPlaceId(null);
            form.resetFields();
            setRefreshData(!refreshData);
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
            setPins([...pins, res.data]);
            if (newPlace) {
              setNewPlace(null);
            }
            if (selectedCategory) {
              setSelectedCategory(null);
            }
            setRefreshData(!refreshData);
          } catch (err) {
            console.log(err);
          }
        }
        setAddNewTaskModal(false);
      }}
    >
      <Row gutter={24}>
        <Col span={24}>
          <Form.Item label="Task" name="desc" style={{ marginBottom: 5 }}>
            <Input className="desc" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={24}>
          <Form.Item label="Place" name="title" style={{ marginBottom: 5 }}>
            <Input className="desc" />
          </Form.Item>
        </Col>
      </Row>
      {!hasLocation ? (
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              label="Category"
              name="category"
              style={{ marginBottom: 5 }}
            >
              <Input className="category" />
            </Form.Item>
          </Col>
        </Row>
      ) : null}
      <Row gutter={24} align="middle">
        <Col span={13}>
          <Form.Item name="time" style={{ marginBottom: 5 }}>
            <DatePicker showTimezone={false} className="desc" />
          </Form.Item>
        </Col>
        <Col span={8} style={{ marginLeft: 20, marginTop: 15 }}>
          <Form.Item name="completed" valuePropName="checked">
            <Checkbox />
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
        <Col span={12} style={{ height: 10 }}>
          <Button
            type="primary"
            htmlType="submit"
            style={{
              backgroundColor: "#c12ef7",
              position: "absolute",
              left: 15,
              bottom: -15,
            }}
          >
            <span>
              <SaveOutlined />
            </span>
          </Button>
        </Col>
        {editPinData?.title ? (
          <Col span={12}>
            <span
              style={{
                width: 30,
                height: 30,
                color: "red",
                position: "absolute",
                right: 5,
                bottom: -20,
              }}
              onClick={() => handlePinDelete(editPinData._id)}
            >
              <DeleteOutlined />
            </span>
          </Col>
        ) : null}
      </Row>
    </Form>
  );
};

export default AddNewTaskForm;
