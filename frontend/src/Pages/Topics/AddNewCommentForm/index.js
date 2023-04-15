import { Fragment } from "react";
import { Button, Input, Form, Row, Col } from "antd";

const { TextArea } = Input;

const AddNewCommentForm = ({
  submitCommentRef,
  onSubmit
}) => {
  const [commentForm] = Form.useForm();

  return (
    <Fragment>
      <Form
        style={{ width: "100%" }}
        form={commentForm}
        layout="vertical"
        onFinish={onSubmit}
      >
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
          style={{ display: "none" }}
        />
      </Form>
    </Fragment>
  );
};

export default AddNewCommentForm;
