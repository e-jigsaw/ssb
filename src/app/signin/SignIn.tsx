"use client";

import { useState } from "react";
import { useSignInEmailPassword } from "@nhost/nextjs";

export const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signInEmailPassword } = useSignInEmailPassword();
  return (
    <div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const res = await signInEmailPassword(email, password);
          console.log(res);
        }}
      >
        <label htmlFor="email">email:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <label htmlFor="pass">password:</label>
        <input
          id="pass"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <button type="submit">sign in</button>
      </form>
    </div>
  );
};
