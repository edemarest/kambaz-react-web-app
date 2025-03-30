import { useState, useEffect } from "react";

export default function MCQEditor({
  question,
  onChange,
}: {
  question: any;
  onChange: (updated: any) => void;
}) {
  const [choices, setChoices] = useState<string[]>(question.choices || []);
  const [correctIndex, setCorrectIndex] = useState<number>(question.correctChoiceIndex ?? -1);

  useEffect(() => {
    onChange({ ...question, choices, correctChoiceIndex: correctIndex });
  }, [choices, correctIndex]);

  const updateChoice = (value: string, index: number) => {
    const updated = [...choices];
    updated[index] = value;
    setChoices(updated);
  };

  const addChoice = () => setChoices([...choices, ""]);
  const removeChoice = (index: number) => setChoices(choices.filter((_, i) => i !== index));

  return (
    <div>
      <h6>Multiple Choice Options</h6>
      {choices.map((choice, i) => (
        <div key={i} className="d-flex align-items-center mb-2">
          <div className="form-check me-2">
            <input
              type="radio"
              className="form-check-input"
              checked={correctIndex === i}
              onChange={() => setCorrectIndex(i)}
              name="mcq-correct"
              id={`choice-${i}`}
            />
          </div>
          <input
            className="form-control me-2"
            value={choice}
            onChange={(e) => updateChoice(e.target.value, i)}
          />
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => removeChoice(i)}
          >
            ✕
          </button>
        </div>
      ))}
      <button className="btn btn-sm btn-outline-primary" onClick={addChoice}>+ Add Choice</button>
    </div>
  );
}
