import axios from "axios";
import { isEmpty } from "lodash";
import { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Col, Input, Row, Form, Popconfirm } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import { Notify } from "../../../components/common/Notify";

const AddNewTopicTaskForm = ({
  refreshData,
  topics = [],
  setRefreshData,
  currentUsername,
  editTopicData = {},
  submitTopicRef = {},
  setTopics = () => {},
  setAddNewTopicModal = () => {},
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [topicName, setTopicName] = useState(null);
  const [topicBudget, setTopicBudget] = useState(null);

  useEffect(() => {
    if (!isEmpty(editTopicData)) {
      const fieldsData = {
        name: editTopicData?.name,
        budget: editTopicData?.budget,
      };
      setTopicName(editTopicData?.name);
      setTopicBudget(editTopicData?.budget);
      form.setFieldsValue(fieldsData);
    }
  }, [refreshData]);

  return (
    <Fragment>
      <Form
        style={{ width: "100%", height: 100 }}
        form={form}
        layout="vertical"
        onFinish={async (values) => {
          const data = {};
          data["name"] = values.name || "";
          data["user"] = currentUsername;
          data["budget"] = values.budget || "";

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
        <Row gutter={24} style={{ display: "flex" }}>
          <Col
            span={!isEmpty(editTopicData) ? 18 : 24}
            style={{ display: "flex" }}
          >
            <Form.Item
              label={<span style={{ fontWeight: 600 }}>Topic Name</span>}
              name="name"
              style={{ width: "70%", marginBottom: 5, marginRight: 15 }}
            >
              <Input
                onChange={(e) => setTopicName(e.target.value)}
                className="desc"
                style={{ color: "black" }}
              />
            </Form.Item>
            <Form.Item
              label={<span style={{ fontWeight: 600 }}>Budget</span>}
              name="budget"
              style={{ width: "30%", marginBottom: 5, marginRight: 15 }}
            >
              <Input
                onChange={(e) => setTopicBudget(e.target.value)}
                className="desc"
                style={{ color: "black" }}
                placeholder="in GEL"
              />
            </Form.Item>
          </Col>
          {id ? (
            <Col
              span={6}
              style={{
                display: "flex",
                alignItems: "center",
                marginTop: 27,
                marginLeft: -30,
              }}
            >
              <span
                className="check-button"
                onClick={() => navigate("/topics")}
              >
                <RollbackOutlined
                  style={{ color: "black", fontSize: 25, marginLeft: 10 }}
                />
              </span>
              <Popconfirm
                title="Are you sure to delete topic?"
                placement="left"
                okText="Yes"
                cancel="No"
                onConfirm={async () => {
                  try {
                    const res = await axios.delete(
                      process.env.REACT_APP_API_URL + `/topics/${id}`
                    );
                    if (res) {
                      Notify({
                        type: "success",
                        title: "Notify",
                        message: "Topic was successfully deleted",
                      });
                      navigate("/topics");
                      setRefreshData(!refreshData);
                    }
                  } catch (err) {
                    console.error(err);
                  }
                }}
              >
                <span className="check-button">
                  <DeleteOutlined />
                </span>
              </Popconfirm>
              <span
                onClick={() => {
                  axios
                    .patch(
                      process.env.REACT_APP_API_URL +
                        `/topics/${editTopicData._id}`,
                      {
                        name: topicName,
                        budget: topicBudget || "",
                      }
                    )
                    .then(() => {
                      Notify({
                        type: "success",
                        title: "Notify",
                        message: "Topic was successfully edited",
                      });
                      setRefreshData(!refreshData);
                    })
                    .catch((err) => console.error(err));
                }}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer"
                }}
              >
                <EditOutlined style={{ color: "green", fontSize: 25 }} />
              </span>
            </Col>
          ) : null}
        </Row>
        <Button
          ref={submitTopicRef}
          htmlType="submit"
          style={{
            display: "none",
          }}
        />
      </Form>
    </Fragment>
  );
};

export default AddNewTopicTaskForm;
