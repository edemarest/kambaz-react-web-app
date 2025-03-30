export default function MultipleChoiceQuestion({
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
  const isFeedbackVisible = readOnly || complete;
  const isInputDisabled = readOnly || complete;

  return (
    <div>
      {question.choices?.map((choice: string, idx: number) => {
        const isSelected = choice === answer;
        const isCorrectChoice = choice === correctAnswer;

        const feedbackClass =
          isFeedbackVisible && isSelected
            ? isCorrect
              ? "text-success"
              : "text-danger"
            : "";

        return (
          <div key={idx} className={`form-check mb-2 ${feedbackClass}`}>
            <input
              className="form-check-input"
              type="radio"
              name={question._id}
              id={`${question._id}-${idx}`}
              value={choice}
              disabled={isInputDisabled}
              checked={isSelected}
              onChange={() => onAnswer?.(choice)}
            />
            <label
              className="form-check-label ms-2"
              htmlFor={`${question._id}-${idx}`}
            >
              {choice}
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
