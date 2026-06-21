const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");

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

  // ======================
  // HEADER
  // ======================

  doc
    .fontSize(20)
    .text("SRIHER IQAC Report");

  doc.moveDown();

  doc.fontSize(12);

  doc.text(
    `Faculty Name : ${submission.facultyName}`
  );
  
  doc.text(
  `School : ${submission.school || "N/A"}`
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

  // ======================
  // ANSWER MAP
  // ======================

  const answerMap = {};

  submission.answers.forEach(
    (item) => {

      answerMap[item.questionNo] =
        item.answer;

    }
  );

  // ======================
  // QUESTIONS
  // ======================

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

          // ======================
          // IMAGE DISPLAY
          // ======================

          const isImageQuestion =
            question.answerFormat?.includes(
              "Image"
            );

          if (
            isImageQuestion &&
            answer
          ) {

            const imagePath =
              path.join(
                process.cwd(),
                answer.replace(
                  "/",
                  ""
                )
              );

            if (
              fs.existsSync(
                imagePath
              )
            ) {

              doc.text(
                "Answer :"
              );

              doc.moveDown(
                0.5
              );

              doc.image(
                imagePath,
                {
                  fit: [
                    200,
                    200
                  ],
                  align:
                    "left"
                }
              );

              doc.moveDown();

            } else {

              doc.text(
                "Answer : Image Not Found"
              );

            }

          }

          else {

            doc.text(
              `Answer : ${
                answer
                  ? String(
                      answer
                    )
                  : "Not Answered"
              }`
            );

          }

          doc.moveDown();

        }
      );

    }
  );

  doc.end();

};

module.exports =
  generatePDF;