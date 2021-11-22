import { Tag } from "antd";

  export const coloredTags = (value: string) => {
    let color;
    if (value === "PROCESSING") {
      color = "orange";
    }
    if (value === "SENT") {
      color = "blue";
    }
    if (value === "DONE") {
      color = "green";
    }
    if (value === "ANALOGUE") {
      color = "purple";
    }
    if (value === "ORIGINAL") {
      color = "lime";
    }
    return (
      <Tag color={color} key={value}>
        <strong>{value.toLowerCase()}</strong>
      </Tag>
    );
  };