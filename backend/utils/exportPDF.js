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
    `${submission.facultyName || "Faculty"}-${submission.quarter}.pdf`;

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
    .font("Helvetica-Bold")
    .fontSize(20)
    .fillColor("black")
    .text(
      "SRIHER IQAC Report",
      {
        align: "center"
      }
    );

  doc.moveDown();

  doc
    .font("Helvetica")
    .fontSize(12);

  doc.text(
    `Faculty Name : ${submission.facultyName || "N/A"}`
  );

  doc.text(
    `Email : ${submission.facultyEmail || "N/A"}`
  );

  doc.text(
    `School : ${submission.school || "N/A"}`
  );

  doc.text(
    `Department : ${submission.department || "N/A"}`
  );

  doc.text(
    `Quarter : ${submission.quarter || "N/A"}`
  );

  doc.text(
    `Status : ${submission.status || "N/A"}`
  );

  doc.text(
    `Answered : ${submission.answeredCount || 0}`
  );

  doc.text(
    `Unanswered : ${submission.unansweredCount || 0}`
  );

  doc.text(
    `Submitted Date : ${
      submission.createdAt
        ? new Date(
            submission.createdAt
          ).toLocaleDateString("en-GB")
        : "N/A"
    }`
  );

  doc.moveDown(2);

  // ======================
  // ANSWER MAP
  // ======================

  const answerMap = {};

  submission.answers?.forEach(
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

      // Section starts on new page if not enough space

      if (
        doc.y + 150 >
        doc.page.height - 50
      ) {

        doc.addPage();

      }

      // ======================
      // SECTION HEADER
      // ======================

      doc
        .moveTo(
          40,
          doc.y
        )
        .lineTo(
          550,
          doc.y
        )
        .strokeColor("#dc2626")
        .lineWidth(2)
        .stroke();

      doc.moveDown(0.5);

      const sectionTitle =
        `Section ${section.sectionNo} - ${section.sectionTitle}`;

      doc
        .font("Helvetica-Bold")
        .fontSize(15)
        .fillColor("#dc2626")
        .text(
          sectionTitle,
          40,
          doc.y,
          {
            width: 510,
            align: "left"
          }
        );

      doc.moveDown(0.5);

      doc
        .moveTo(
          40,
          doc.y
        )
        .lineTo(
          550,
          doc.y
        )
        .strokeColor("#dc2626")
        .lineWidth(2)
        .stroke();

      doc.moveDown();

      // ======================
      // QUESTIONS
      // ======================

      section.questions.forEach(
        (
          question,
          index
        ) => {

          if (
            doc.y + 120 >
            doc.page.height - 50
          ) {

            doc.addPage();

          }

          const key =
            `${section.sectionNo}_${index}`;

          const answer =
            answerMap[key];

          const isImageQuestion =
            question.answerFormat?.includes(
              "Image"
            );

          const rowStartY =
            doc.y;

          // Question

          doc
            .font("Helvetica")
            .fontSize(11)
            .fillColor("black")
            .text(
              question.question,
              50,
              rowStartY,
              {
                width: 220,
                align: "left"
              }
            );

          // ======================
          // IMAGE ANSWER
          // ======================

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

              doc.image(
                imagePath,
                300,
                rowStartY,
                {
                  fit: [
                    100,
                    100
                  ]
                }
              );

              doc.y =
                rowStartY + 120;

            }

            else {

              doc
                .font("Helvetica")
                .fontSize(11)
                .fillColor("black")
                .text(
                  "Image Not Found",
                  300,
                  rowStartY,
                  {
                    width: 220
                  }
                );

              doc.y =
                rowStartY + 30;

            }

          }

          // ======================
          // NORMAL ANSWER
          // ======================

          else {

            let displayAnswer =
              answer
                ? String(
                    answer
                  )
                : "Not Answered";

            if (
              displayAnswer.includes(
                ".pdf"
              )
            ) {

              displayAnswer =
                displayAnswer
                  .split("/")
                  .pop();

            }

            doc
              .font("Helvetica")
              .fontSize(11)
              .fillColor("black")
              .text(
                displayAnswer,
                300,
                rowStartY,
                {
                  width: 220,
                  align: "left"
                }
              );

            doc.y =
              Math.max(
                doc.y,
                rowStartY + 25
              );

          }

          // ======================
          // ROW SEPARATOR
          // ======================

          doc
            .moveTo(
              40,
              doc.y
            )
            .lineTo(
              550,
              doc.y
            )
            .strokeColor("#dddddd")
            .lineWidth(1)
            .stroke();

          doc.moveDown();

        }
      );

      doc.moveDown();

    }
  );

  doc.end();

};

module.exports =
  generatePDF;