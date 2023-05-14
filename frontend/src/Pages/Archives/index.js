import axios from "axios";
import { useQuery } from 'react-query';
import { Col, Modal, Row, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import AddNewArchiveForm from "./AddNewArchiveForm";
import { Fragment, useState, useRef } from "react";

const myStorage = window.localStorage;
const currentUsername = myStorage.getItem("user");

const Archives = () => {
  const navigate = useNavigate();
  const submitArchiveRef = useRef();
  const [refreshData, setRefreshData] = useState(false);
  const [editArchiveData, setEditArchiveData] = useState({});
  const [addNewArchiveModal, setAddNewArchiveModal] = useState(false);

  const { isLoading, data } = useQuery(['archives', refreshData], () =>
    axios.get(process.env.REACT_APP_API_URL + "/archives", {
      params: { user: currentUsername }
    })
  );

  return (
    <Fragment>
      {isLoading ? (
        <Row gutter={24} justify={"center"} style={{marginTop: 50}}><Spin /></Row>
      ) : (
        <div className="topics-page">
          <Row gutter={24}>
            <Col span={24} style={{ display: "flex", marginLeft: 4 }}>
              <div
                className="archive-add-button"
                onClick={() => setAddNewArchiveModal(true)}
              >
                Add New
              </div>
            </Col>
          </Row>
          <div className="archives">
            {data.data.map((archive, i) => (
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
          refreshData={refreshData}
        />
      </Modal>
    </Fragment>
  );
};

export default Archives;
