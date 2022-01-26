import { useNavigate, useLocation } from "react-router-dom";
import { Form, Input, Button, Row, Col, Spin } from "antd";
import { useLoginLazyQuery } from "../generated/graphql";

export const LoginPage = () => {
  let navigate = useNavigate();
  let location = useLocation();
  const [ login, { loading, data }] = useLoginLazyQuery();

  let state = location.state as { from: Location };
  let from = state ? state.from.pathname : "/";

  const onFinish = (values: any) => {
      login({
        variables: {
         variables: {
          phoneNumber: values.phone,
          password: values.password
         }
        }
      })
    };
  
  if (!loading && data) {
    if (data.login.token.length > 0) {
      localStorage.setItem('token', `Bearer ${data.login.token}`);
      navigate(from, { replace: true });
    }
  }

  return (
    <Row
      justify="center"
      align="middle"
      style={{ height: "100vh" }}
    >
      <Col
        xs={16}
        sm={10}
        md={8}
        lg={6}
        xl={5}
        xxl={5}
        style={{
          background: "#0a0a0a",
          borderRadius: "2rem",
        }}
      >
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          size={"large"}
          style={{ padding: "1rem" }}
          autoComplete="new-login"
        >
          <Form.Item
            label="Номер телефона"
            wrapperCol={{ span: 24 }}
            labelCol={{ span: 24 }}
            name="phone"
            rules={[{ required: true, message: "Пожалуйста введите ваш номер телефона!" }]}
          >
            <Input name="phone"/>
          </Form.Item>
          <Form.Item
            label="Пароль"
            wrapperCol={{ span: 24 }}
            labelCol={{ span: 24 }}
            name="password"
            rules={[{ required: true, message: "Пожалуйста введите ваш номер пароль!" }]}
          >
            <Input.Password type={"password"}/>
          </Form.Item>
          <Form.Item>
            <Button
              // id="sign-in-button"
              type="primary"
              htmlType="submit"
            >
              Submit
            </Button>
          </Form.Item>
          {
           loading ? (
            <Row justify="center" align="middle" style={{ minHeight: "100%" }}>
              <Spin />
            </Row>
          ) : null
          }
        </Form>
      </Col>
    </Row>
  );
};
