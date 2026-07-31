import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, ArrowRight, Mail, Lock } from "lucide-react";

export const Route = createFileRoute("/")({
  component: LoginScreen,
});

function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [stage, setStage] = useState<"logo" | "form">("logo");
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 grid-bg flex flex-col text-foreground selection:bg-primary/20 overflow-hidden">
      {/* Main */}
      <main className="flex-1 flex items-center justify-center p-6 relative">
        <AnimatePresence mode="wait">
          {stage === "logo" ? (
            /* ── Stage 1: Logo entrance ── */
            <motion.div
              key="stage1"
              className="absolute inset-0 flex items-center justify-center"
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
            >
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 12,
                  mass: 0.8,
                  duration: 0.8,
                }}
                onAnimationComplete={() => {
                  setTimeout(() => setStage("form"), 400);
                }}
                className="flex flex-col items-center gap-6"
              >
                <motion.img
                  src="/images/bhasyam-logo.png"
                  alt="Bhasyam"
                  className="h-28 w-auto object-contain drop-shadow-lg"
                  initial={{ rotate: -5 }}
                  animate={{ rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 150,
                    damping: 10,
                    delay: 0.2,
                  }}
                />
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-center"
                >
                  <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                    Bhasyam
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Assessment Content Management System
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          ) : (
            /* ── Stage 2: Login card ── */
            <motion.div
              key="stage2"
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 180,
                damping: 22,
                mass: 0.9,
                duration: 0.6,
              }}
              className="w-full max-w-[400px] bg-card rounded-xl shadow-[0_32px_64px_-16px_rgba(15,23,42,0.14)] border border-border overflow-hidden"
            >
              {/* Brand header */}
              <div className="pt-5 pb-3 px-8 text-center">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 14,
                    delay: 0.15,
                  }}
                  className="inline-flex items-center justify-center mb-2"
                >
                  <img
                    src="/images/bhasyam-logo.png"
                    alt="Bhasyam"
                    className="h-14 w-auto object-contain drop-shadow-sm"
                  />
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.4 }}
                  className="text-base font-semibold tracking-tight leading-snug"
                >
                  Assessment Content
                  <br />
                  Management System
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35, duration: 0.4 }}
                  className="text-[11px] text-muted-foreground mt-1"
                >
                  Secure. Reliable. Built for Education.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                  className="mt-3 pt-3 border-t border-border"
                >
                  <h2 className="text-sm font-semibold tracking-tight">
                    Portal Login
                  </h2>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Please sign in to continue
                  </p>
                </motion.div>
              </div>

              {/* Form */}
              <form
                className="px-8 pb-6 space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  navigate({ to: "/dashboard" });
                }}
              >
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45, duration: 0.4 }}
                  className="space-y-1"
                >
                  <label
                    htmlFor="identifier"
                    className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground ml-0.5"
                  >
                    Username or Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                    <input
                      id="identifier"
                      type="text"
                      autoComplete="username"
                      placeholder="admin@bhasyam.edu"
                      className="w-full h-9 pl-9 pr-3 bg-background border border-border rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="space-y-1"
                >
                  <div className="flex justify-between items-end">
                    <label
                      htmlFor="password"
                      className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground ml-0.5"
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="text-[10px] font-medium text-primary hover:underline underline-offset-4 inline-flex items-center gap-1"
                    >
                      {showPassword ? (
                        <EyeOff className="size-3" />
                      ) : (
                        <Eye className="size-3" />
                      )}
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      className="w-full h-9 pl-9 pr-3 bg-background border border-border rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.55, duration: 0.4 }}
                  className="flex items-center justify-between"
                >
                  <label className="flex items-center gap-1.5 group cursor-pointer">
                    <span className="relative flex items-center">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                      />
                      <span className="size-3.5 border border-border rounded bg-background peer-checked:bg-primary peer-checked:border-primary transition-colors" />
                      <span className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100">
                        <span className="w-1 h-1 rounded-full bg-primary-foreground" />
                      </span>
                    </span>
                    <span className="text-[11px] text-muted-foreground group-hover:text-foreground transition-colors">
                      Remember this session
                    </span>
                  </label>
                  <a
                    href="#"
                    className="text-[11px] text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
                  >
                    Forgot password?
                  </a>
                </motion.div>

                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                  type="submit"
                  className="btn-shine group w-full h-10 bg-foreground text-white rounded-lg text-sm font-semibold tracking-wide transition-all hover:bg-black/90 active:scale-[0.98] shadow-lg shadow-black/10 mt-1 inline-flex items-center justify-center gap-2"
                >
                  Sign In to Portal
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </motion.button>
              </form>

              <div className="bg-background/60 border-t border-border px-8 py-2.5 flex justify-center">
                <p className="text-[10px] text-muted-foreground">
                  Restricted access for internal staff only
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="h-8 border-t border-border bg-card px-6 flex items-center justify-center gap-2 shrink-0"
      >
        <span className="font-mono-ui text-[10px] text-muted-foreground tracking-tight uppercase">
          &copy; 2026 Assessment CMS · All rights reserved by
        </span>
        <div className="flex items-center gap-1.5">
          <img
            src="/images/icon.png"
            alt="Wise Wings"
            className="h-4 w-4 rounded-sm object-contain"
          />
          <span className="font-bold text-[11px] tracking-tighter text-foreground uppercase">
            wise wings
          </span>
        </div>
      </motion.footer>
    </div>
  );
}
