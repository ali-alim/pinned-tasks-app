import "./../app.css";

import {
  PushpinFilled,
  CheckOutlined,
  UnorderedListOutlined,
  HomeOutlined,
} from "@ant-design/icons";

const Header = ({
  showTasks,
  setShowPins,
  setShowTasks,
  setShowCompleted,
  setShowHome,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 65,
        width: "100%",
        display: "flex",
        justifyContent: "space-evenly",
      }}
    >
      <div>
        <button
          className="pins-button"
          onClick={() => {
            setShowPins(false);
            setShowTasks(false);
            setShowCompleted(false);
            setShowHome(true);
          }}
        >
          <HomeOutlined style={{ fontSize: 20, color: "#d25e8f" }} />
        </button>
      </div>
      <div>
        <button
          className="tasks-button"
          onClick={() => {
            setShowTasks(true);
            setShowPins(false);
            setShowCompleted(false);
            setShowHome(false);
          }}
        >
          <UnorderedListOutlined style={{ fontSize: 20, color: "#49d8be" }} />
        </button>
      </div>
      <div>
        <button
          className="pins-button"
          onClick={() => {
            setShowPins(true);
            setShowTasks(false);
            setShowCompleted(false);
            setShowHome(false);
          }}
        >
          <PushpinFilled style={{ fontSize: 20, color: "#d25e8f" }} />
        </button>
      </div>
      <div>
        <button
          className="completed-button"
          onClick={() => {
            setShowCompleted(true);
            setShowPins(false);
            setShowTasks(false);
            setShowHome(false);
          }}
        >
          <CheckOutlined style={{ fontSize: 20, color: "#17125f" }} />
        </button>
      </div>
      {/* <hr
        style={{
          // margin: "20px 20px",
          color: `${showTasks ? "#49d8be" : "#d25e8f"}`,
        }}
      /> */}
    </div>
  );
};

export default Header;
