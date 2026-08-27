import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportPDF = (history) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Fake News Prediction History", 14, 20);

  autoTable(doc, {
    startY: 30,
    head: [["Prediction", "Score", "Date", "News"]],
    body: history.map((item) => [
      item.prediction,
      item.score,
      new Date(item.created_at).toLocaleString(),
      item.news.substring(0, 80),
    ]),
  });

  doc.save("Prediction_History.pdf");
};