import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { GraduationCap, ShieldCheck } from "lucide-react";
import { Wordmark } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Midnight Academy" },
      {
        name: "description",
        content:
          "Choose your workspace and sign in to Midnight Academy as a student or an instructor.",
      },
      { property: "og:title", content: "Sign in — Midnight Academy" },
      {
        property: "og:description",
        content: "Student and instructor access to technical comprehension training.",
      },
    ],
  }),
  component: AuthPage,
});

const roles = [
  {
    id: "student" as const,
    title: "Student",
    body: "Practice and improve your technical question understanding",
    icon: GraduationCap,
  },
  {
    id: "admin" as const,
    title: "Admin",
    body: "Create, manage and evaluate technical tests",
    icon: ShieldCheck,
  },
];

function AuthPage() {
  const [role, setRole] = useState<"student" | "admin">("student");
  const navigate = useNavigate();

  return (
    <main className="grid-backdrop flex min-h-screen items-center justify-center px-5 py-16">
      <div className="w-full max-w-md">
        <div className="flex justify-center">
          <Wordmark />
        </div>

        <div className="panel mt-8 p-6 lg:p-8">
          <h1 className="text-xl font-bold text-foreground">Welcome to Midnight Academy</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">Choose your workspace.</p>

          <div className="mt-6 grid gap-3">
            {roles.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={cn(
                  "flex items-start gap-3 rounded-xl border p-4 text-left transition-colors",
                  role === r.id
                    ? "border-primary/60 bg-primary/8"
                    : "border-border bg-surface-2/50 hover:border-border-strong",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 grid size-8 place-items-center rounded-lg",
                    role === r.id ? "bg-primary/15 text-primary" : "bg-surface text-muted-foreground",
                  )}
                >
                  <r.icon className="size-4" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-foreground">{r.title}</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                    {r.body}
                  </span>
                </span>
              </button>
            ))}
          </div>

          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ to: role === "admin" ? "/admin" : "/onboarding" });
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@university.edu" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" required />
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-muted-foreground">
                <Checkbox id="remember" defaultChecked /> Remember me
              </label>
              <a href="#reset" className="text-primary hover:underline">
                Forgot password?
              </a>
            </div>
            <Button type="submit" className="w-full" size="lg">
              Continue
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Have a test code instead?{" "}
          <Link to="/test" className="text-primary hover:underline">
            Enter your test
          </Link>
        </p>
      </div>
    </main>
  );
}
