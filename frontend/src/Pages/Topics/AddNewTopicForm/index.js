import { useEffect } from "react";
import { Button, Checkbox, Col, DatePicker, Input, Row, Form } from "antd";
import axios from "axios";
import { Notify } from "../../../components/common/Notify";
import { isEmpty } from "lodash";
import { useNavigate } from "react-router-dom";

const AddNewTopicForm = ({
  setEditTopicData = () => {},
  submitTopicRef = {},
  editTopicData = {},
  id = null,
  onDeleteAction = () => {},
  refreshData,
  setRefreshData,
  currentUsername,
  setTopics = () => {},
  topics = [],
  setAddNewTopicModal = () => {},
}) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  useEffect(() => {
    if (!isEmpty(editTopicData)) {
      const fieldsData = {
        name: editTopicData?.name,
        // comments: editTopicData?.comments?.map(comment => comment.body),
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
        console.log("values",values)
        const data = {};
        data["name"] = values.name;
        data["user"] = currentUsername;
        // data["comments"] = values.title;
        if (editTopicData._id) {
          try {
            const res = await axios.patch(
              process.env.REACT_APP_API_URL + `/topics/${editTopicData._id}`,
              data
            );
            if (!id) {
              setTopics([...topics, res.data]);
              setRefreshData(!refreshData);
            } else {
              navigate("/topics");
            }
            Notify({
              type: "success",
              title: "Notify",
              message: "Topic was successfully edited",
            });
            setAddNewTopicModal(false);
            form.resetFields();
          } catch (err) {
            console.log(err);
          }
        } else {
          try {
            const res = await axios.post(
              process.env.REACT_APP_API_URL + "/topics",
              data
            );
            Notify({
              type: "success",
              title: "Notify",
              message: "Topic was successfully added",
            });
            setTopics([...topics, res.data]);
            setRefreshData(!refreshData);
            setAddNewTopicModal(false);
          } catch (err) {
            console.log(err);
          }
        }
      }}
    >
      <Row gutter={24}>
        <Col span={24}>
          <Form.Item label="Name" name="name" style={{ marginBottom: 5 }}>
            <Input className="desc" />
          </Form.Item>
        </Col>
      </Row>

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
        <Col span={12}>
          {id ? (
            <button
              style={{
                marginBottom: 10,
                backgroundColor: "#FFF",
                border: "1px solid #F5F5F5",
                cursor: "pointer",
              }}
              onClick={(e) => {
                e.preventDefault();
                navigate("/topics");
              }}
            >
              Back
            </button>
          ) : null}
          {id ? (
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          ) : (
            <Button
              ref={submitTopicRef}
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

export default AddNewTopicForm;
