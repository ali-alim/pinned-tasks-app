import { Fragment, useState, useEffect, useRef } from "react";
import AddNewArchiveForm from "./AddNewArchiveForm";
import { Button, Col, Modal, Row, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const myStorage = window.localStorage;
const currentUsername = myStorage.getItem("user");

const Archives = () => {
  const navigate = useNavigate();
  const submitArchiveRef = useRef();
  const [archives, setArchives] = useState([]);
  const [refreshData, setRefreshData] = useState(false);
  const [editArchiveData, setEditArchiveData] = useState({});
  const [archivesLoading, setArchivesLoading] = useState(false);
  const [addNewArchiveModal, setAddNewArchiveModal] = useState(false);

  const getArchives = async () => {
    try {
      setArchivesLoading(true);
      const allArchives = await axios.get(
        process.env.REACT_APP_API_URL + "/archives",
        {
          params: { user: currentUsername },
        }
      );
      setArchives(allArchives?.data);
      setArchivesLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getArchives();
  }, [refreshData]);

  return (
    <Fragment>
      {archivesLoading ? (
        <Row gutter={24} justify={"center"} style={{marginTop: 50}}><Spin /></Row>
      ) : (
        <div className="topics-page">
          <Row gutter={24}>
            <Col span={24} style={{ display: "flex", marginLeft: 24 }}>
              <div
                className="archive-add-button"
                onClick={() => setAddNewArchiveModal(true)}
              >
                Add New Archive
              </div>
            </Col>
          </Row>
          <div className="archives">
            {archives.map((archive, i) => (
              <div
                className="archive"
                key={i}
                onClick={() => {
                  navigate(`/archives/${archive._id}/edit`);
                }}
              >
                <span>{archive.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <Modal
        title={editArchiveData?.title ? "Edit Archive" : "Add Archive"}
        cancelButtonProps={{ style: { display: "none" } }}
        onOk={() => submitArchiveRef.current.click()}
        okButtonProps={{ style: { display: "none" } }}
        onCancel={() => {
          setAddNewArchiveModal(false);
          setEditArchiveData({});
        }}
        bodyStyle={{ height: 240 }}
        open={addNewArchiveModal}
        destroyOnClose={true}
      >
        <AddNewArchiveForm
          setAddNewArchiveModal={setAddNewArchiveModal}
          submitArchiveRef={submitArchiveRef}
          currentUsername={currentUsername}
          setRefreshData={setRefreshData}
          setArchives={setArchives}
          refreshData={refreshData}
          archives={archives}
        />
      </Modal>
    </Fragment>
  );
};

export default Archives;
