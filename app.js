const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const mongoose = require('mongoose')
const process = require('process')
const dotenv = require('dotenv');
dotenv.config();
const app = express();
app.use(express.json());
const cors = require("cors");
const splitPdf = require("./split.js");
app.use(cors());
app.use("/files", express.static("files"));
const DB = process.env.DB;
const DOWNLOADPATH = process.env.DOWNLOADPATH;

// const client = new MongoClient(DB, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

//mongodb connection----------------------------------------------
// console.log(process.env.NODE_ENV);
mongoose
  .connect(DB, {
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
  let page = req.body.pages;
  console.log(fileName);
  let downloadpath = await splitPdf.createSeparatePdfFile(uploadPath, fileName, page);
  console.log(downloadpath);
  res.send({ DownloadPath: DOWNLOADPATH + downloadpath });
});

app.get("/get-files", async (req, res) => {
  res.send('Welcome to getFiles');
  // try {
  //   PdfSchema.find({}).then((data) => {
  //     res.send({ status: "ok", data: data });
  //   });
  // } catch (error) { }
});

//apis----------------------------------------------------------------
app.get("/", async (req, res) => {
  res.send("Success!!!!!!");
});

const Port = 5000;
app.listen(Port, () => {
  console.log("Server Started ", Port);
});
