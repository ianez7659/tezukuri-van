import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { name, email, message } = await req.json();

  console.log("Contact form submission:", { name, email, message });
  console.log("RESEND_API_KEY exists:", !!process.env.RESEND_API_KEY);

  try {
    const data = await resend.emails.send({
      from: "Tezukuri Van Contact <onboarding@resend.dev>", 
      to: "ianez7659@gmail.com", 
      subject: `New contact form submission from ${name}`,
      replyTo: email,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    });

    console.log("Email sent successfully:", data);
    return NextResponse.json({ status: "ok", data });
  } catch (err) {
    console.error("Email sending failed:", err);
    return NextResponse.json({ 
      status: "error", 
      error: err instanceof Error ? err.message : "Unknown error" 
    }, { status: 500 });
  }
}
