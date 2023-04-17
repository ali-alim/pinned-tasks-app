import axios from "axios";
import { useEffect, useState, useRef, Fragment } from "react";
import { useParams } from "react-router-dom";
import { Checkbox, Col, Modal, Popconfirm, Row, Spin, Tooltip } from "antd";
import { isEmpty } from "lodash";
import {
  DeleteOutlined,
  MehOutlined,
  RetweetOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Notify } from "../../../components/common/Notify";
import AddNewArchiveForm from "./../AddNewArchiveForm"

const Archive = () => {
  let { id } = useParams();
  const submitCommentRef = useRef();
  const [archiveLoading, setArchiveLoading] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [editArchiveData, setEditArchiveData] = useState({});
  const [showCommentModal, setShowCommentModal] = useState(false);

  const getSingleArchive = async () => {
    try {
      setArchiveLoading(true);
      const singleArchive = await axios.get(
        process.env.REACT_APP_API_URL + `/archives/${id}`
      );
      setEditArchiveData(singleArchive.data);
      setArchiveLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getSingleArchive();
  }, [refreshData]);

  return (
    <Fragment>
      {archiveLoading ? (
        <div style={{ margin: 24, textAlign: "center" }}>
          <Spin />
        </div>
      ) : (
        <div style={{ margin: 24 }}>
          <AddNewArchiveForm
            editArchiveData={editArchiveData}
            refreshData={refreshData}
            setRefreshData={setRefreshData}
          />
        </div>
      )}
    </Fragment>
  );
};

export default Archive;
