import axios from "axios";
import { Col, Modal, Row, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { Fragment, useState, useEffect, useRef } from "react";
import AddNewTopicForm from "./AddNewTopicForm";

const myStorage = window.localStorage;
const currentUsername = myStorage.getItem("user");

const Topics = () => {
  const navigate = useNavigate();
  const submitTopicRef = useRef();
  const [topics, setTopics] = useState([]);
  const [refreshData, setRefreshData] = useState(false);
  const [editTopicData, setEditTopicData] = useState({});
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [addNewTopicModal, setAddNewTopicModal] = useState(false);

  const getTopics = async () => {
    try {
      setTopicsLoading(true);
      const allTopics = await axios.get(
        process.env.REACT_APP_API_URL + "/topics",
        {
          params: { user: currentUsername },
        }
      );
      setTopics(allTopics?.data);
      setTopicsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getTopics();
  }, [refreshData]);

  return (
    <Fragment>
      {topicsLoading ? (
        <Row gutter={24} style={{ marginTop: 50 }} justify={"center"}>
          <Spin />
        </Row>
      ) : (
        <div className="topics-page">
          <Row gutter={24}>
            <Col span={24} style={{ display: "flex", marginLeft: 24 }}>
              <div
                className="topic-add-button"
                onClick={() => setAddNewTopicModal(true)}
              >
                Add New Topic
              </div>
            </Col>
          </Row>

          <div className="topics">
            {topics.map((topic, i) => (
              <div
                className="topic"
                key={i}
                onClick={() => {
                  navigate(`/topics/${topic._id}/edit`);
                }}
              >
                <span>{topic.name}</span>
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
