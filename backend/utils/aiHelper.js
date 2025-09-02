exports.generateInsightsFromData = (data) => {
  if (!Array.isArray(data) || data.length < 2) return ["Not enough data."];

  const headers = Object.keys(data[0]);
  const insights = [];

  headers.forEach((key) => {
    const values = data.map((row) => parseFloat(row[key])).filter((v) => !isNaN(v));
    if (values.length === 0) return;

    const sum = values.reduce((a, b) => a + b, 0);
    const avg = (sum / values.length).toFixed(2);
    const min = Math.min(...values);
    const max = Math.max(...values);

    insights.push(
      `📌 Column "${key}": Average = ${avg}, Min = ${min}, Max = ${max}, Count = ${values.length}`
    );
  });

  return insights.length > 0 ? insights : ["No numeric data found for insights."];
};
