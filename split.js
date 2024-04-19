const { PDFDocument } = require("pdf-lib");
const fs = require("fs");


const uniqueSuffix = Date.now();
const filename = "file_" + uniqueSuffix + ".pdf";
const newPdfPath = "./files/download/" + filename;
const dowloadPath = "files/download/" + filename;

async function createSeparatePdfFile(uploadPath, existingPdf, requiredPages) {
  const path = uploadPath + existingPdf;
  console.log(path);
  var pdf = fs.readFileSync(path);
  const pdfDoc = await PDFDocument.load(pdf);
  const newPdf = await PDFDocument.create();

  for (i = 0; i < requiredPages.length; i++) {
    const [pages] = await newPdf.copyPages(pdfDoc, [requiredPages[i] - 1]);
    await newPdf.addPage(pages);
  }
  const finalPdf = await newPdf.save();
  fs.writeFileSync(newPdfPath, finalPdf);
  return dowloadPath;
}
module.exports = { createSeparatePdfFile };
