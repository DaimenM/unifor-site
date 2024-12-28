import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { kv } from "@vercel/kv";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(request: Request) {
  try {
    const { currentPassword, newPassword } = await request.json();
    const authHeader = request.headers.get("Authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    try {
      jwt.verify(token, JWT_SECRET);
    } catch (error) {
      console.error("Invalid token:", error);
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    const existingAdmin = await kv.get("admin");
    if (!existingAdmin) {
      return NextResponse.json(
        { success: false, message: "Admin account not found" },
        { status: 404 }
      );
    }

    const storedAdmin = existingAdmin as { username: string; password: string };
    const passwordMatch = await bcrypt.compare(currentPassword, storedAdmin.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, message: "Current password is incorrect" },
        { status: 401 }
      );
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await kv.set("admin", {
      username: "admin",
      password: hashedNewPassword,
    });

    return NextResponse.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Password change error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to change password" },
      { status: 500 }
    );
  }
} 