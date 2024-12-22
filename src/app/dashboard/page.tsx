"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.exp * 1000 <= Date.now()) {
        localStorage.removeItem("auth-token");
        router.push("/login");
      }
    } catch (_error) {
      console.error("Token verification error:", _error);
      localStorage.removeItem("auth-token");
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    router.push("/login");
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-red-600">
          Admin Dashboard
        </h1>
        <Button onClick={handleLogout} variant="outline">
          Logout
        </Button>
      </div>
    </main>
  );
}