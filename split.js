const { PDFDocument } = require("pdf-lib");
const fs = require("fs");




//function takes 3 parameters from extract api function 

async function createSeparatePdfFile(uploadPath, existingPdf, requiredPages) {
  let uniqueSuffix = Date.now();
  let filename = "file_" + uniqueSuffix + ".pdf";
  let newPdfPath = "./files/download/" + filename;
  let dowloadPath = "files/download/" + filename;
  let path = uploadPath + existingPdf;
  console.log(path);
  var pdf = fs.readFileSync(path);
  const pdfDoc = await PDFDocument.load(pdf);
  let newPdf = await PDFDocument.create();

  for (i = 0; i < requiredPages.length; i++) {
    let [pages] = await newPdf.copyPages(pdfDoc, [requiredPages[i] - 1]);
    newPdf.addPage(pages);
  }
  let finalPdf = await newPdf.save();
  fs.writeFileSync(newPdfPath, finalPdf);
  return dowloadPath;
}
module.exports = { createSeparatePdfFile };
