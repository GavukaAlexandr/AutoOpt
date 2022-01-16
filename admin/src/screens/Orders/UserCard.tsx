import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Card, Typography, Button } from "antd";
import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useUpdateUserMutation } from "../../generated/graphql";
import { errorMessage, succesMessage } from "../../helpres/messages";

const { Title, Paragraph } = Typography;

export const UserCard = ({
  record,
  cardContent,
}: {
  record: Record<string, any>;
  cardContent: Record<string, any>;
}) => {
  const [updateUser] = useUpdateUserMutation();
  const [comment, setComment] = useState(record.userComment);
  const [userFirstName, setUserFirstName] = useState(record.firstName);
  const [userLastName, setUsetLastName] = useState(record.lastName);
  const [saveButtonState, setSaveButtonState] = useState(true);
  const [cancelButtonState, setCancelButtonState] = useState(true);

  const saveData = () => {
    try {
      updateUser({
        variables: {
          updateUserInput: {
            id: record.userId,
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
    setUserFirstName(record.firstName);
    setUsetLastName(record.lastName);
    setComment(record.userComment);
    return succesMessage('Changes was discard');
  }

  const changeButtonsState = () => {
    if (
      userFirstName.length !== 0 &&
      userFirstName !== record.firstName
    ) {
      setCancelButtonState(false);
      return setSaveButtonState(false);
    } else if (
      userLastName.length !== 0 &&
      userLastName !== record.lastName
    ) {
      setCancelButtonState(false);
      return setSaveButtonState(false);
    } else if (comment !== record.userComment) {
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
            {record.phoneNumber}
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
            {record.email}
          </Paragraph>
        </h3>
      </Card.Grid>

      <Card.Grid style={cardContent} hoverable={false}>
        <Title style={{ display: "inline" }} level={5}>
          Telegram:
        </Title>{" "}
        {record.telegramNotification ? (
          <CheckCircleOutlined style={{ fontSize: "20px", color: "green" }} />
        ) : (
          <CloseCircleOutlined style={{ fontSize: "20px", color: "red" }} />
        )}
      </Card.Grid>
      <Card.Grid style={cardContent} hoverable={false}>
        <Title style={{ display: "inline" }} level={5}>
          Viber:
        </Title>{" "}
        {record.viberNotification ? (
          <CheckCircleOutlined style={{ fontSize: "20px", color: "green" }} />
        ) : (
          <CloseCircleOutlined style={{ fontSize: "20px", color: "red" }} />
        )}
      </Card.Grid>
      <Card.Grid style={cardContent} hoverable={false}>
        <Title style={{ display: "inline" }} level={5}>
          Viber:
        </Title>{" "}
        {record.phoneNotification ? (
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
