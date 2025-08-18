import { NextRequest } from "next/server";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVER,
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWD,
  },
});

export async function POST(req: NextRequest) {
  const body = await req.json(); // Intercept the JSON body
  console.log("Received JSON body:", body);

  const name = body.name;
  const email = body.email;
  const message = body.message;
  const optIn = body.optIn;

  const mailOptions = {
    from: "matthew@matthewdalby.dev",
    to: "matthew@matthewdalby.dev",
    subject: "Personal Blog Contact Form Submission",
    text: `name: ${name}, email: ${email}, message: ${message}, op in: ${optIn}`,
  };

  try {
    transporter.sendMail(mailOptions);
  } catch (error) {
    console.warn(error);
  }

  // Simulate a delay for processing
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return new Response(JSON.stringify({ message: "Success!" }), { status: 200 });
}
