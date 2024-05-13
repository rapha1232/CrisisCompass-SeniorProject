const Question = ({
  question = "What types of services do you provide?",
  answer = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non volutpat turpis. Mauris luctus rutrum mi ut rhoncus.",
}: {
  question: string;
  answer: string;
}) => {
  return (
    <div className="text-dark100_light900 relative flex flex-1 flex-col items-start gap-4">
      <span className="heading3 font-bold">{question}</span>
      <span className="bodySmall">{answer}</span>
    </div>
  );
};

export default Question;
