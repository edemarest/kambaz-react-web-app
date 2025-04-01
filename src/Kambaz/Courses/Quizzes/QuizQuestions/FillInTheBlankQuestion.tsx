export default function FillInTheBlankQuestion({
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
}): JSX.Element {
  const isFeedbackVisible = readOnly || complete;
  const isInputDisabled = readOnly || complete;

  return (
    <div>
      <input
        type="text"
        className={`form-control ${
          isFeedbackVisible ? (isCorrect ? "is-valid" : "is-invalid") : ""
        }`}
        value={answer || ""}
        onChange={(e) => onAnswer?.(e.target.value)}
        disabled={isInputDisabled}
      />
      {isFeedbackVisible && (
        <div className={isCorrect ? "valid-feedback" : "invalid-feedback"}>
          {isCorrect ? "Correct!" : `Correct answer: ${correctAnswer}`}
        </div>
      )}
    </div>
  );
}
