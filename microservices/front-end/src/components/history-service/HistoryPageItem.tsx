import { CSSProperties } from "react";
import { useAppSelector } from "../../store/hook";
import { HistoryItem } from "../types";
import HistoryPageItemFullText from "./HistoryPageItemFullText";

interface HistoryPageItemProps {
  questionId: HistoryItem["questionId"];
  text: HistoryItem["text"];
  timestamp: HistoryItem["timestamp"];
  index: number;
}

const tdStyle: CSSProperties = {
  padding: "0.1rem 1rem",
};

function HistoryPageItem({
  questionId,
  text,
  timestamp,
  index,
}: HistoryPageItemProps): JSX.Element {
  const question = useAppSelector((state) => {
    const questions = state.questions;
    return questions.find((q) => q._id === questionId);
  });

  if (question === undefined) {
    window.alert(`Failed to find question with _id=${questionId}`);
    console.error(`Failed to find question with _id=${questionId}`);
    return <></>;
  }

  return (
    <tr style={{ backgroundColor: index % 2 == 0 ? "#f5f5f5" : "#e6e6e6" }}>
      <td style={tdStyle}>{question.title}</td>
      <td style={tdStyle}>
        <HistoryPageItemFullText text={text} />
      </td>
      <td style={{ ...tdStyle, textAlign: "right" }}>
        {new Date(timestamp).toLocaleString("en-GB")}
      </td>
    </tr>
  );
}

export default HistoryPageItem;
