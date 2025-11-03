"use client";
import { useState } from "react";
import { apiRegister } from "@/lib/api";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  
  console.log('RegisterPage rendered');
  console.log('process.env.NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
  console.log('All env vars:', process.env);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log('Form submitted with:', { email, fullName, password });
    try {
      const result = await apiRegister({ email, full_name: fullName, password });
      console.log('Registration successful:', result);
      setMsg("Registered. You can login now.");
    } catch (err: any) {
      console.error('Registration failed:', err);
      setMsg(err.message ?? "Failed");
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "64px auto" }}>
      <h1>Register</h1>
      <form onSubmit={onSubmit}>
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input placeholder="Full name" value={fullName} onChange={e => setFullName(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">Create account</button>
      </form>
      <p>{msg}</p>
    </div>
  );
}
