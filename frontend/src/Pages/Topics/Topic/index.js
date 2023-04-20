import axios from "axios";
import { isEmpty } from "lodash";
import { useParams } from "react-router-dom";
import { useEffect, useState, useRef, Fragment } from "react";
import { Checkbox, Col, Modal, Popconfirm, Row, Spin, Form } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  MehOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Notify } from "../../../components/common/Notify";
import AddNewCommentForm from "../AddNewCommentForm";
import AddNewTopicForm from "../AddNewTopicForm";

const Topic = () => {
  let { id } = useParams();
  const submitCommentRef = useRef();
  const [commentForm] = Form.useForm();
  const [topicLoading, setTopicLoading] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [editTopicData, setEditTopicData] = useState({});
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [editCommentData, setEditCommentData] = useState({});
  const [completedNumber, setCompletedNumber] = useState(null);
  const [notCompletedNumber, setNotCompletedNumber] = useState(null);

  const getSingleTopic = async () => {
    try {
      setTopicLoading(true);
      const singleTopic = await axios.get(
        process.env.REACT_APP_API_URL + `/topics/${id}`
      );
      setEditTopicData(singleTopic.data);
      setTopicLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCheckboxChange = async (commentId, completed) => {
    const data = {};
    data["completed"] = completed;
    try {
      const res = axios.patch(
        process.env.REACT_APP_API_URL + `/comments/${commentId}`,
        data
      );
      if (res) {
        Notify({
          type: "success",
          title: "Notify",
          message: "Comment was successfully completed",
        });
        setRefreshData(!refreshData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getSingleTopic();
  }, [refreshData]);

  useEffect(() => {
    setCompletedNumber(
      editTopicData?.comments?.filter((comment) => comment.completed === true)
        ?.length
    );
    setNotCompletedNumber(
      editTopicData?.comments?.filter((comment) => comment.completed !== true)
        ?.length
    );
  }, [editTopicData]);

  useEffect(() => {
    if (!isEmpty(editCommentData)) {
      commentForm.setFieldsValue({
        content: editCommentData.content,
      });
    }
  }, [editCommentData]);

  return (
    <Fragment>
      {topicLoading ? (
        <div style={{ margin: 24, textAlign: "center" }}>
          <Spin />
        </div>
      ) : (
        <div style={{ margin: 24 }}>
          <AddNewTopicForm
            editTopicData={editTopicData}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
          />
          {!isEmpty(editTopicData) ? (
            <>
              <Row>
                <div
                  className="comment-button"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowCommentModal(true);
                  }}
                >
                  Add new comment
                </div>
              </Row>
              <Row gutter={24}>
                <Col
                  span={24}
                  style={{
                    display: "flex",
                    marginTop: 20,
                    marginBottom: 20,
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <span
                      style={{
                        color: "#2b823d",
                        marginLeft: 5,
                        marginRight: 5,
                      }}
                    >
                      <strong>COMMENTS</strong>
                    </span>
                    <span onClick={() => setRefreshData(!refreshData)}>
                      <SyncOutlined />
                    </span>
                  </div>
                  <div className="effectiveness-div">
                    <div>
                      <span style={{ color: "slateblue" }}>
                        <strong>Completed: </strong>
                      </span>
                      {completedNumber}
                    </div>
                    <div>
                      <span style={{ color: "red" }}>
                        <strong>Left: </strong>
                      </span>
                      {notCompletedNumber}
                    </div>
                    <hr style={{color: 'darkmagenta'}} />
                    <div>
                      <span style={{ color: "darkmagenta" }}>
                        <strong>Success: </strong>
                      </span>
                      <strong>
                        <i>
                          {(completedNumber / editTopicData?.comments?.length) *
                            100}
                          %
                        </i>
                      </strong>
                    </div>
                  </div>
                </Col>
              </Row>
              {editTopicData?.comments?.length ? (
                <div className="comments-container">
                  {editTopicData?.comments?.map((comment, i) => (
                    <div key={i} className="comment">
                      <Checkbox
                        style={{ marginTop: -1 }}
                        checked={comment?.completed}
                        onChange={(e) => {
                          handleCheckboxChange(comment._id, e.target.checked);
                        }}
                      >
                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <span
                            style={{
                              marginLeft: 35,
                              textDecoration: `${
                                comment.completed ? "line-through" : "none"
                              }`,
                            }}
                          >
                            {comment.content}
                          </span>
                          {comment.completed ? (
                            <span
                              style={{
                                marginLeft: 35,
                                marginTop: 0,
                                fontSize: 10,
                                fontStyle: "italic",
                              }}
                            >
                              {new Date(comment.updatedAt).toLocaleDateString()}
                            </span>
                          ) : null}
                        </div>
                      </Checkbox>
                      <Popconfirm
                        title="Are you sure?"
                        placement="left"
                        okText="Yes"
                        cancel="No"
                        onConfirm={async () => {
                          try {
                            const res = await axios.delete(
                              process.env.REACT_APP_API_URL +
                                `/comments/${comment._id}`
                            );
                            if (res) {
                              Notify({
                                type: "success",
                                title: "Notify",
                                message: "Comment was successfully deleted",
                              });
                              setRefreshData(!refreshData);
                            }
                          } catch (err) {
                            console.error(err);
                          }
                        }}
                      >
                        <span
                          style={{
                            position: "absolute",
                            left: 37,
                            color: "red",
                            cursor: "pointer",
                            fontSize: 15,
                          }}
                        >
                          <DeleteOutlined />
                        </span>
                      </Popconfirm>
                      <div>
                        <span
                          onClick={() => {
                            setShowCommentModal(true);
                            setEditCommentData(comment);
                          }}
                          style={{
                            position: "absolute",
                            left: 20,
                            color: "green",
                            cursor: "pointer",
                            fontSize: 15,
                          }}
                        >
                          <EditOutlined />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <span style={{ fontSize: 14, marginLeft: 5 }}>
                  {" "}
                  <MehOutlined /> {"  "}No comments found
                </span>
              )}
            </>
          ) : null}
        </div>
      )}
      <Modal
        title={!isEmpty(editCommentData) ? "Edit Comment" : "Add Comment"}
        bodyStyle={{ height: 110 }}
        open={showCommentModal}
        onCancel={() => {
          setShowCommentModal(false);
        }}
        onOk={() => {
          submitCommentRef.current.click();
          setShowCommentModal(false);
        }}
        okText={!isEmpty(editCommentData) ? "Save" : "Add"}
        destroyOnClose={true}
      >
        <AddNewCommentForm
          submitCommentRef={submitCommentRef}
          editCommentData={editCommentData}
          commentForm={commentForm}
          onSubmit={async (values) => {
            const data = {};
            data["content"] = values.content;
            data["topicId"] = editTopicData._id;
            data["completed"] = false;
            if (!isEmpty(editCommentData)) {
              try {
                const res = await axios.patch(
                  process.env.REACT_APP_API_URL +
                    `/comments/${editCommentData._id}`,
                  data
                );
                if (res) {
                  setRefreshData(!refreshData);
                  Notify({
                    type: "success",
                    title: "Notify",
                    message: "Comment was successfully added",
                  });
                }
              } catch (err) {
                console.log(err);
              }
            } else {
              try {
                const res = await axios.post(
                  process.env.REACT_APP_API_URL + "/comments",
                  data
                );
                if (res) {
                  setRefreshData(!refreshData);
                  Notify({
                    type: "success",
                    title: "Notify",
                    message: "Comment was successfully added",
                  });
                }
              } catch (err) {
                console.log(err);
              }
            }
          }}
        />
      </Modal>
    </Fragment>
  );
};

export default Topic;
