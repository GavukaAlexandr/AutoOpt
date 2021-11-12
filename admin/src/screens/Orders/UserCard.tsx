import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Card, Divider, Typography, Input, Button } from "antd";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { errorMessage, succesMessage } from "../../helpres/messages";
import { USER_UPDATE } from "../Users/user-gql";
import { ORDER, UPDATE_ORDER } from "./order-qgl";

const { TextArea } = Input;

const { Title, Paragraph } = Typography;

export const UserCard = ({
  data,
  cardContent,
}: {
  data: Record<string, any>;
  cardContent: Record<string, any>;
}) => {
  const [updateUser] = useMutation(USER_UPDATE);
  const [comment, setComment] = useState(data.Order.user.comment);
  const [userFirstName, setUserFirstName] = useState(data.Order.user.firstName);
  const [userLastName, setUsetLastName] = useState(data.Order.user.lastName);
  const [saveButtonState, setSaveButtonState] = useState(true);
  const [cancelButtonState, setCancelButtonState] = useState(true);

  const saveComment = () => {
    updateUser({
      variables: {
        updateUserInput: {
          id: data.Order.user.id,
          comment: comment,
        },
      },
    });
  };

  const saveData = () => {
    try {
      updateUser({
        variables: {
          updateUserInput: {
            id: data.Order.user.id,
            firstName: userFirstName,
            lastName: userLastName,
            comment: comment,
          },
        },
        refetchQueries: [ORDER, "Order"],
      });
      setSaveButtonState(true);
      setCancelButtonState(true);
      return succesMessage("User updated");
    } catch (error) {
      return errorMessage(`${error}`);
    }
  };

  const cancelChanges = () => {
    setUserFirstName(data.Order.user.firstName);
    setUsetLastName(data.Order.user.lastName);
    setComment(data.Order.user.comment);
    return succesMessage('Changes was discard');
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      saveComment();
    }, 5000);
    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comment]);

  const changeButtonsState = () => {
    if (
      userFirstName.length !== 0 &&
      userFirstName !== data.Order.user.firstName
    ) {
      setCancelButtonState(false);
      return setSaveButtonState(false);
    } else if (
      userLastName.length !== 0 &&
      userLastName !== data.Order.user.lastName
    ) {
      setCancelButtonState(false);
      return setSaveButtonState(false);
    } else if (comment !== data.Order.user.comment) {
      setCancelButtonState(false);
      return setSaveButtonState(false);
    }
    setCancelButtonState(true);
    return setSaveButtonState(true);
  };

  useEffect(() => {
    changeButtonsState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userFirstName, userLastName, comment]);

  return (
    <Card className="card-style">
      <Card.Grid
        style={{
          textAlign: "center",
          width: "100%",
          paddingBottom: "0",
          paddingTop: "1rem",
        }}
        hoverable={false}
      >
        <Title level={3}>User</Title>
      </Card.Grid>

      <Card.Grid
        style={{ ...cardContent, paddingTop: "1rem" }}
        hoverable={false}
      >
        <Title style={{ display: "inline" }} level={5}>
          First Name:
        </Title>{" "}
        <Paragraph editable={{ onChange: setUserFirstName }}>
          {userFirstName}
        </Paragraph>
      </Card.Grid>
      <Card.Grid
        style={{ ...cardContent, paddingTop: "1rem" }}
        hoverable={false}
      >
        <Title style={{ display: "inline" }} level={5}>
          Last Name:
        </Title>{" "}
        <Paragraph editable={{ onChange: setUsetLastName }}>
          {userLastName}
        </Paragraph>
      </Card.Grid>

      <Card.Grid
        style={{ ...cardContent, paddingTop: "1rem" }}
        hoverable={false}
      >
        <Title style={{ display: "inline" }} level={5}>
          Phone:
        </Title>{" "}
        <h3 style={{ display: "inline" }}>
          <Paragraph style={{ display: "inline" }} copyable>
            {" "}
            {data.Order.user.phoneNumber}
          </Paragraph>
        </h3>
      </Card.Grid>

      <Card.Grid
        style={{ ...cardContent, paddingTop: "1rem" }}
        hoverable={false}
      >
        <Title style={{ display: "inline" }} level={5}>
          Email:
        </Title>{" "}
        <h3 style={{ display: "inline" }}>
          <Paragraph style={{ display: "inline" }} copyable>
            {" "}
            {data.Order.user.email}
          </Paragraph>
        </h3>
      </Card.Grid>

      <Card.Grid style={cardContent} hoverable={false}>
        <Title style={{ display: "inline" }} level={5}>
          Telegram:
        </Title>{" "}
        {data.Order.user.telegramNotification ? (
          <CheckCircleOutlined style={{ fontSize: "20px", color: "green" }} />
        ) : (
          <CloseCircleOutlined style={{ fontSize: "20px", color: "red" }} />
        )}
      </Card.Grid>
      <Card.Grid style={cardContent} hoverable={false}>
        <Title style={{ display: "inline" }} level={5}>
          Viber:
        </Title>{" "}
        {data.Order.user.viberNotification ? (
          <CheckCircleOutlined style={{ fontSize: "20px", color: "green" }} />
        ) : (
          <CloseCircleOutlined style={{ fontSize: "20px", color: "red" }} />
        )}
      </Card.Grid>
      <Card.Grid style={cardContent} hoverable={false}>
        <Title style={{ display: "inline" }} level={5}>
          Viber:
        </Title>{" "}
        {data.Order.user.phoneNotification ? (
          <CheckCircleOutlined style={{ fontSize: "20px", color: "green" }} />
        ) : (
          <CloseCircleOutlined style={{ fontSize: "20px", color: "red" }} />
        )}
      </Card.Grid>

      <Card.Grid style={cardContent} hoverable={false}>
        <Title style={{ display: "inline" }} level={5}>
          Comment about User:{" "}
        </Title>
        <ReactQuill
          theme="snow"
          value={comment}
          onChange={(v) => setComment(v)}
        />{" "}
      </Card.Grid>

      <Card.Grid style={{ textAlign: "end", ...cardContent }} hoverable={false}>
        <Button
          type="primary"
          size="large"
          disabled={cancelButtonState}
          onClick={cancelChanges}
          style={{
            paddingLeft: "1rem",
            paddingRight: "1rem",
            marginRight: "1rem",
            backgroundColor: "red",
            border: "none",
          }}
        >
          Cancel
        </Button>
        <Button
          type="primary"
          size="large"
          disabled={saveButtonState}
          onClick={saveData}
          style={{
            paddingLeft: "1rem",
            paddingRight: "1rem",
            backgroundColor: "green",
            border: "none",
          }}
        >
          Save
        </Button>
      </Card.Grid>
    </Card>
  );
};
