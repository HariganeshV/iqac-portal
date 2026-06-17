function NavigationButtons({

  onPrevious,
  onNext,
  onSave,

  disablePrevious,
  disableNext

}) {

  return (

    <div
      style={{
        display: "flex",
        gap: "15px",
        marginTop: "30px"
      }}
    >

      <button
        onClick={onPrevious}
        disabled={disablePrevious}
        style={buttonStyle}
      >
        Previous
      </button>

      <button
        onClick={onSave}
        style={{
          ...buttonStyle,
          background: "#f59e0b"
        }}
      >
        Save Response
      </button>

      <button
        onClick={onNext}
        disabled={disableNext}
        style={{
          ...buttonStyle,
          background: "#2563eb"
        }}
      >
        Next
      </button>

    </div>

  );
}

const buttonStyle = {

  padding: "12px 25px",

  border: "none",

  borderRadius: "8px",

  background: "#6b7280",

  color: "#fff",

  cursor: "pointer",

  fontWeight: "600"
};

export default NavigationButtons;