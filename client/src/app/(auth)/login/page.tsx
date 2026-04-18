"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../../features/auth/hooks";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        <Button type="submit" className="mt-4" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </Button>
      </form>
      <div className="mt-4 flex gap-3 text-sm">
        <Link href="/register" className="text-blue-600 hover:underline">
          Register
        </Link>
        <Link href="/forgot-password" className="text-blue-600 hover:underline">
          Forgot Password
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
