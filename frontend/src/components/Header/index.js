import {
  PushpinFilled,
  UnorderedListOutlined,
  HomeOutlined,
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
            <HomeOutlined style={{ fontSize: 20, color: "#d25e8f" }} />
          </button>
        </div>
      </Link>
      <Link to="/tasks">
        <div>
          <button className="tasks-button">
            <UnorderedListOutlined style={{ fontSize: 20, color: "#49d8be" }} />
          </button>
        </div>
      </Link>
      <Link to="/pins">
        <div>
          <button className="pins-button">
            <PushpinFilled style={{ fontSize: 20, color: "#d25e8f" }} />
          </button>
        </div>
      </Link>
    </div>
  );
};

export default Header;
