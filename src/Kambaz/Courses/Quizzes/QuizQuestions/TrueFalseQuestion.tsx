export default function TrueFalseQuestion({
    question,
    answer,
    onAnswer,
    complete,
    readOnly = false,
    isCorrect,
    correctAnswer,
  }: {
    question: any;
    answer: string;
    onAnswer?: (value: string) => void;
    complete?: boolean;
    readOnly?: boolean;
    isCorrect?: boolean;
    correctAnswer?: string;
  }) {
    const options = ["true", "false"];
    const isFeedbackVisible = readOnly || complete;
    const isInputDisabled = readOnly || complete;
  
    return (
      <div>
        {options.map((opt) => {
          const isSelected = opt === answer;
          const isCorrectChoice = opt === String(correctAnswer).toLowerCase();
  
          const className = isFeedbackVisible
            ? `form-check ${isSelected ? (isCorrect ? "text-success" : "text-danger") : ""}`
            : "form-check";
  
          return (
            <div key={opt} className={className}>
              <input
                type="radio"
                name={question._id}
                value={opt}
                disabled={isInputDisabled}
                checked={isSelected}
                onChange={() => onAnswer?.(opt)}
                className="form-check-input"
                id={`${question._id}-${opt}`}
              />
              <label className="form-check-label" htmlFor={`${question._id}-${opt}`}>
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
                {isFeedbackVisible && isSelected && (
                  <strong>{isCorrect ? " ✔️" : " ❌"}</strong>
                )}
                {isFeedbackVisible && isCorrectChoice && !isSelected && (
                  <span className="text-success"> (Correct Answer)</span>
                )}
              </label>
            </div>
          );
        })}
      </div>
    );
  }
  