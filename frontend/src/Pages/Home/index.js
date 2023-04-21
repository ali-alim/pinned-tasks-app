import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import { Checkbox, Popconfirm, Row, Spin } from "antd";
import { Notify } from "../../components/common/Notify";
import { DeleteOutlined, LinkOutlined } from "@ant-design/icons";

const Home = ({ currentUsername }) => {
  const navigate = useNavigate();
  const [refreshData, setRefreshData] = useState(false);
  const [allComments, setAllComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);

  const getAllComments = async () => {
    setCommentsLoading(true);
    try {
      const res = await axios.get(process.env.REACT_APP_API_URL + "/comments");
      if (res) {
        setAllComments(res.data);
      }
    } catch (err) {
      console.log(err);
    }
    setCommentsLoading(false);
  };

  useEffect(() => {
    getAllComments();
  }, [refreshData]);

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
      {currentUsername ? (
        <div style={{ marginLeft: 24, marginTop: 25 }}>
          <span style={{ textAlign: "center", color: 'tomato', textDecoration: 'underline'}}>
            <strong>{"All Topic Tasks".toUpperCase()}</strong>
          </span>
          {!commentsLoading ? (
            <div style={{ marginTop: 20 }} className="comments-container">
              {allComments.length
                ? allComments
                    .filter((item) => item.completed !== true)
                    .map((comment, i) => (
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
                              navigate(`/topics/${comment.topic}/edit`);
                            }}
                            style={{
                              position: "absolute",
                              left: 20,
                              color: "slateblue",
                              cursor: "pointer",
                              fontSize: 15,
                            }}
                          >
                            <LinkOutlined />
                          </span>
                        </div>
                        <div style={{ marginLeft: 40 }}>{comment.content}</div>
                      </div>
                    ))
                : null}
            </div>
          ) : <Row gutter={24} justify="center"><Spin /></Row>}
        </div>
      ) : (
        <div style={{ marginTop: 50 }}>
          <p>Welcome to the PINNED-TASK application. </p>
          <p>Here you can create tasks, filter them by date and category.</p>
          <p>Add, Delete and Update comments to the topics</p>
          <p>You can add pinned tasks from the map as well.</p>
          <p>I hope you will enjoy this app.</p>
        </div>
      )}
    </Fragment>
  );
};

export default Home;
