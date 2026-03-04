const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const inputPath = path.join(__dirname, 'workflow.txt');
const outputPath = path.join(__dirname, '..', 'workflow.pdf');

if (!fs.existsSync(inputPath)) {
  console.error('workflow.txt not found');
  process.exit(1);
}

const text = fs.readFileSync(inputPath, 'utf8');
const doc = new PDFDocument({ margin: 50, size: 'A4' });
const outStream = fs.createWriteStream(outputPath);
doc.pipe(outStream);

const lines = text.split('\n');
lines.forEach((line) => {
  if (line.startsWith('# ')) {
    doc.fontSize(20).font('Times-Bold').text(line.replace('# ', ''), { underline: false });
    doc.moveDown(0.5);
  } else if (line.startsWith('## ')) {
    doc.fontSize(14).font('Times-Bold').text(line.replace('## ', ''));
    doc.moveDown(0.25);
  } else if (line.startsWith('- ')) {
    doc.fontSize(12).font('Times-Roman').text('• ' + line.slice(2));
  } else if (line.trim() === '') {
    doc.moveDown(0.5);
  } else {
    doc.fontSize(12).font('Times-Roman').text(line);
  }
});

doc.end();
outStream.on('finish', () => {
  console.log('PDF written to', outputPath);
});
