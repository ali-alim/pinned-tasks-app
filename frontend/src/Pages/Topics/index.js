import { Fragment, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Col, Modal, Row } from "antd";
import axios from "axios";
import AddNewTopicForm from "./AddNewTopicForm";

const myStorage = window.localStorage;

const CustomFooter = ({ onCancel, onOk }) => (
  <div style={{ display: "flex", justifyContent: "flex-start" }}>
    <Button onClick={onCancel}>Back</Button>
    <Button type="primary" onClick={onOk}>
      Save
    </Button>
  </div>
);

const Topics = () => {
  const [currentUsername, setCurrentUsername] = useState(
    myStorage.getItem("user")
  );
  const submitTopicRef = useRef();
  const navigate = useNavigate();
  const [editTopicData, setEditTopicData] = useState({});
  const [addNewTopicModal, setAddNewTopicModal] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [topics, setTopics] = useState([]);
  const [topicsLoading, setTopicsLoading] = useState(false);

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
      <Modal
        title={editTopicData?.title ? "Edit Topic" : "Add Topic"}
        bodyStyle={{ height: 110 }}
        open={addNewTopicModal}
        footer={
          <CustomFooter
            onCancel={() => {
              setAddNewTopicModal(false);
              setEditTopicData({});
            }}
            onOk={() => submitTopicRef.current.click()}
          />
        }
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
