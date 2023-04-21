import {
  EnvironmentOutlined,
  ScheduleTwoTone,  
  OrderedListOutlined, 
  ReadOutlined,
  FormOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const Footer = ({}) => {
  return (
    <div className="footer">
      <hr />
      <Link to="/">
        <div className="footer-div">
            <OrderedListOutlined style={{ color: "tomato", fontSize: 25, marginBottom: 5 }} />
             <span style={{ color: "black", fontWeight:500}}>All</span>
        </div>
      </Link>
      <Link to="/tasks">
        <div className="footer-div">
            <ScheduleTwoTone style={{ color: "#1890ff", fontSize: 25, marginBottom: 5 }} />
            <span style={{ color: "black", fontWeight:500}}>Scheduled</span>
        </div>
      </Link>
      <Link to="/pins">
        <div className="footer-div">
            <EnvironmentOutlined style={{ color: "#d25e8f", fontSize: 25, marginBottom: 5 }} />
            <span style={{ color: "black", fontWeight:500}}>Pinned</span>
        </div>
      </Link>
      <Link to="/topics">
        <div className="footer-div">
            <FormOutlined style={{ color: "#49d8be", fontSize: 25, marginBottom: 5 }} />
            <span style={{ color: "black", fontWeight:500}}>Topics</span>
        </div>
      </Link>
      <Link to="/archives">
        <div className="footer-div">
          <ReadOutlined style={{ color: "rgba(13, 14, 97, 0.66)", fontSize: 25, marginBottom: 5 }} />
          <span style={{ color: "black", fontWeight:500}}>Archives</span>
        </div>
      </Link>
    </div>
  );
};

export default Footer;
