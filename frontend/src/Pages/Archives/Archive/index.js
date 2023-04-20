import { useEffect, useState, Fragment } from "react";
import { useParams } from "react-router-dom";
import { Spin } from "antd";
import axios from "axios";
import AddNewArchiveForm from "./../AddNewArchiveForm"

const Archive = () => {
  let { id } = useParams();
  const [archiveLoading, setArchiveLoading] = useState(false);
  const [editArchiveData, setEditArchiveData] = useState({});
  const [refreshData, setRefreshData] = useState(false);

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
            setRefreshData={setRefreshData}
            refreshData={refreshData}
          />
        </div>
      )}
    </Fragment>
  );
};

export default Archive;
