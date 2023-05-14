import axios from "axios";
import { Col, Modal, Row, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { Fragment, useState, useRef } from "react";
import AddNewTopicForm from "./AddNewTopicForm";
import { useQuery } from 'react-query';


const myStorage = window.localStorage;
const currentUsername = myStorage.getItem("user");

const Topics = () => {
  const navigate = useNavigate();
  const submitTopicRef = useRef();
  const [topics, setTopics] = useState([]);
  const [refreshData, setRefreshData] = useState(false);
  const [editTopicData, setEditTopicData] = useState({});
  const [addNewTopicModal, setAddNewTopicModal] = useState(false);

  const { isLoading, data } = useQuery(['topics', refreshData], () =>
  axios.get(process.env.REACT_APP_API_URL + "/topics", { params: { user: currentUsername }})
);

  return (
    <Fragment>
      {isLoading ? (
        <Row gutter={24} style={{ marginTop: 50 }} justify={"center"}>
          <Spin />
        </Row>
      ) : (
        <div className="topics-page">
          <Row gutter={24}>
            <Col span={24} style={{ display: "flex", marginLeft: 4 }}>
              <div
                className="topic-add-button"
                onClick={() => setAddNewTopicModal(true)}
              >
                Add New
              </div>
            </Col>
          </Row>

          <div className="topics">
            {data.data.map((topic, i) => (
              <div
                className="topic"
                key={i}
                onClick={() => {
                  navigate(`/topics/${topic._id}/edit`);
                }}
              >
                <span>{topic.name}</span>
                <div className="comment-qty">{topic?.comments?.length}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      <Modal
        title={editTopicData?.title ? "Edit Topic" : "Add Topic"}
        bodyStyle={{ height: 110 }}
        open={addNewTopicModal}
        onCancel={() => {
          setAddNewTopicModal(false);
          setEditTopicData({});
        }}
        onOk={() => submitTopicRef.current.click()}
        okButtonProps={{ style : {backgroundColor: "slateblue"}}}
        destroyOnClose={true}
      >
        <AddNewTopicForm
          topics={topics}
          setTopics={setTopics}
          refreshData={refreshData}
          setRefreshData={setRefreshData}
          currentUsername={currentUsername}
          editTopicData={editTopicData}
          setAddNewTopicModal={setAddNewTopicModal}
          submitTopicRef={submitTopicRef}
        />
      </Modal>
    </Fragment>
  );
};

export default Topics;
