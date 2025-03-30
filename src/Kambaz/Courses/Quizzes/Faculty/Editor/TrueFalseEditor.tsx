export default function TrueFalseEditor({ question, onChange }: { question: any; onChange: (updated: any) => void }) {
    const setAnswer = (value: boolean) => {
      onChange({ ...question, correctAnswer: value });
    };
  
    return (
      <div>
        <h6>Correct Answer</h6>
        <div className="form-check">
          <input
            type="radio"
            name="truefalse"
            checked={question.correctAnswer === true}
            onChange={() => setAnswer(true)}
            className="form-check-input"
          />
          <label className="form-check-label">True</label>
        </div>
        <div className="form-check">
          <input
            type="radio"
            name="truefalse"
            checked={question.correctAnswer === false}
            onChange={() => setAnswer(false)}
            className="form-check-input"
          />
          <label className="form-check-label">False</label>
        </div>
      </div>
    );
  }
  