import { QnA } from "@/constants";
import Question from "./Question";

export default function FAQ() {
  return (
    <div className="home-faq">
      <div className="faqContainer">
        <div className="home-faq1">
          <div className="home-container4">
            <span className="overtext">
              <span>FAQ</span>
              <br></br>
            </span>
            <h2 className="home-text-upper heading2">Common questions</h2>
            <span className="home-text-lower bodyLarge">
              <span>
                Here are some of the most common questions that we get.
              </span>
              <br></br>
            </span>
          </div>
          <div className="home-container5">
            {QnA.map((qna, index) => (
              <Question
                key={index}
                question={qna.question}
                answer={qna.answer}
              ></Question>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
