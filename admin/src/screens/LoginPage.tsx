import { useNavigate, useLocation } from "react-router-dom";
import { Form, Input, Button, Checkbox, Row, Col } from "antd";
// import {
//   getAuth,
//   RecaptchaVerifier,
//   signInWithPhoneNumber,
// } from "firebase/auth";
// import { initializeApp } from "firebase/app";
// import { firebaseConfig } from "./../fireBase";
// import { useEffect } from "react";

export const LoginPage = () => {
  // const app = initializeApp(firebaseConfig);
  // const auth = getAuth(app);
  let navigate = useNavigate();
  let location = useLocation();

  let state = location.state as { from: Location };
  let from = state ? state.from.pathname : "/";

  const onFinish = (values: any) => {
    localStorage.setItem("phone", values.email);
    localStorage.setItem("password", values.password);
    navigate(from, { replace: true });
  };


  // const configureCaptcha = () => {
  //   window.recaptchaVerifier = new RecaptchaVerifier(
  //     "sign-in-button",
  //     {
  //       size: "invisible",
  //       callback: (response: any) => {
  //         // reCAPTCHA solved, allow signInWithPhoneNumber.
  //         onSignInSubmit();
  //         console.log("Recaptcha verified");
  //       },
  //       defaultCountry: "UA"
  //     },
  //     auth
  //   );
  // }

  // const onSignInSubmit = () => {
  //   configureCaptcha()
  //   const appVerifier = window.recaptchaVerifier;
    
  //   signInWithPhoneNumber(auth, "+380954775236", appVerifier)
  //   .then((confirmationResult) => {
  //     window.confirmationResult = confirmationResult;
  //     console.log(confirmationResult);
  //     // ...
  //   }).catch((error) => {
  //     console.log("own error" + error);
  //   });
  // }

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
          autoComplete="off"
        >
          <Form.Item
            label="Phone"
            wrapperCol={{ span: 24 }}
            labelCol={{ span: 24 }}
            name="phone"
            rules={[{ required: true, message: "Please input your Phone!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            wrapperCol={{ span: 24 }}
            labelCol={{ span: 24 }}
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
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
        </Form>
      </Col>
    </Row>
  );
};
