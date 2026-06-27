import React from "react";

function SingleRecordQuestion({
  fields,
  value,
  onChange
}) {

  const data = value || {};

  const handleChange = (
    key,
    val
  ) => {

    onChange({
      ...data,
      [key]: val
    });

  };

  return (

    <div>

      {

        fields.map(
          (field) => (

            <div
              key={field.key}
              style={{
                marginBottom:"20px"
              }}
            >

              <label
                style={{
                  display:"block",
                  fontWeight:"600",
                  marginBottom:"8px"
                }}
              >
                {
                  field.label ||
                  field.key
                }
              </label>

              {

                field.type === "textarea" ? (

                  <textarea
                    rows="4"
                    value={
                      data[field.key] || ""
                    }
                    onChange={(e)=>
                      handleChange(
                        field.key,
                        e.target.value
                      )
                    }
                    style={{
                      width:"100%",
                      padding:"10px"
                    }}
                  />

                ) :

                field.type === "file" ? (

  <>

    {
      data[field.key] &&
      typeof data[field.key] === "string" && (

        <div
          style={{
            marginBottom: "10px"
          }}
        >

          {
            data[field.key].match(/\.(jpg|jpeg|png)$/i)

            ?

            <>

              <img
                src={`http://localhost:5000${data[field.key]}`}
                alt="Uploaded"
                style={{
                  maxWidth: "220px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  marginBottom: "10px"
                }}
              />

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center"
                }}
              >

                <a
                  href={`http://localhost:5000${data[field.key]}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: "#2563eb",
                    textDecoration: "none",
                    fontWeight: "600"
                  }}
                >
                  👁 View Image
                </a>

                <button
                  type="button"
                  onClick={() =>
                    handleChange(
                      field.key,
                      null
                    )
                  }
                  style={{
                    padding: "8px 14px",
                    cursor: "pointer"
                  }}
                >
                  🔄 Replace Image
                </button>

              </div>

            </>

            :

            <>

              <div
                style={{
                  color: "green",
                  fontWeight: "600",
                  marginBottom: "10px"
                }}
              >
                Current File :
                {" "}
                {
                  data[field.key]
                    .split("/")
                    .pop()
                }
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center"
                }}
              >

                <a
                  href={`http://localhost:5000${data[field.key]}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: "#2563eb",
                    textDecoration: "none",
                    fontWeight: "600"
                  }}
                >
                  👁 View File
                </a>

                <button
                  type="button"
                  onClick={() =>
                    handleChange(
                      field.key,
                      null
                    )
                  }
                  style={{
                    padding: "8px 14px",
                    cursor: "pointer"
                  }}
                >
                  🔄 Replace File
                </button>

              </div>

            </>

          }

        </div>

      )
    }

    {

      !(

        data[field.key] &&
        typeof data[field.key] === "string"

      ) && (

        <input
          type="file"
          onChange={(e)=>
            handleChange(
              field.key,
              e.target.files[0]
            )
          }
        />

      )

    }

  </>

) :

                (

                  <input
                    type="text"
                    value={
                      data[field.key] || ""
                    }
                    onChange={(e)=>
                      handleChange(
                        field.key,
                        e.target.value
                      )
                    }
                    style={{
                      width:"100%",
                      padding:"10px"
                    }}
                  />

                )

              }

            </div>

          )
        )

      }

    </div>

  );

}

export default SingleRecordQuestion;