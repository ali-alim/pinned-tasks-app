import {
  PushpinFilled,
  UnorderedListOutlined,
  HomeOutlined,
  ScheduleTwoTone,
  DollarTwoTone,
  DollarCircleFilled,
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
            <PushpinFilled style={{ color: "#d25e8f" }} />
          </button>
        </div>
      </Link>
      <Link to="/finances">
        <div>
          <button className="finances-button">
            <DollarCircleFilled style={{ color: "#49d8be" }} />
          </button>
        </div>
      </Link>
    </div>
  );
};

export default Header;
