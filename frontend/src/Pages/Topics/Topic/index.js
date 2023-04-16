import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import AddNewTopicForm from "../AddNewTopicForm";
import { Checkbox, Col, Modal, Popconfirm, Row, Spin } from "antd";
import AddNewCommentForm from "../AddNewCommentForm";
import { isEmpty } from "lodash";
import { DeleteOutlined, MehOutlined, RetweetOutlined } from "@ant-design/icons";
import { Notify } from "../../../components/common/Notify";

const Topic = () => {
  let { id } = useParams();
  const submitCommentRef = useRef();
  const [topicLoading, setTopicLoading] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [editTopicData, setEditTopicData] = useState({});
  const [showCommentModal, setShowCommentModal] = useState(false);

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
    try{
      const res = axios.patch(process.env.REACT_APP_API_URL + `/comments/${commentId}`, data)
      if(res){
        Notify({
          type: "success",
          title: "Notify",
          message: "Comment was successfully completed",
        });
        setRefreshData(!refreshData);
      }
    } catch(err){
      console.error(err);
    }
  };

  useEffect(() => {
    getSingleTopic();
  }, [refreshData]);

  return (
    <div style={{ margin: 24 }}>
      {topicLoading ? (
        <Spin />
      ) : (
        <AddNewTopicForm
          editTopicData={editTopicData}
          refreshData={refreshData}
          setRefreshData={setRefreshData}
        />
      )}
      {!isEmpty(editTopicData) ? (
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
      ) : null}
      {!isEmpty(editTopicData) ? (
        <>
          <Col span={24} style={{ marginTop: 20, marginBottom: 20 }}>
            <span style={{ color: "#2b823d", marginLeft: 5, marginRight: 5 }}>
              <strong>COMMENTS</strong>
            </span>
            <span onClick={() => setRefreshData(!refreshData)}>
              <RetweetOutlined />
            </span>
          </Col>
        {editTopicData?.comments?.length ? (
                    <div className="comments-container">
                    {editTopicData?.comments?.map((comment, i) => (
                      <div
                        key={i}
                        style={{ display: "flex", borderBottom: "1px solid #2b823d" }}
                      >
                        <Checkbox
                          checked={comment?.completed}
                          onChange={(e) =>{
                            handleCheckboxChange(comment._id, e.target.checked)
                          }
                          }
                        >
                          <span style={{textDecoration:`${comment.completed ? "line-through" : "none"}`}}>{comment.content}</span>
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
                              color: "red",
                              cursor: "pointer",
                              fontSize: 15,
                            }}
                          >
                            <DeleteOutlined />
                          </span>
                        </Popconfirm>
                      </div>
                    ))}
                  </div>
        ) : <span style={{fontSize: 14, marginLeft: 5}}> <MehOutlined /> {"  "}No comments found</span>}
        </>
      ) : null}
      <Modal
        title="Add Comment"
        bodyStyle={{ height: 110 }}
        open={showCommentModal}
        onCancel={() => {
          setShowCommentModal(false);
        }}
        onOk={() => {
          submitCommentRef.current.click();
          setShowCommentModal(false);
        }}
        okText="Add"
        destroyOnClose={true}
      >
        <AddNewCommentForm
          submitCommentRef={submitCommentRef}
          onSubmit={async (values) => {
            const data = {};
            data["content"] = values.content;
            data["topicId"] = editTopicData._id;
            data["completed"] = false;
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
          }}
        />
      </Modal>
    </div>
  );
};

export default Topic;
