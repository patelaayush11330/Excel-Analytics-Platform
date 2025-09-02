//chartcontroller.js

const ChartHistory = require("../models/chartHistory"); // Add this at top

// After chart generation logic
await ChartHistory.create({
  filename: file.originalname,
  size: file.size,
  chartType: "Bar", // Replace with actual chart type if dynamic
  fileId: file._id,
});
