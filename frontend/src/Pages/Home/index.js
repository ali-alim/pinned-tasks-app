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
  const [allTasks, setAllTasks] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);

  const getAllTasks = () => {
    axios
      .get(process.env.REACT_APP_API_URL + "/pins", {
        params: { user: currentUsername },
      })
      .then((res) => {
        setAllTasks(
          res?.data
            ?.filter((task) => task.completed !== true)
            .sort((a, b) => new Date(a.time) - new Date(b.time))
        );
      })
      .catch((error) => console.log(error));
  };

  const getAllComments = async () => {
    setCommentsLoading(true);
    try {
      const res = await axios.get(process.env.REACT_APP_API_URL + "/comments", {
        params: { user: currentUsername },
      });
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
    getAllTasks();
  }, [refreshData]);

  const handleCheckboxChange = async (id, checked, type) => {
    const data = {};
    data["completed"] = checked;
    axios
      .patch(
        process.env.REACT_APP_API_URL +
          `/${type === "comment" ? "comments" : "pins"}/${id}`,
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

  const handleDelete = (id, type) => {
    axios
      .delete(
        process.env.REACT_APP_API_URL +
          `/${type === "comment" ? "comments" : "pins"}/${id}`
      )
      .then(() => {
        Notify({
          type: "success",
          title: "Notify",
          message: `${
            type === "comment" ? "Comment" : "Task"
          } was successfully deleted`,
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
              {allTasks?.length
                ? allTasks?.map((task, i) => (
                    <div key={i} className="comment">
                      <Checkbox
                        style={{ marginTop: -1 }}
                        checked={task?.completed}
                        onChange={(e) => {
                          handleCheckboxChange(
                            task._id,
                            e.target.checked,
                            "task"
                          );
                        }}
                      />
                      <Popconfirm
                        title="Are you sure?"
                        placement="left"
                        okText="Yes"
                        cancel="No"
                        onConfirm={() => handleDelete(task._id, "task")}
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
                            navigate(`/tasks/${task._id}/edit`);
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
                      <div style={{ marginLeft: 40 }}>{task.desc}</div>
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
