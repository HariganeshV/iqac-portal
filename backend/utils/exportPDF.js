const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");

const generatePDF = (
  res,
  submission,
  facultyQuestions
) => {

  const doc =
    new PDFDocument({
      margin:40
    });

  const filename =
`${submission.submittedByName || "Faculty"}-${submission.quarter}.pdf`;

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
      align:"center"
    }
  );

  doc.moveDown();

  doc
  .font("Helvetica")
  .fontSize(12);

  doc.text(
`Faculty Name : ${submission.submittedByName || "N/A"}`
);

  doc.text(
`Email : ${submission.submittedByEmail || "N/A"}`
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
    (item)=>{

      answerMap[item.questionNo] =
      item.answer;

    }
  );

  // ======================
  // SECTIONS
  // ======================

  facultyQuestions.forEach(
    (section)=>{

      if (
doc.y + 180 >
doc.page.height - 50
) {
doc.addPage();
}

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

      doc
      .font("Helvetica-Bold")
      .fontSize(15)
      .fillColor("#dc2626")
      .text(
`Section ${section.sectionNo} - ${section.sectionTitle}`
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

      section.questions.forEach(

        (
          question,
          index
        )=>{

          if(
            doc.y + 120 >
            doc.page.height - 50
          ){

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

          const isFileAnswer =
typeof answer==="string" &&
answer.startsWith("/uploads/");

          const rowStartY =
doc.y;

          // LEFT COLUMN (QUESTION)

doc
  .font("Helvetica")
  .fontSize(11)
  .fillColor("black");

const questionHeight = doc.heightOfString(
  question.question,
  {
    width: 220
  }
);

let rowHeight = Math.max(
  questionHeight,
  30
);

if (
  isImageQuestion &&
  answer
) {
  rowHeight = Math.max(
    rowHeight,
    120
  );
}

doc.text(
  question.question,
  50,
  rowStartY,
  {
    width:220,
    align:"left"
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
fit:[100,100],
align:"left"
}
);

              doc.y =
                rowStartY + 120;

              // Image hyperlink

              doc
.fillColor("blue")
.fontSize(10)
.text(
"View Image",
300,
rowStartY + 105,
{
link:`http://localhost:5000${answer}`,
underline:true
}
);

              doc.fillColor("black");

              doc.moveDown();

            }

            else {

              doc
                .font("Helvetica")
                .fontSize(11)
                .fillColor("red")
                .text(
                  "Image Not Found",
                  300,
                  rowStartY
                );

              doc.y =
rowStartY +
rowHeight;

            }

          }

          // ======================
          // NORMAL ANSWER
          // ======================

          else {

            if(!isFileAnswer){

let displayAnswer =
answer
? String(answer)
: "Not Answered";

doc
.font("Helvetica")
.fontSize(11)
.fillColor("black")
.text(
displayAnswer,
300,
rowStartY
);

}
            
              if(isFileAnswer){

  const fileUrl =
`http://localhost:5000${answer}`;

  const ext =
path.extname(answer)
.toLowerCase();

  let icon = "[PDF]";

if(
ext === ".doc" ||
ext === ".docx"
){

icon = "[DOC]";

}

else if(

ext === ".xls" ||
ext === ".xlsx"

){

icon = "[XLS]";

}

else if(

ext === ".jpg" ||
ext === ".jpeg" ||
ext === ".png"

){

icon = "[IMG]";

}

  doc.moveDown(0.3);

  doc
.fillColor("blue")
.fontSize(11)
.text(
`${icon} ${path.basename(answer)}`,
300,          // X position (Answer column)
rowStartY,    // Y position (same row)
{
width:220,
align:"left",
link:fileUrl,
underline:true
}
);

doc.fillColor("black");

doc.y =
Math.max(
doc.y,
rowStartY + 25
);

  doc.fillColor("black");

}



doc.y =
rowStartY + rowHeight;

          }

          // ======================
          // ROW LINE
          // ======================

          doc
.moveTo(
40,
rowStartY + rowHeight + 8
)
.lineTo(
550,
rowStartY + rowHeight + 8
)
.strokeColor("#dddddd")
.lineWidth(1)
.stroke();

doc.y =
rowStartY + rowHeight + 18;

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