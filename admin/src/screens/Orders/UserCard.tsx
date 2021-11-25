import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Card, Divider, Typography, Input, Button } from "antd";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Order, useUpdateUserMutation } from "../../generated/graphql";
import { errorMessage, succesMessage } from "../../helpres/messages";

const { TextArea } = Input;

const { Title, Paragraph } = Typography;

export const UserCard = ({
  data,
  cardContent,
}: {
  data: Order;
  cardContent: Record<string, any>;
}) => {
  const [updateUser] = useUpdateUserMutation();
  const [comment, setComment] = useState(data.user.comment);
  const [userFirstName, setUserFirstName] = useState(data.user.firstName);
  const [userLastName, setUsetLastName] = useState(data.user.lastName);
  const [saveButtonState, setSaveButtonState] = useState(true);
  const [cancelButtonState, setCancelButtonState] = useState(true);

  const saveComment = () => {
    updateUser({
      variables: {
        updateUserInput: {
          id: data.user.id,
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
            id: data.user.id,
            firstName: userFirstName,
            lastName: userLastName,
            comment: comment,
          },
        },
      });
      setSaveButtonState(true);
      setCancelButtonState(true);
      return succesMessage("User updated");
    } catch (error) {
      return errorMessage(`${error}`);
    }
  };

  const cancelChanges = () => {
    setUserFirstName(data.user.firstName);
    setUsetLastName(data.user.lastName);
    setComment(data.user.comment);
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
      userFirstName !== data.user.firstName
    ) {
      setCancelButtonState(false);
      return setSaveButtonState(false);
    } else if (
      userLastName.length !== 0 &&
      userLastName !== data.user.lastName
    ) {
      setCancelButtonState(false);
      return setSaveButtonState(false);
    } else if (comment !== data.user.comment) {
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
          Имя:
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
          Фамилия:
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
          Телефон:
        </Title>{" "}
        <h3 style={{ display: "inline" }}>
          <Paragraph style={{ display: "inline" }} copyable>
            {" "}
            {data.user.phoneNumber}
          </Paragraph>
        </h3>
      </Card.Grid>

      <Card.Grid
        style={{ ...cardContent, paddingTop: "1rem" }}
        hoverable={false}
      >
        <Title style={{ display: "inline" }} level={5}>
          Почта:
        </Title>{" "}
        <h3 style={{ display: "inline" }}>
          <Paragraph style={{ display: "inline" }} copyable>
            {" "}
            {data.user.email}
          </Paragraph>
        </h3>
      </Card.Grid>

      <Card.Grid style={cardContent} hoverable={false}>
        <Title style={{ display: "inline" }} level={5}>
          Telegram:
        </Title>{" "}
        {data.user.telegramNotification ? (
          <CheckCircleOutlined style={{ fontSize: "20px", color: "green" }} />
        ) : (
          <CloseCircleOutlined style={{ fontSize: "20px", color: "red" }} />
        )}
      </Card.Grid>
      <Card.Grid style={cardContent} hoverable={false}>
        <Title style={{ display: "inline" }} level={5}>
          Viber:
        </Title>{" "}
        {data.user.viberNotification ? (
          <CheckCircleOutlined style={{ fontSize: "20px", color: "green" }} />
        ) : (
          <CloseCircleOutlined style={{ fontSize: "20px", color: "red" }} />
        )}
      </Card.Grid>
      <Card.Grid style={cardContent} hoverable={false}>
        <Title style={{ display: "inline" }} level={5}>
          Viber:
        </Title>{" "}
        {data.user.phoneNotification ? (
          <CheckCircleOutlined style={{ fontSize: "20px", color: "green" }} />
        ) : (
          <CloseCircleOutlined style={{ fontSize: "20px", color: "red" }} />
        )}
      </Card.Grid>

      <Card.Grid style={cardContent} hoverable={false}>
        <Title style={{ display: "inline" }} level={5}>
          Коментарий о пользователе:{" "}
        </Title>
        <ReactQuill
          theme="snow"
          value={comment as string}
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
          Отмена
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
          Сохранить
        </Button>
      </Card.Grid>
    </Card>
  );
};
