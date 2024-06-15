"use client";
import { api } from "@/convex/_generated/api";
import { useOrganization } from "@clerk/nextjs";
import emailjs from "@emailjs/browser";
import { useQuery } from "convex/react";
import Link from "next/link";
import React from "react";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import { IoMdCall } from "react-icons/io";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

const Contact: React.FC = () => {
  const user = useQuery(api.users.getCurrentUser);
  const [isSending, setIsSending] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const organization = useOrganization();
  const org = useQuery(api.organizations.getOne, {
    orgName: organization.organization?.name,
  });

  const sendEmail = () => {
    setIsSending(true);
    if (!user)
      return toast.error("You need to be logged in to send a message.");
    emailjs
      .send(
        process.env.NEXT_PUBLIC_MAIL_SERVICE_KEY!,
        "template_h7ag59d",
        {
          from_name: user.fullname,
          message,
          from_email: user.email,
        },
        process.env.NEXT_PUBLIC_MAIL_PUBLIC_KEY!
      )
      .then(
        () => {
          setMessage("");
          setIsSending(false);
        },
        (error: Error) => {
          console.log(error);
          setIsSending(false);
        }
      );
  };
  const requestVerification = () => {
    setIsSending(true);
    if (!user || !org)
      return toast.error(
        "You need to be logged into your organization to send a request."
      );
    emailjs
      .send(
        process.env.NEXT_PUBLIC_MAIL_SERVICE_KEY!,
        "template_h7ag59d",
        {
          from_name: org.name,
          message: "Request Verification",
          from_email: org.email,
        },
        process.env.NEXT_PUBLIC_MAIL_PUBLIC_KEY!
      )
      .then(
        () => {
          setMessage("");
          setIsSending(false);
        },
        (error: Error) => {
          console.log(error);
          setIsSending(false);
        }
      );
  };

  return (
    <div className="mt-12 size-full bg-dark-300 pb-12">
      <div className="both-center flex size-full">
        <div className="mx-auto">
          <form
            className="mr-auto max-h-full w-full rounded-2xl bg-dark-400 p-8 shadow-2xl md:px-12 lg:w-9/12 lg:pl-20 lg:pr-40"
            onSubmit={sendEmail}
          >
            <div className="both-center flex flex-col">
              <h1 className="text-center text-2xl font-bold uppercase text-gray-300 max-md:text-3xl max-[400px]:text-xl max-[300px]:text-base">
                Send the team a message or request organization verification.
              </h1>
              <h4 className="text-center text-base font-bold uppercase text-gray-300 max-md:text-3xl max-[400px]:text-xl max-[300px]:text-base">
                Make sure you email us from your organization email for
                verification.
              </h4>
            </div>
            <div className="my-4 flex flex-col gap-6">
              <Textarea
                placeholder="Message*"
                className="mt-2 h-32 w-full rounded-lg bg-gray-300 p-3 text-gray-900 placeholder:text-slate-700 focus:outline-none"
                rows={10}
                required={true}
                name="message"
                onChange={(e) => setMessage(e.target.value)}
              ></Textarea>
            </div>
            <div className="flex gap-4">
              <Button
                className="my-4 w-1/2 rounded-lg bg-[#191919] text-sm font-bold uppercase tracking-wide 
                      text-gray-300 focus:outline-none"
                onClick={sendEmail}
                disabled={isSending}
              >
                {isSending ? "Sending..." : "Send Message"}
              </Button>
              <Button
                className="my-4 w-1/2 rounded-lg bg-[#191919] text-sm font-bold uppercase tracking-wide 
                      text-gray-300 focus:outline-none"
                onClick={requestVerification}
                disabled={isSending}
              >
                {isSending ? "Sending..." : "Request verification"}
              </Button>
            </div>
          </form>

          <div className="ml-auto w-full rounded-2xl bg-[#191919] px-8 py-6 shadow-2xl lg:-mt-96 lg:w-2/6">
            <div className="both-center flex flex-col text-gray-300">
              <h1 className="my-4 text-center text-3xl font-bold uppercase max-md:text-2xl">
                Contact us more on
              </h1>
              <div className="both-center flex gap-8">
                <Link
                  href="https://www.instagram.com/"
                  aria-label="GranDeyRoots Instagram Page"
                >
                  <FaInstagram size={50} />
                </Link>
                <Link
                  href="https://www.tiktok.com/"
                  aria-label="GranDeyRoots TikTok Page"
                >
                  <FaTiktok size={50} />
                </Link>
              </div>
              <div className="both-center my-4 flex w-full lg:w-1/2">
                <IoMdCall size={30} color="white" className="mb-6 pr-2 pt-2" />
                <div className="flex flex-col">
                  <h2 className="text-center text-2xl">Call Us</h2>
                  <p className="both-center flex flex-col text-center text-gray-400">
                    <span>+961 12 345 678</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
