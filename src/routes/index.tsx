import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import bhasyamLogo from "../assets/bhasyam-logo.png.asset.json";
import wisewingsLogo from "../assets/wisewings-logo.png.asset.json";

export const Route = createFileRoute("/")({
  component: LoginScreen,
});

function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-background grid-bg flex flex-col text-foreground selection:bg-primary/20">
      {/* App toolbar */}
      <header className="w-full h-12 border-b border-border bg-white/60 backdrop-blur-md flex items-center justify-between px-6 z-20">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5" aria-hidden>
            <span className="size-3 rounded-full bg-black/10" />
            <span className="size-3 rounded-full bg-black/10" />
            <span className="size-3 rounded-full bg-black/10" />
          </div>
          <div className="h-4 w-px bg-border mx-2" />
          <span className="font-mono-ui text-[10px] uppercase tracking-widest text-muted-foreground">
            Assessment CMS · v2.4.0
          </span>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2 py-0.5 rounded-full">
          <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono-ui text-[10px] font-medium text-emerald-700">
            Secure connection
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[440px] animate-entrance bg-card rounded-xl shadow-[0_32px_64px_-16px_rgba(15,23,42,0.14)] border border-border overflow-hidden">
          {/* Bhasyam brand — logo at top */}
          <div className="pt-10 pb-6 px-10 text-center">
            <div className="inline-flex items-center justify-center mb-4">
              <img
                src={bhasyamLogo.url}
                alt="Bhasyam"
                className="h-20 w-auto object-contain"
              />
            </div>
            <h1 className="text-lg font-semibold tracking-tight">Assessment CMS</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Enter your administrative credentials
            </p>
          </div>

          {/* Form */}
          <form
            className="px-10 pb-10 space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ to: "/dashboard" });
            }}
          >
            <div className="space-y-1.5">
              <label
                htmlFor="identifier"
                className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground ml-0.5"
              >
                Username or Email
              </label>
              <input
                id="identifier"
                type="text"
                autoComplete="username"
                placeholder="admin@bhasyam.edu"
                className="w-full h-11 px-4 bg-background border border-border rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-end">
                <label
                  htmlFor="password"
                  className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground ml-0.5"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-[11px] font-medium text-primary hover:underline underline-offset-4 inline-flex items-center gap-1"
                >
                  {showPassword ? <EyeOff className="size-3" /> : <Eye className="size-3" />}
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full h-11 px-4 bg-background border border-border rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 group cursor-pointer">
                <span className="relative flex items-center">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  <span className="size-4 border border-border rounded bg-background peer-checked:bg-primary peer-checked:border-primary transition-colors" />
                  <span className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                  </span>
                </span>
                <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                  Remember this session
                </span>
              </label>
              <a
                href="#"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full h-11 bg-foreground text-white rounded-lg text-sm font-semibold tracking-wide transition-all hover:bg-black/90 active:scale-[0.98] shadow-lg shadow-black/10 mt-2 inline-flex items-center justify-center gap-2"
            >
              Sign In to Portal
              <ArrowRight className="size-4" />
            </button>
          </form>

          <div className="bg-background/60 border-t border-border px-10 py-4 flex justify-center">
            <p className="text-[11px] text-muted-foreground">
              Restricted access for internal staff only
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-8 py-5 flex items-center justify-center gap-2 z-10">
        <span className="font-mono-ui text-[10px] text-muted-foreground tracking-tight uppercase">
          &copy; 2026 Assessment CMS · All rights reserved by
        </span>
        <div className="flex items-center gap-1.5">
          <img src={wisewingsLogo.url} alt="Wise Wings" className="h-4 w-4 rounded-sm object-contain" />
          <span className="font-bold text-[11px] tracking-tighter text-foreground uppercase">
            wise wings
          </span>
        </div>
      </footer>
    </div>
  );
}
