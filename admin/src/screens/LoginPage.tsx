import { useNavigate, useLocation } from "react-router-dom";
import { Form, Input, Button, Checkbox, Row, Col } from "antd";

export const LoginPage = () => {
  let navigate = useNavigate();
  let location = useLocation();

  let state = location.state as { from: Location };
  let from = state ? state.from.pathname : "/";

  const onFinish = (values: any) => {
    localStorage.setItem("email", values.email);
    localStorage.setItem("password", values.password);
    navigate(from, { replace: true });
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: "100%" }}>
      <Col xs={6}>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          size={"large"}
          style={{ padding: "1rem" }}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            wrapperCol={{ span: 24 }}
            labelCol={{ span: 24 }}
            name="email"
            rules={[{ required: true, message: "Please input your Email!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};
