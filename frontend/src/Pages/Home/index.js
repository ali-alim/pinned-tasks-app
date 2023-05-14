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
      const res = await axios.get(process.env.REACT_APP_API_URL + "/comments", {
        params: { user: currentUsername },
      });
      if (res) {
        setAllComments(res.data.sort((a, b) => a.topic.localeCompare(b.topic)));
      }
    } catch (err) {
      console.log(err);
    }
    setCommentsLoading(false);
  };

  useEffect(() => {
    getAllComments();
  }, [refreshData]);

  const handleCheckboxChange = async (id, checked, type) => {
    const data = {};
    data["completed"] = checked;
    axios
      .patch(
        process.env.REACT_APP_API_URL + `comments/${id}`,
        data
      )
      .then(() => {
        Notify({
          type: "success",
          title: "Notify",
          message: `${
            type === "comment" ? "Comment" : "Task"
          } was successfully ${checked ? "completed" : "uncompleted"}`,
        });
        setRefreshData(!refreshData);
      })
      .catch((err) => console.error(err));
  };

  const handleDelete = (id) => {
    axios
      .delete(
        process.env.REACT_APP_API_URL + `comments/${id}`
      )
      .then(() => {
        Notify({
          type: "success",
          title: "Notify",
          message: "Comment was successfully deleted",
        });
        setRefreshData(!refreshData);
      })
      .catch((err) => console.error(err));
  };  
  return (
    <Fragment>
      {currentUsername ? (
        <div style={{ marginLeft: 24, marginTop: 25 }}>
          <span
            style={{
              textAlign: "center",
              color: "tomato",
              textDecoration: "underline",
            }}
          >
            <strong>{"All Topic Subtasks".toUpperCase()}</strong>
          </span>
          {console.log("allComments",allComments)}
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
                            handleCheckboxChange(
                              comment._id,
                              e.target.checked,
                              "comment"
                            );
                          }}
                        />
                        <Popconfirm
                          title="Are you sure?"
                          placement="left"
                          okText="Yes"
                          cancel="No"
                          onConfirm={() => handleDelete(comment._id, "comment")}
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
          ) : (
            <Row gutter={24} justify="center">
              <Spin />
            </Row>
          )}
        </div>
      ) : null}
    </Fragment>
  );
};

export default Home;
