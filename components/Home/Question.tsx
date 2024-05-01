const Question = ({
  question = "What types of services do you provide?",
  answer = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non volutpat turpis. Mauris luctus rutrum mi ut rhoncus.",
}: {
  question: string;
  answer: string;
}) => {
  return (
    <>
      <div className="question1-container">
        <span className="question1-text heading3">{question}</span>
        <span className="bodySmall">{answer}</span>
      </div>
      <style jsx>
        {`
          .question1-container {
            gap: var(--dl-space-space-unit);
            flex: 1;
            width: auto;
            height: auto;
            display: flex;
            position: relative;
            align-items: flex-start;
            flex-direction: column;
          }
          .question1-text {
            font-weight: 700;
          }
        `}
      </style>
    </>
  );
};

export default Question;
