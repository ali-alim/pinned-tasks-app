import axios from "axios";
import { isEmpty } from "lodash";
import { useParams } from "react-router-dom";
import { useEffect, useState, useRef, Fragment } from "react";
import { Checkbox, Col, Modal, Popconfirm, Row, Spin } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  MehOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Notify } from "../../../components/common/Notify";
import AddNewCommentForm from "../AddNewCommentForm";
import AddNewTopicForm from "../AddNewTopicForm";

const myStorage = window.localStorage;
const currentUsername = myStorage.getItem("user");

const Topic = () => {
  let { id } = useParams();
  const submitCommentRef = useRef();
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

  function getSumOfNumbersFromComments(obj) {
    let sum = 0;
    // Iterate through each comment in the object
    for (const comment of obj.comments) {
      // Extract numbers from the "content" property using regular expressions
      const numbers = comment.content.match(/\d+/g);
      // If numbers were found, add them up to the sum
      if (numbers) {
        sum += numbers.reduce((acc, num) => acc + parseInt(num), 0);
      }
    }
    return sum;
  }

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

  const handleCheckboxChange = async (commentId, checked) => {
    const data = {};
    data["completed"] = checked;
    try {
      const res = axios.patch(
        process.env.REACT_APP_API_URL + `/comments/${commentId}`,
        data
      );
      if (res) {
        Notify({
          type: "success",
          title: "Notify",
          message: `Comment was successfully ${
            checked ? "completed" : "uncompleted"
          }`,
        });
        setRefreshData(!refreshData);
      }
    } catch (err) {
      console.error(err);
    }
  };

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
                  Add new task
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
                      <strong>List of Tasks For This Topic</strong>
                    </span>
                    <span
                      style={{ cursor: "pointer" }}
                      onClick={() => setRefreshData(!refreshData)}
                    >
                      <SyncOutlined />
                    </span>
                  </div>
                  {editTopicData?.comments?.length ? (
                    <div className="effectiveness-div">
                      <div>
                        <span style={{ color: "slateblue" }}>
                          <strong>Done: </strong>
                        </span>
                        {completedNumber},{" "}
                        <span style={{ color: "red" }}>
                          <strong>Left: </strong>
                        </span>
                        {notCompletedNumber}
                      </div>
                      <hr style={{ color: "darkmagenta" }} />
                      <div>
                        <span style={{ color: "darkmagenta" }}>
                          <strong>Success: </strong>
                        </span>
                        <strong>
                          <i>
                            {Math.round(
                              (completedNumber /
                                editTopicData?.comments?.length) *
                                100
                            )}
                            %
                          </i>
                        </strong>
                      </div>
                    </div>
                  ) : null}
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
                      />
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
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span
                          style={{
                            marginLeft: 40,
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
                              marginLeft: 40,
                              marginTop: 0,
                              fontSize: 10,
                              fontStyle: "italic",
                              color: "slateblue",
                            }}
                          >
                            {new Date(comment.updatedAt).toLocaleDateString()}
                          </span>
                        ) : null}
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
              <div style={{ marginTop: 20 }} />
              {typeof editTopicData.name.match(/\d+/g)?.length ? (
                <div className="budjet">
                  <div>
                    <span>
                      Balance now:{" "}
                      <strong>{editTopicData.name.match(/\d+/g)}</strong> GEL
                    </span>
                  </div>
                  <div>
                    <span>
                      Items cost:{" "}
                      {editTopicData.comments.map((comment, i) => {
                        return (
                          <span key={i}>
                            {comment.content.match(/\d+/g)}
                            {i === editTopicData.comments.length - 1
                              ? " = "
                              : "+"}
                          </span>
                        );
                      })}
                      <span style={{ color: "tomato" }}>
                        {getSumOfNumbersFromComments(editTopicData)} GEL
                      </span>
                    </span>
                  </div>

                  <div>
                    <span>
                      After spending you will have:{" "}
                      <span
                        style={{
                          color: "slateblue",
                          textDecoration: "underline",
                        }}
                      >
                        <strong>
                          {editTopicData.name.match(/\d+/g) -
                            getSumOfNumbersFromComments(editTopicData)}
                        </strong>
                      </span>{" "}
                      GEL
                    </span>
                  </div>
                </div>
              ) : null}
            </>
          ) : null}
        </div>
      )}
      <Modal
        title={!isEmpty(editCommentData) ? "Edit Task" : "Add Task"}
        bodyStyle={{ height: 110 }}
        open={showCommentModal}
        onCancel={() => {
          setShowCommentModal(false);
          setEditCommentData({});
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
          onSubmit={async (values) => {
            const data = {};
            data["content"] = values.content;
            data["topicId"] = editTopicData._id;
            data["completed"] = false;
            data["user"] = currentUsername;
            if (!isEmpty(editCommentData)) {
              try {
                const res = await axios.patch(
                  process.env.REACT_APP_API_URL +
                    `/comments/${editCommentData._id}`,
                  data
                );
                if (res) {
                  setRefreshData(!refreshData);
                  setEditCommentData({});
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
