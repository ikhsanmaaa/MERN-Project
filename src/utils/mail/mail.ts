import nodemailer from "nodemailer";
import {
  EMAIL_SMTP_SECURE,
  EMAIL_SMTP_PASS,
  EMAIL_SMTP_USER,
  EMAIL_SMTP_PORT,
  EMAIL_SMTP_HOST,
  EMAIL_SMTP_SERVICE_NAME,
} from "../env";
import ejs from "ejs";
import path from "path";

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 587,
  secure: false,
  auth: {
    user: EMAIL_SMTP_USER,
    pass: EMAIL_SMTP_PASS,
  },
});

export interface ISendMail {
  from: string;
  to: string;
  subject: string;
  html: string;
}

export const sendMail = async ({ from, to, subject, html }: ISendMail) => {
  const result = await transporter.sendMail({
    from,
    to,
    subject,
    html,
  });
  return result;
};

export const renderMailHtml = async (
  template: string,
  data: any
): Promise<string> => {
  const content = await ejs.renderFile(
    path.join(__dirname, `templates/${template}`),
    data
  );
  return content as string;
};
