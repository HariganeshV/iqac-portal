import {
  useState,
  useEffect
} from "react";

function DynamicTableQuestion({
  columns,
  value,
  onChange
}) {

  const [rows, setRows] =
    useState(
      value || [{}]
    );
    
    useEffect(() => {

  setRows(value || [{}]);

}, [value]);
 
  const handleChange = (
  rowIndex,
  key,
  val
) => {

  const updatedRows =
    rows.map((row) => ({
      ...row
    }));

  updatedRows[rowIndex] = {
    ...updatedRows[rowIndex],
    [key]: val
  };

  setRows(updatedRows);

  onChange(updatedRows);

};

  const addRow = () => {

  const updatedRows =
    [
      ...rows.map(r => ({
        ...r
      })),
      {}
    ];

  setRows(updatedRows);

  onChange(updatedRows);

};

  return (

    <div>

      <table
        style={{
          width:"100%",
          borderCollapse:"collapse"
        }}
      >

        <thead>

          <tr>

            {
              columns.map(
                (col) => (

                  <th
                    key={col.key}
                    style={{
                      border:"1px solid #ddd",
                      padding:"10px",
                      background:"#f3f4f6"
                    }}
                  >
                    {col.label}
                  </th>

                )
              )
            }

          </tr>

        </thead>

        <tbody>

          {
            rows.map(
              (
                row,
                rowIndex
              ) => (

                <tr
                  key={rowIndex}
                >

                  {
                    columns.map(
                      (col) => (

                        <td
                          key={col.key}
                          style={{
                            border:"1px solid #ddd",
                            padding:"5px"
                          }}
                        >

                          {/* TEXTAREA */}

                          {
                            col.type ===
                            "textarea"

                            ?

                            <textarea
                              rows="3"
                              value={
                                row[col.key] || ""
                              }
                              onChange={(e)=>
                                handleChange(
                                  rowIndex,
                                  col.key,
                                  e.target.value
                                )
                              }
                              style={{
                                width:"100%"
                              }}
                            />

                            :

                            /* DROPDOWN */

                            col.type ===
                            "dropdown"

                            ?

                            <select
                              value={
                                row[col.key] || ""
                              }
                              onChange={(e)=>
                                handleChange(
                                  rowIndex,
                                  col.key,
                                  e.target.value
                                )
                              }
                              style={{
                                width:"100%"
                              }}
                            >

                              <option value="">
                                Select
                              </option>

                              {
                                col.options?.map(
                                  (option)=>(
                                    <option
                                      key={option}
                                      value={option}
                                    >
                                      {option}
                                    </option>
                                  )
                                )
                              }

                            </select>

                            :

                            /* FILE */

                            col.type ===
                            "file"

                            ?

                            <>

{
row[col.key] &&
typeof row[col.key] === "string" && (

<div
style={{
marginBottom:"10px"
}}
>

{

row[col.key]
.match(/\.(jpg|jpeg|png)$/i)

?

<img
src={`http://localhost:5000${row[col.key]}`}
alt="Preview"
style={{
maxWidth:"180px",
borderRadius:"8px"
}}
/>

:

<div
style={{
color:"green",
fontWeight:"600"
}}
>

Current File :

<div
style={{
marginTop:"8px",
display:"flex",
gap:"10px",
alignItems:"center"
}}
>

<a
href={`http://localhost:5000${row[col.key]}`}
target="_blank"
rel="noreferrer"
style={{
color:"#2563eb",
fontWeight:"600",
textDecoration:"none"
}}
>
👁 View
</a>

<button
type="button"
onClick={()=>
handleChange(
rowIndex,
col.key,
null
)
}
style={{
padding:"6px 12px",
cursor:"pointer"
}}
>
🔄 Replace File
</button>

</div>

{" "}

{
row[col.key]
.split("/")
.pop()
}

</div>

}

</div>

)

}

{
!(
row[col.key] &&
typeof row[col.key] === "string"
) && (

<input
type="file"
onChange={(e)=>
handleChange(
rowIndex,
col.key,
e.target.files[0]
)
}
/>

)
}

</> :

                            /* MULTI SELECT */

                            col.type ===
                            "multiSelect"

                            ?

                            <textarea
                              rows="2"
                              placeholder="Enter SDG Goals"
                              value={
                                row[col.key] || ""
                              }
                              onChange={(e)=>
                                handleChange(
                                  rowIndex,
                                  col.key,
                                  e.target.value
                                )
                              }
                              style={{
                                width:"100%"
                              }}
                            />

                            :

                            /* NORMAL INPUT */

                            <input
                              type={
                                col.type ===
                                "date"

                                ? "date"

                                : col.type ===
                                  "number"

                                ? "number"

                                : "text"
                              }

                              value={
                                row[col.key] || ""
                              }

                              onChange={(e)=>
                                handleChange(
                                  rowIndex,
                                  col.key,
                                  e.target.value
                                )
                              }

                              style={{
                                width:"100%"
                              }}
                            />

                          }

                        </td>

                      )
                    )
                  }

                </tr>

              )
            )
          }

        </tbody>

      </table>

      <button
        type="button"
        onClick={addRow}
        style={{
          marginTop:"10px",
          padding:"10px 15px"
        }}
      >
        + Add Row
      </button>

    </div>

  );

}

export default DynamicTableQuestion;