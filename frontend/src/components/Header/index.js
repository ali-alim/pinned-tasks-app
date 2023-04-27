import {
  EnvironmentOutlined,
  ScheduleTwoTone,
  OrderedListOutlined,
  ReadOutlined,
  FormOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { Link } from "react-router-dom";

const Header = ({}) => {
  const [activeTab, setActiveTab] = useState(null);

  const tabs = [
    {
      label: "All",
      icon: (
        <OrderedListOutlined
          style={{ color: "tomato", fontSize: 22, marginBottom: 5 }}
        />
      ),
      link: "/",
    },
    {
      label: "Scheduled",
      icon: (
        <ScheduleTwoTone
          style={{ color: "#1890ff", fontSize: 22, marginBottom: 5 }}
        />
      ),
      link: "/tasks",
    },
    {
      label: "Pinned",
      icon: (
        <EnvironmentOutlined
          style={{ color: "#d25e8f", fontSize: 22, marginBottom: 5 }}
        />
      ),
      link: "/pins",
    },
    {
      label: "Topics",
      icon: (
        <ReadOutlined
          style={{ color: "#49d8be", fontSize: 22, marginBottom: 5 }}
        />
      ),
      link: "/topics",
    },
    {
      label: "Archives",
      icon: (
        <FormOutlined
          style={{
            color: "rgba(13, 14, 97, 0.66)",
            fontSize: 22,
            marginBottom: 5,
          }}
        />
      ),
      link: "/archives",
    },
  ];

  const renderTab = (tab, index) => {
    const isActive = activeTab === index;

    return (
      <Link to={tab.link} key={index}>
        <div
          onClick={() => setActiveTab(index)}
          style={{
            border: `${isActive ? "1px solid slateblue" : "none"}`,
            borderRadius: 6,
            backgroundColor: `${isActive ? "#2d11f41f" : "#FFF"}`
          }}
        >
          <span className={`${isActive ? "active" : ""}`}>{tab.icon}</span>
          <span className={`${isActive ? "active" : ""}`}>{tab.label}</span>
        </div>
      </Link>
    );
  };

  return <div className="top-navigation">{tabs.map(renderTab)}</div>;
};

export default Header;
