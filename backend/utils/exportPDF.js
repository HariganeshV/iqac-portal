const PDFDocument = require("pdfkit");

const generatePDF = (
  res,
  submission,
  facultyQuestions
) => {

  const doc = new PDFDocument({
    margin: 40
  });

  const filename =
    `${submission.quarter}_${submission.facultyName}.pdf`;

  res.setHeader(
    "Content-Type",
    "application/pdf"
  );

  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${filename}"`
  );

  doc.pipe(res);

  doc
    .fontSize(20)
    .text("SRIHER IQAC Report");

  doc.moveDown();

  doc.fontSize(12);

  doc.text(
    `Faculty Name : ${submission.facultyName}`
  );

  doc.text(
    `Department : ${submission.department}`
  );

  doc.text(
    `Quarter : ${submission.quarter}`
  );

  doc.text(
    `Status : ${submission.status}`
  );

  doc.moveDown();

  const answerMap = {};

  submission.answers.forEach(
    (item) => {

      answerMap[item.questionNo] =
        item.answer;

    }
  );

  facultyQuestions.forEach(
    (section) => {

      doc.moveDown();

      doc
        .fontSize(16)
        .text(
          `Section ${section.sectionNo}`
        );

      doc
        .fontSize(14)
        .text(
          section.sectionTitle
        );

      doc.moveDown();

      section.questions.forEach(
        (
          question,
          index
        ) => {

          const key =
            `${section.sectionNo}_${index}`;

          const answer =
            answerMap[key];

          doc
            .fontSize(11)
            .text(
              `Question No : ${key}`
            );

          doc.text(
            `Question : ${question.question}`
          );

          doc.text(
            `Answer : ${
              answer
                ? String(answer)
                : "Not Answered"
            }`
          );

          doc.moveDown();
        }
      );
    }
  );

  doc.end();
};

module.exports =
  generatePDF;