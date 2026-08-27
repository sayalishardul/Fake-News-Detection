import { saveAs } from "file-saver";

export const exportCSV = (history) => {
  const headers = ["Prediction", "Score", "Date", "News"];

  const rows = history.map((item) => [
    item.prediction,
    item.score,
    new Date(item.created_at).toLocaleString(),
    item.news,
  ]);

  const csv =
    [headers, ...rows]
      .map((row) => row.map((value) => `"${value}"`).join(","))
      .join("\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  saveAs(blob, "Prediction_History.csv");
};