import { Button, Col, Input, Row, Form, Popconfirm } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { Fragment, useEffect } from "react";
import { isEmpty } from "lodash";
import axios from "axios";
import { Notify } from "../../../components/common/Notify";
import { CloseCircleFilled, RollbackOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const AddNewArchive = ({
  setAddNewArchiveModal = () => {},
  setArchives = () => {},
  submitArchiveRef = {},
  editArchiveData = {},
  currentUsername,
  setRefreshData,
  archives = [],
  refreshData,
}) => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isEmpty(editArchiveData)) {
      const fieldsData = {
        name: editArchiveData?.name,
      };
      form.setFieldsValue(fieldsData);
    }
  }, [refreshData]);

  return (
    <Fragment>
      <Form
        style={{ width: "100%", height: 100 }}
        form={form}
        layout="vertical"
        onFinish={async (values) => {
          const data = {};
          data["name"] = values.name;
          data["user"] = currentUsername;
          data["inputs"] = values.inputs || [];

          if (editArchiveData._id) {
            try {
              const res = await axios.patch(
                process.env.REACT_APP_API_URL +
                  `/archives/${editArchiveData._id}`,
                data
              );
              if (!id) {
                setArchives([...archives, res.data]);
                setRefreshData(!refreshData);
              } else {
                navigate("/archives");
              }
              Notify({
                type: "success",
                title: "Notify",
                message: "Archive was successfully edited",
              });
              setAddNewArchiveModal(false);
              form.resetFields();
            } catch (err) {
              console.log(err);
            }
          } else {
            try {
              const res = await axios.post(
                process.env.REACT_APP_API_URL + "/archives",
                data
              );
              Notify({
                type: "success",
                title: "Notify",
                message: "Archive was successfully added",
              });
              setArchives([...archives, res.data]);
              setRefreshData(!refreshData);
              setAddNewArchiveModal(false);
            } catch (err) {
              console.log(err);
            }
          }
        }}
      >
        <Row gutter={24} style={{ display: "flex" }}>
          <Col span={!isEmpty(editArchiveData) ? 18 : 24}>
            <Form.Item
              label={
                <strong>
                  <u>Name</u>
                </strong>
              }
              name="name"
              style={{ width: "100%", marginBottom: 5, marginRight: 15 }}
            >
              <Input className="desc" style={{ color: "black" }} />
            </Form.Item>
          </Col>
          {id ? (
            <Col
              span={6}
              style={{ display: "flex", marginTop: 32, marginLeft: -5 }}
            >
              <Popconfirm
                title="Are you sure to delete archive?"
                placement="left"
                okText="Yes"
                cancel="No"
                onConfirm={async () => {
                  try {
                    const res = await axios.delete(
                      process.env.REACT_APP_API_URL + `/archives/${id}`
                    );
                    if (res) {
                      Notify({
                        type: "success",
                        title: "Notify",
                        message: "Archive was successfully deleted",
                      });
                      navigate("/archives");
                      setRefreshData(!refreshData);
                    }
                  } catch (err) {
                    console.error(err);
                  }
                }}
              >
                <span className="check-button">
                  <CloseCircleFilled style={{ color: "red" }} />
                </span>
              </Popconfirm>
              <span
                className="check-button"
                onClick={() => navigate("/archives")}
              >
                <RollbackOutlined
                  style={{ color: "black", fontSize: 20, marginLeft: 10 }}
                />
              </span>
            </Col>
          ) : null}
        </Row>
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              label={
                <strong>
                  <u>Input</u>
                </strong>
              }
              name="inputs"
            >
              <TextArea rows={4} placeholder="Your input text" />
            </Form.Item>
          </Col>
        </Row>
        <Button
          ref={submitArchiveRef}
          htmlType="submit"
          style={{ backgroundColor: "rgba(13, 14, 97, 0.66)", color: "#fff" }}
        >
          Save
        </Button>
        {editArchiveData?.inputs?.length ? (
          <Row gutter={24}>
            <Col span={24}>
              <div
                style={{
                  margin: 10,
                  fontSize: 15,
                  fontWeight: 500,
                  textDecoration: "underline",
                }}
              >
                Saved Inputs
              </div>
              {editArchiveData?.inputs?.map((input, i) => (
                <div
                  key={i}
                  style={{
                    marginBottom: 10,
                    width: "100%",
                    position: "relative",
                  }}
                >
                  <TextArea value={input.content} rows={6} />
                </div>
              ))}
            </Col>
          </Row>
        ) : null}
      </Form>
    </Fragment>
  );
};

export default AddNewArchive;
