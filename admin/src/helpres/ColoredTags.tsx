import { Tag } from "antd";

  export const coloredTags = (value: string) => {
    let color;
    if (value === "processing") {
      color = "orange";
    }
    if (value === "sent") {
      color = "blue";
    }
    if (value === "done") {
      color = "green";
    }
    if (value === "analogue") {
      color = "purple";
    }
    if (value === "original") {
      color = "lime";
    }
    return (
      <Tag color={color} key={value}>
        <strong>{value}</strong>
      </Tag>
    );
  };