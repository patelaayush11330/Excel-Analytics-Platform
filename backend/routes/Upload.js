router.post('/upload', upload.single('file'), async (req, res) => {
  const workbook = xlsx.readFile(req.file.path);
  const sheetName = workbook.SheetNames[0];
  const sheet = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

  const columns = Object.keys(sheet[0]);

  res.json({
    data: sheet,
    columns, // Send column names for chart options
  });
});
