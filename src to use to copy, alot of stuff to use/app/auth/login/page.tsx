"use client";
import { useState } from "react";
import { apiLogin } from "@/lib/api";
import { saveToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { access_token } = await apiLogin(email, password);
      saveToken(access_token);
      setMsg("Logged in");
      router.push("/dashboard"); // שנה ליעד שלך
    } catch (err: any) {
      setMsg(err.message ?? "Failed");
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "64px auto" }}>
      <h1>Login</h1>
      <form onSubmit={onSubmit}>
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
      <p>{msg}</p>
    </div>
  );
}
