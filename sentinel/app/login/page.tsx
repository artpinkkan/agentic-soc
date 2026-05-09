"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      className="min-h-screen flex"
      style={{ backgroundColor: "var(--color-surface)" }}
    >
      {/* ── Left panel — branding ── */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-14"
        style={{
          background: "linear-gradient(160deg, var(--color-primary) 0%, var(--color-primary-container) 100%)",
          color: "var(--color-on-primary)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 shrink-0"
            style={{
              background: "rgba(255,255,255,0.25)",
              clipPath: "polygon(50% 0%,100% 22%,100% 68%,50% 100%,0% 68%,0% 22%)",
            }}
          />
          <span
            className="text-lg font-semibold tracking-tight"
            style={{ fontFamily: "var(--font-headline)" }}
          >
            Shannon Sentinel
          </span>
        </div>

        {/* Hero */}
        <div>
          <h1
            className="font-bold leading-none mb-6"
            style={{
              fontFamily: "var(--font-headline)",
              fontSize: "3.25rem",
              letterSpacing: "-0.02em",
            }}
          >
            Security that
            <br />
            thinks ahead.
          </h1>
          <p className="text-base leading-relaxed mb-12" style={{ opacity: 0.8 }}>
            Your AI-powered Security Operations Center — detecting, triaging,
            and investigating threats before they become incidents.
          </p>

          {/* Feature list */}
          <ul className="space-y-5">
            {[
              { icon: "⚡", label: "Real-time threat monitoring", sub: "Continuous signal ingestion across all data sources" },
              { icon: "🧠", label: "AI-driven investigation", sub: "Autonomous root-cause analysis and correlation" },
              { icon: "📋", label: "Automated triage & playbooks", sub: "Priority scoring and response orchestration" },
            ].map((f) => (
              <li key={f.label} className="flex items-start gap-4">
                <span
                  className="mt-0.5 w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-base"
                  style={{ background: "rgba(255,255,255,0.15)" }}
                >
                  {f.icon}
                </span>
                <div>
                  <p className="text-sm font-semibold">{f.label}</p>
                  <p className="text-xs mt-0.5" style={{ opacity: 0.7 }}>{f.sub}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <p className="text-xs" style={{ opacity: 0.5 }}>
          © 2026 Shannon Sentinel · SOC Platform
        </p>
      </div>

      {/* ── Right panel — form ── */}
      <div
        className="flex-1 flex items-center justify-center p-8"
        style={{ backgroundColor: "var(--color-surface)" }}
      >
        <div className="w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <div
              className="w-7 h-7"
              style={{
                background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%)",
                clipPath: "polygon(50% 0%,100% 22%,100% 68%,50% 100%,0% 68%,0% 22%)",
              }}
            />
            <span
              className="text-base font-semibold"
              style={{ fontFamily: "var(--font-headline)", color: "var(--color-on-surface)" }}
            >
              Shannon Sentinel
            </span>
          </div>

          <h2
            className="font-semibold mb-2"
            style={{
              fontFamily: "var(--font-headline)",
              fontSize: "1.75rem",
              letterSpacing: "-0.01em",
              color: "var(--color-on-surface)",
            }}
          >
            Welcome back
          </h2>
          <p className="text-sm mb-10" style={{ color: "var(--color-on-surface-variant)" }}>
            Sign in to your Sentinel workspace
          </p>

          <form
            className="space-y-5"
            onSubmit={(e) => { e.preventDefault(); }}
          >
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold mb-2"
                style={{ color: "var(--color-on-surface-variant)" }}
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="analyst@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="text-xs font-semibold"
                  style={{ color: "var(--color-on-surface-variant)" }}
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold"
                  style={{ color: "var(--color-primary)" }}
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold transition-opacity hover:opacity-70"
                  style={{ color: "var(--color-outline)" }}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="btn-primary w-full mt-2">
              Sign in
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px" style={{ backgroundColor: "var(--color-surface-container-high)" }} />
            <span className="text-xs" style={{ color: "var(--color-on-surface-variant)" }}>or</span>
            <div className="flex-1 h-px" style={{ backgroundColor: "var(--color-surface-container-high)" }} />
          </div>

          {/* SSO */}
          <button
            type="button"
            className="btn-ghost w-full flex items-center gap-3"
            style={{ backgroundColor: "var(--color-surface-container-lowest)", border: "none" }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
              <path d="M15.68 8.18c0-.57-.05-1.12-.14-1.64H8v3.1h4.3a3.68 3.68 0 0 1-1.6 2.42v2h2.58c1.51-1.39 2.4-3.44 2.4-5.88Z" fill="#4285F4" />
              <path d="M8 16c2.16 0 3.97-.72 5.3-1.94l-2.58-2c-.72.48-1.64.76-2.72.76-2.09 0-3.86-1.41-4.49-3.31H.84v2.07A8 8 0 0 0 8 16Z" fill="#34A853" />
              <path d="M3.51 9.51A4.8 4.8 0 0 1 3.26 8c0-.52.09-1.03.25-1.51V4.42H.84A8 8 0 0 0 0 8c0 1.29.31 2.51.84 3.58l2.67-2.07Z" fill="#FBBC04" />
              <path d="M8 3.18c1.18 0 2.23.41 3.06 1.2l2.29-2.29A8 8 0 0 0 .84 4.42L3.51 6.5C4.14 4.59 5.91 3.18 8 3.18Z" fill="#EA4335" />
            </svg>
            <span className="text-sm font-semibold" style={{ color: "var(--color-on-surface)" }}>
              Continue with Google
            </span>
          </button>

          {/* Sign up */}
          <p className="text-center text-sm mt-8" style={{ color: "var(--color-on-surface-variant)" }}>
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold"
              style={{ color: "var(--color-primary)" }}
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
