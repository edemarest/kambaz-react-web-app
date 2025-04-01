export default function FillinTheBlankEditor({
  question,
  onChange,
}: {
  question: any;
  onChange: (updated: any) => void;
}) {
  const updateAnswers = (text: string) => {
    const answers = text.split(",").map((a) => a.trim());
    onChange({ ...question, acceptedAnswers: answers });
  };

  return (
    <div>
      <h6>Accepted Answers (comma-separated)</h6>
      <input
        className="form-control"
        value={(question.acceptedAnswers || []).join(", ")}
        onChange={(e) => updateAnswers(e.target.value)}
      />
    </div>
  );
}
