const express = require("express");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());
const cors = require("cors");
const splitPdf = require("./split.js");
app.use(cors());
app.use("/files", express.static("files"));

//mongodb connection----------------------------------------------

const mongoUrl = "mongodb://localhost:27017/pdf";

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => console.log(e));
//multer------------------------------------------------------------
const multer = require("multer");
const uploadPath = "./files/uploaded/";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, "file_" + uniqueSuffix + ".pdf");
  },
});

require("./pdfDetails.js");
const PdfSchema = mongoose.model("PdfDetails");
const upload = multer({ storage: storage });

let fileName;

app.post("/upload", upload.single("file"), async (req, res) => {
  fileName = req.file.filename;
  console.log(fileName);
  try {
    await PdfSchema.create({ pdf: fileName });
    res.send({ status: "ok", File: fileName });
  } catch (error) {
    res.json({ status: error });
  }
});

app.post("/extract", async (req, res) => {
  const page = req.body.pages;
  console.log(fileName);
  const downloadpath = await splitPdf.createSeparatePdfFile(uploadPath, fileName, page);
  console.log(downloadpath);
  res.send({ DownloadPath: "http://localhost:5000/" + downloadpath });
});

app.get("/get-files", async (req, res) => {
  try {
    PdfSchema.find({}).then((data) => {
      res.send({ status: "ok", data: data });
    });
  } catch (error) { }
});

//apis----------------------------------------------------------------
app.get("/", async (req, res) => {
  res.send("Success!!!!!!");
});

const Port = 5000;
app.listen(Port, () => {
  console.log("Server Started ", Port);
});
