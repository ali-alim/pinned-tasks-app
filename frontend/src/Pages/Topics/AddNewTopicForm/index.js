import axios from "axios";
import { isEmpty } from "lodash";
import { Fragment, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Col, Input, Row, Form, Popconfirm } from "antd";
import { CloseCircleFilled, RollbackOutlined } from "@ant-design/icons";
import { Notify } from "../../../components/common/Notify";

const AddNewTopicForm = ({
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
  useEffect(() => {
    if (!isEmpty(editTopicData)) {
      const fieldsData = {
        name: editTopicData?.name,
      };
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
          data["name"] = values.name;
          data["user"] = currentUsername;
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
          <Col span={!isEmpty(editTopicData) ? 18 : 24}>
            <Form.Item
              label={
                <strong>
                  <u>Name</u>
                </strong>
              }
              name="name"
              style={{ width: "100%", marginBottom: 5, marginRight: 15 }}
            >
              <Input
                className="desc"
                disabled={!isEmpty(editTopicData) ? true : false}
                style={{ color: "black" }}
              />
            </Form.Item>
          </Col>
          {id ? (
            <Col
              span={6}
              style={{ display: "flex", marginTop: 32, marginLeft: -5 }}
            >
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
                  <CloseCircleFilled style={{ color: "red" }} />
                </span>
              </Popconfirm>
              <span
                className="check-button"
                onClick={() => navigate("/topics")}
              >
                <RollbackOutlined
                  style={{ color: "black", fontSize: 20, marginLeft: 10 }}
                />
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

export default AddNewTopicForm;
