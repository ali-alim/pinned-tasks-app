import { Fragment, useEffect } from "react";
import { Button, Input, Form, Row, Col } from "antd";
import axios from "axios";
import { Notify } from "../../../components/common/Notify";

const {TextArea} = Input;

const AddNewCommentForm = ({
    submitCommentRef,
    topicId,
    refreshData,
    setRefreshData,
    setShowCommentModal,
//   setEditTopicData = () => {},
//   editTopicData = {},
}) => {

  const [commentForm] = Form.useForm();

  return (
    <Fragment>
        <Form style={{ width: "100%"}} form={commentForm} layout="vertical" onFinish={async (values) => {
            const data = {};
            data["content"] = values.content;
            data["topicId"] = topicId;

            try {
                const res = await axios.post(
                  process.env.REACT_APP_API_URL + "/comments",
                  data
                );
                Notify({
                  type: "success",
                  title: "Notify",
                  message: "Comment was successfully added",
                });
                setRefreshData(!refreshData);
              } catch (err) {
                console.log(err);
              }
        }}>
          <Row gutter={24}>
            <Col span={24}>
            <Form.Item name="content">
                <TextArea rows={4} />
            </Form.Item>
            </Col>
          </Row>
            <Button
                ref={submitCommentRef}
                htmlType="submit"
                style={{display: 'none'}}
            />
        </Form>
    </Fragment>
  );
};

export default AddNewCommentForm;
