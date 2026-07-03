import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { error: "Email, OTP, and new password are required" },
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

    if (!admin.resetPasswordOtp || !admin.resetPasswordExpires) {
      return NextResponse.json(
        { error: "No password reset requested" },
        { status: 400 }
      );
    }

    if (admin.resetPasswordExpires < new Date()) {
      return NextResponse.json(
        { error: "OTP has expired" },
        { status: 400 }
      );
    }

    const isMatch = await bcrypt.compare(otp, admin.resetPasswordOtp);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid OTP" },
        { status: 400 }
      );
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    admin.passwordHash = hashedPassword;
    admin.resetPasswordOtp = undefined;
    admin.resetPasswordExpires = undefined;
    
    await admin.save();

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
