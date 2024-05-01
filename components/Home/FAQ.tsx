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
            <Question
              answer="You can update your user profile by going to the 'Profile' section in the app and selecting the 'Edit Profile' option."
              question="How can I update my user profile?"
            ></Question>
            <Question
              answer="You can access the chat logs by clicking on the 'Chat Logs' section in the app menu."
              question="How do I access the chat logs?"
            ></Question>
            <Question
              answer="You can view the interactive maps by navigating to the 'Maps' section in the app and selecting the desired map view."
              question="How can I view the interactive maps?"
            ></Question>
            <Question
              answer="You can find information about relief stations by exploring the interactive maps and looking for designated relief station markers."
              question="Where can I find information about relief stations?"
            ></Question>
            <Question
              answer="You can stay updated on emergency broadcasts and alerts by checking the 'Broadcasts &amp; Alerts' section in the app for real-time information."
              question="How do I stay updated on emergency broadcasts and alerts?"
            ></Question>
          </div>
        </div>
      </div>
    </div>
  );
}
