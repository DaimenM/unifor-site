import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { kv } from "@vercel/kv";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Check if this is the first login attempt for admin
    const existingAdmin = await kv.get("admin");
    
    if (!existingAdmin && username === "admin") {
      const hashedPassword = await bcrypt.hash(password, 10);
      await kv.set("admin", {
        username: "admin",
        password: hashedPassword,
      });
      
      const token = jwt.sign({ username: "admin" }, JWT_SECRET, {
        expiresIn: "24h",
      });

      return NextResponse.json({ 
        success: true, 
        message: "Admin account created",
        token 
      });
    }

    if (existingAdmin) {
      const storedAdmin = existingAdmin as { username: string; password: string };
      const passwordMatch = await bcrypt.compare(password, storedAdmin.password);
      
      if (username === "admin" && passwordMatch) {
        const token = jwt.sign({ username: "admin" }, JWT_SECRET, {
          expiresIn: "24h",
        });

        return NextResponse.json({ 
          success: true, 
          message: "Login successful",
          token 
        });
      }
    }

    return NextResponse.json(
      { success: false, message: "Invalid credentials" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { success: false, message: "Authentication failed" },
      { status: 500 }
    );
  }
}
  