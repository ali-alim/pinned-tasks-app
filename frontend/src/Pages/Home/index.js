import axios from "axios";
import { Fragment, useEffect, useState } from "react";

const Home = ({ currentUsername }) => {
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

  return (
    <Fragment>
      {currentUsername ? (
        <div style={{ marginLeft: 24, marginTop: 40 }}>
          <span style={{textAlign: "center"}}><strong>{"Comments Of All Topics".toUpperCase()}</strong></span>
          {!commentsLoading ? (<div style={{marginTop: 20}} className="comments-container">
            {allComments.length
              ? allComments
                  .filter((item) => item.completed !== true)
                  .map((comment, i) => (
                    <div key={i} className="comment">
                      {comment.content}
                    </div>
                  ))
              : null}
          </div>) : null}
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
