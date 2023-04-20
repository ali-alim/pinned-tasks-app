import {
  EnvironmentOutlined,
  ScheduleTwoTone,  
  OrderedListOutlined, 
  ReadOutlined,
  FormOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const Header = ({}) => {
  return (
    <div className="header-icons">
      <Link to="/">
        <div>
          <button className="pins-button">
            <OrderedListOutlined style={{ color: "tomato" }} />
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
            <FormOutlined style={{ color: "#49d8be" }} />
          </button>
        </div>
      </Link>
      <Link to="/archives">
        <div>
          <button className="archive-button">
          <ReadOutlined style={{ color: "rgba(13, 14, 97, 0.66)" }} />
          </button>
        </div>
      </Link>
    </div>
  );
};

export default Header;
