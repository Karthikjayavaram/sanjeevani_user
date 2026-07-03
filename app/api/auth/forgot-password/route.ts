import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Admin from "@/models/Admin";
import { Resend } from "resend";
import bcrypt from "bcryptjs";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const admin = await Admin.findOne({ 
      $or: [{ username: email }, { email: email }] 
    });

    if (!admin) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const receiverEmail = admin.email || process.env.EMAIL_USER;

    if (!receiverEmail) {
      return NextResponse.json(
        { error: "No email associated with this account. Please update your environment variables." },
        { status: 400 }
      );
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Hash the OTP before saving
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);

    admin.resetPasswordOtp = hashedOtp;
    admin.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    await admin.save();

    console.log("SENDING EMAIL TO:", receiverEmail);
    console.log("USING FROM:", process.env.EMAIL_FROM || "onboarding@resend.dev");

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "onboarding@resend.dev",
      to: [receiverEmail],
      subject: "Password Reset OTP - Sanjeevani Admin",
      text: `Your password reset OTP is: ${otp}\n\nIt is valid for 15 minutes.`,
      html: `<div style="font-family: sans-serif; text-align: center; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #d4af37;">Sanjeevani Admin Portal</h2>
        <p>You requested a password reset for the admin portal.</p>
        <div style="background: #f4f4f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h1 style="letter-spacing: 5px; color: #18181b; margin: 0;">${otp}</h1>
        </div>
        <p>This OTP is valid for 15 minutes.</p>
        <p style="color: #71717a; font-size: 12px; margin-top: 30px;">If you did not request this, please ignore this email.</p>
      </div>`,
    });

    if (error) {
      console.error("Resend API error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to send email via Resend" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "OTP sent to registered email" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
