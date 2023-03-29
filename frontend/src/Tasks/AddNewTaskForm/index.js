import moment from "moment";
import {  useEffect } from "react";
import { Button, Checkbox, Col, DatePicker, Input, Row, Form } from "antd";
import { format } from "timeago.js";
import axios from "axios";
import { Notify } from "../../components/common/Notify";

const AddNewTaskForm = ({
  noPin = false,
  currentUsername,
  newPlace,
  setNewPlace,
  pin,
  pins,
  setPins,
  setCurrentPlaceId,
  refreshData,
  setRefreshData,
  handlePinDelete = () => {}
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (pin?.title) {
      const fieldsData = {
        desc: pin?.desc,
        title: pin?.title,
        time: moment(pin?.time),
      };
      form.setFieldsValue(fieldsData);
    }
  }, [pin]);

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
        if (newPlace) {
          data["lat"] = newPlace?.lat;
          data["long"] = newPlace?.long;
          data["user"] = currentUsername;
        }
        if(noPin){
          data["user"] = currentUsername;
        }
        if (pin) {
          try {
            const res = await axios.put(
              process.env.REACT_APP_API_URL + `/pins/${pin._id}`,
              data
            );
            setPins([...pins, res.data]);
            Notify({
              type: "success",
              title: "Notify",
              message: "Pin was successfully added",
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
            console.log("pins",pins);
            console.log("res",res)
            setPins([...pins, res.data]);
            setNewPlace(null);
            setRefreshData(!refreshData);
            Notify({
              type: "success",
              title: "Notify",
              message: "Pin was successfully added",
            });
          } catch (err) {
            console.log(err);
          }
        }
      }}
    >
      <Row gutter={24}>
        <Col span={24}>
          <Form.Item label="Task" name="desc" style={{ marginBottom: 20 }}>
            <Input className="desc" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={24}>
          <Form.Item label="Place" name="title" style={{ marginBottom: 20 }}>
            <Input className="desc" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24} align="middle">
        <Col span={13}>
          <Form.Item label="Time" name="time" style={{ marginBottom: 20 }}>
            <DatePicker showTimezone={false} className="desc" />
          </Form.Item>
        </Col>
        <Col span={8} style={{ marginLeft: 20, marginTop: 35 }}>
          <Form.Item name="completed" valuePropName="checked">
            <Checkbox />
          </Form.Item>
        </Col>
      </Row>
      {pin?.user ? (
        <Row>
          <Col span={24}>
            <span className="username">
              Created by <b>{pin?.user}</b>
            </span>
            <span style={{ marginLeft: 5 }} className="date">
              {format(pin?.createdAt)}
            </span>
          </Col>
        </Row>
      ) : null}
      <Row
        gutter={24}
        style={{
          marginTop: 10,
          marginBottom: 10,
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        <Col span={12}>
          <button
            onClick={(e) => {
              e.preventDefault();
              handlePinDelete(pin._id);
            }}
            className="submitButton"
          >
            Delete
          </button>
        </Col>
        <Col span={12}>
          <Button
            type="primary"
            htmlType="submit"
            className="submitButton"
            style={{ backgroundColor: "#c12ef7" }}
          >
            Submit
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default AddNewTaskForm;