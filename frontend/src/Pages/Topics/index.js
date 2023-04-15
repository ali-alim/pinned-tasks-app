import { Fragment, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Modal, Row } from "antd";
import axios from "axios";
import AddNewTopicForm from "./AddNewTopicForm";
import { Notify } from "../../components/common/Notify";
import moment from "moment";
import { EditOutlined } from "@ant-design/icons";

const myStorage = window.localStorage;

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
          <Col span={24} style={{display:'flex', marginLeft: 24}}>
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
            <div className="topic" key={i}
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
        bodyStyle={{ height: 330 }}
        open={addNewTopicModal}
        onCancel={() => {
          setAddNewTopicModal(false);
          setEditTopicData({});
        }}
        onOk={() => submitTopicRef.current.click()}
        okText="Save"
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
