import { Fragment, useEffect } from "react";
import { Button, Col, Input, Row, Form, Popconfirm } from "antd";
import axios from "axios";
import { Notify } from "../../../components/common/Notify";
import { isEmpty } from "lodash";
import { useNavigate, useParams } from "react-router-dom";
import {
  CloseCircleFilled,
  CloseOutlined,
  DeleteOutlined,
  RollbackOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;

const AddNewArchive = ({
  archives = [],
  setArchives = () => {},
  refreshData,
  setRefreshData,
  currentUsername,
  editArchiveData = {},
  setAddNewArchiveModal = () => {},
  submitArchiveRef = {},
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
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
          <Col span={18}>
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
            <Form.Item label="Input" name="inputs">
              <TextArea rows={4} placeholder="Your input text" />
            </Form.Item>
          </Col>
        </Row>
        <Button
          ref={submitArchiveRef}
          htmlType="submit"
          style={{ backgroundColor: "rgb(25, 19, 224)", color: "#fff" }}
        >
          Update
        </Button>
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
                <TextArea value={input.content} rows={4} />
                <Popconfirm
                  title="Are you sure?"
                  placement="left"
                  okText="Yes"
                  cancel="No"
                  onConfirm={async () => {
                    console.log(input._id);
                  }}
                >
                  <span
                    style={{
                      cursor: "pointer",
                      position: "absolute",
                      right: 15,
                      bottom: 5,
                    }}
                  >
                    <DeleteOutlined style={{ color: "tomato" }} />
                  </span>
                </Popconfirm>
              </div>
            ))}
          </Col>
        </Row>
      </Form>
    </Fragment>
  );
};

export default AddNewArchive;
