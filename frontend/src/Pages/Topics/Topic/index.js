import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import AddNewTopicForm from "../AddNewTopicForm";
import { Modal, Row, Spin } from "antd";
import AddNewCommentForm from "../AddNewCommentForm";
import { isEmpty } from "lodash";

const Topic = () => {
  let { id } = useParams();

  const [topicLoading, setTopicLoading] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [editTopicData, setEditTopicData] = useState({});
  const [showCommentModal, setShowCommentModal] = useState(false);
  const submitCommentRef = useRef();

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

  useEffect(() => {
    getSingleTopic();
  }, [id, refreshData]);

  return (
    <div style={{ margin: 24 }}>
      {topicLoading ? (
        <Spin />
      ) : (
        <AddNewTopicForm
          setEditTopicData={setEditTopicData}
          editTopicData={editTopicData}
          refreshData={refreshData}
          setRefreshData={setRefreshData}
          id={id}
        />
      )}
      {!isEmpty(editTopicData) ? (
        <Row style={{position: 'relative'}}>
          <div
            className="comment-button"
            onClick={() => setShowCommentModal(true)}
          >
            Add new comment
          </div>
        </Row>
      ) : null}
      <Modal
        title="Add Comment"
        // title={editPinData?.title ? "Edit Task" : "Add Task"}
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
          setShowCommentModal={setShowCommentModal}
          topicId={editTopicData._id}
          refreshData={refreshData}
          setRefreshData={setRefreshData}
        />
      </Modal>
    </div>
  );
};

export default Topic;
