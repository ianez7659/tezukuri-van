import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

// SMTP transporter 설정
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(req: Request) {
  const { name, email, message } = await req.json();

  console.log("Contact form submission:", { name, email, message });
  console.log("SMTP configuration:", {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    hasPassword: !!process.env.SMTP_PASS,
  });

  try {
    // 이메일 옵션 설정
    const mailOptions = {
      from: `"Tezukuri Van Contact" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || "ianez7659@gmail.com",
      subject: `New contact form submission from ${name}`,
      replyTo: email,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Form Submission</h2>
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <div style="background-color: white; padding: 15px; border-radius: 3px; margin-top: 10px;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          <p style="margin-top: 20px; color: #666; font-size: 12px;">
            This message was sent from the Tezukuri Van contact form.
          </p>
        </div>
      `,
    };

    // 이메일 전송
    const info = await transporter.sendMail(mailOptions);
    
    console.log("Email sent successfully:", info.messageId);
    return NextResponse.json({ 
      status: "ok", 
      messageId: info.messageId,
      message: "Email sent successfully" 
    });
  } catch (err) {
    console.error("Email sending failed:", err);
    return NextResponse.json({ 
      status: "error", 
      error: err instanceof Error ? err.message : "Unknown error" 
    }, { status: 500 });
  }
}
