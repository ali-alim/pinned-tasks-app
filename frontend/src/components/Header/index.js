import {
  HomeOutlined, 
  ScheduleTwoTone,
  DollarCircleFilled,
  EnvironmentOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const Header = ({}) => {
  return (
    <div
      style={{
        width: "100%",
        marginLeft: 24,
        display: "flex",
        justifyContent: "flex-start",
      }}
    >
      <Link to="/">
        <div>
          <button className="pins-button">
            <HomeOutlined style={{ color: "tomato" }} />
          </button>
        </div>
      </Link>
      <Link to="/tasks">
        <div>
          <button className="tasks-button">
            <ScheduleTwoTone style={{ color: "#1890ff" }} />
          </button>
        </div>
      </Link>
      <Link to="/pins">
        <div>
          <button className="pins-button">
            <EnvironmentOutlined style={{ color: "#d25e8f" }} />
          </button>
        </div>
      </Link>
      <Link to="/topics">
        <div>
          <button className="topics-button">
            <DollarCircleFilled style={{ color: "#49d8be" }} />
          </button>
        </div>
      </Link>
      <Link to="/archives">
        <div>
          <button className="archive-button">
          <ReadOutlined style={{ color: "rgb(25, 19, 224)" }} />
          </button>
        </div>
      </Link>
    </div>
  );
};

export default Header;
