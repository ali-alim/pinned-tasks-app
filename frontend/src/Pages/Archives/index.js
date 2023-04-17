import { Fragment, useState, useEffect, useRef } from "react";
import AddNewArchiveForm from "./AddNewArchiveForm";
import { Button, Col, Modal, Row } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const myStorage = window.localStorage;

const CustomFooter = ({ onCancel, onOk }) => (
  <div style={{ display: "flex", justifyContent: "flex-start" }}>
    <Button onClick={onCancel}>Back</Button>
    <Button type="primary" onClick={onOk}>
      Save
    </Button>
  </div>
);

const Archives = () => {
  const [currentUsername, setCurrentUsername] = useState(
    myStorage.getItem("user")
  );
  const submitArchiveRef = useRef();
  const navigate = useNavigate();
  const [editArchiveData, setEditArchiveData] = useState({});
  const [addNewArchiveModal, setAddNewArchiveModal] = useState(false);
  const [refreshData, setRefreshData] = useState(false);
  const [archives, setArchives] = useState([]);
  const [archivesLoading, setArchivesLoading] = useState(false);

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
      <Modal
        title={editArchiveData?.title ? "Edit Archive" : "Add Archive"}
        bodyStyle={{ height: 200 }}
        open={addNewArchiveModal}
        footer={
          <CustomFooter
            onCancel={() => {
              setAddNewArchiveModal(false);
              setEditArchiveData({});
            }}
            onOk={() => submitArchiveRef.current.click()}
          />
        }
        destroyOnClose={true}
      >
        <AddNewArchiveForm
          archives={archives}
          setArchives={setArchives}
          refreshData={refreshData}
          setRefreshData={setRefreshData}
          currentUsername={currentUsername}
          // editArchiveData={editArchiveData}
          setAddNewArchiveModal={setAddNewArchiveModal}
          submitArchiveRef={submitArchiveRef}
        />
      </Modal>
    </Fragment>
  );
};

export default Archives;
