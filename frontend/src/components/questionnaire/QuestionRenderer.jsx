import React from "react";

function QuestionRenderer({
  questionData,
  value,
  onChange
}) {

  const {
    question,
    answerFormat,
    options
  } = questionData;

  switch (answerFormat) {

    case "Text":
      return (
        <input
          type="text"
          value={value || ""}
          onChange={(e) =>
            onChange(e.target.value)
          }
          placeholder={question}
          style={inputStyle}
        />
      );

    case "Numeric":
      return (
        <input
          type="number"
          value={value || ""}
          onChange={(e) =>
            onChange(e.target.value)
          }
          placeholder={question}
          style={inputStyle}
        />
      );

    case "Decimal Number":
      return (
        <input
          type="number"
          step="0.01"
          value={value || ""}
          onChange={(e) =>
            onChange(e.target.value)
          }
          placeholder={question}
          style={inputStyle}
        />
      );

    case "DD/MM/YYYY":
      return (
        <input
          type="date"
          value={value || ""}
          onChange={(e) =>
            onChange(e.target.value)
          }
          style={inputStyle}
        />
      );

    case "URL":
      return (
        <input
          type="url"
          value={value || ""}
          onChange={(e) =>
            onChange(e.target.value)
          }
          placeholder="Enter URL"
          style={inputStyle}
        />
      );

    case "Dropdown":
      return (
        <select
          value={value || ""}
          onChange={(e) =>
            onChange(e.target.value)
          }
          style={inputStyle}
        >
          <option value="">
            Select Option
          </option>

          {options?.map(
            (option) => (
              <option
                key={option}
                value={option}
              >
                {option}
              </option>
            )
          )}
        </select>
      );

    case "Yes/No":
      return (
        <select
          value={value || ""}
          onChange={(e) =>
            onChange(e.target.value)
          }
          style={inputStyle}
        >
          <option value="">
            Select
          </option>

          <option value="Yes">
            Yes
          </option>

          <option value="No">
            No
          </option>
        </select>
      );

    case "Multi Select":
      return (
        <textarea
          rows="3"
          value={value || ""}
          onChange={(e) =>
            onChange(e.target.value)
          }
          placeholder="Enter SDG Goals"
          style={inputStyle}
        />
      );

    case "PDF Upload":
    case "PDF/Word Upload":
      return (
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) =>
            onChange(
              e.target.files[0]
            )
          }
          style={inputStyle}
        />
      );

    case "Image Upload":
    case "Image Upload (JPG/JPEG/PNG)":
      return (
        <input
          type="file"
          accept=".jpg,.jpeg,.png"
          onChange={(e) =>
            onChange(
              e.target.files[0]
            )
          }
          style={inputStyle}
        />
      );

    default:
      return (
        <input
          type="text"
          value={value || ""}
          onChange={(e) =>
            onChange(e.target.value)
          }
          style={inputStyle}
        />
      );
  }
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "8px",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  fontSize: "14px"
};

export default QuestionRenderer;