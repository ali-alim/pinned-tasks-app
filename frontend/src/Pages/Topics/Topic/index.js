import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddNewTopicForm from "../AddNewTopicForm";
import { Spin } from "antd";

const Topic = () => {
  let { id } = useParams();

  const [topicLoading, setTopicLoading] = useState(false);
  const [editTopicData, setEditTopicData] = useState({});

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
  }, [id]);

  return (
    <div style={{ margin: 24 }}>
      {topicLoading ? (
        <Spin />
      ) : (
        <AddNewTopicForm
          setEditTopicData={setEditTopicData}
          editTopicData={editTopicData}
          id={id}
        />
      )}
    </div>
  );
};

export default Topic;
