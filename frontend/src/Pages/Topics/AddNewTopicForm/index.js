import { Fragment, useEffect, useRef, useState } from "react";
import { Button, Col, Input, Row, Form, Modal, Checkbox } from "antd";
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
    <Fragment>
      <Form
        style={{ width: "100%" }}
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
        {!isEmpty(editTopicData) ? (
          <div>
            <span
              style={{
                fontWeight: "bold",
                fontSize: 20,
                marginTop: 60,
                color: "rgb(137, 70, 236)",
              }}
            >
              Topic Info
            </span>
          </div>
        ) : null}
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item label="Name" name="name" style={{ marginBottom: 5, marginRight:73 }}>
              <Input className="desc" />
            </Form.Item>
          </Col>

          {!isEmpty(editTopicData) ? (
            <>
              <Col span={24} style={{ marginTop: 20, marginBottom: 20 }}>
                <span style={{ color: "#2b823d", marginLeft: 5 }}>
                  <strong>
                    COMMENTS
                  </strong>
                </span>
              </Col>
              <div className="comments-container">
              {editTopicData?.comments?.map((comment, i) => (
                <div key={i} style={{display:'flex'}}>
                  <Checkbox><span>{comment.content}</span></Checkbox>
                </div>
              ))}
              </div>
            </>
          ) : null}
        </Row>

        <Row
          gutter={24}
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          {id ? (
            <button
              style={{
                backgroundColor: "rgb(255, 255, 255)",
                border: "1px solid rgb(245, 245, 245)",
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 10,
                fontSize: 14,
                height: 32,
                padding: "4px 15px",
              }}
              onClick={(e) => {
                e.preventDefault();
                navigate("/topics");
              }}
            >
              Back
            </button>
          ) : null}
          {/* {id ? ( */}
          {/* <Button type="primary" htmlType="submit">
            Save
          </Button> */}
          {/* ) : ( */}
          <Button
            ref={submitTopicRef}
            htmlType="submit"
            style={{
              display: "none",
            }}
          />
          {/* )} */}
        </Row>
      </Form>
    </Fragment>
  );
};

export default AddNewTopicForm;
