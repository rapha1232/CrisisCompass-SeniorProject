import { Doc } from "@/convex/_generated/dataModel";
import emailjs from "@emailjs/browser";

export async function sendEmailNotification(
  users: Doc<"users">[],
  message: string
) {
  for (const user of users) {
    const res = await emailjs.send(
      process.env.NEXT_PUBLIC_MAIL_SERVICE_KEY!,
      process.env.NEXT_PUBLIC_MAIL_TEMPLATE_KEY!,
      {
        to_name: user.fullname,
        from_name: "CrisisCompass",
        message,
        reply_to: user.email,
        to_email: user.email,
      },
      process.env.NEXT_PUBLIC_MAIL_PUBLIC_KEY!
    );
    if (res.status !== 200) {
      throw Error("Failed to send email notification");
    }
  }
}
