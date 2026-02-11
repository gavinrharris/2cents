import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TrendingUp, MessageCircle, PieChart, Lightbulb } from "lucide-react";

const features = [
  { icon: TrendingUp, title: "Personalized Budgeting", desc: "Smart budgets that adapt to your lifestyle and goals." },
  { icon: Lightbulb, title: "Smart Financial Tips", desc: "Daily AI-powered advice tailored to your spending habits." },
  { icon: MessageCircle, title: "AI Chat Advisor", desc: "Ask questions and get instant financial guidance." },
  { icon: PieChart, title: "Monthly Reports", desc: "Clear breakdowns of where your money goes each month." },
];

const Landing = () => (
  <div className="min-h-screen bg-background">
    {/* Hero */}
    <header className="flex items-center justify-between px-6 py-4 md:px-12">
      <span className="text-2xl font-bold tracking-tight">
        <span className="text-accent">2</span>Cents
      </span>
      <div className="flex gap-3">
        <Link to="/login">
          <Button variant="ghost">Log In</Button>
        </Link>
        <Link to="/register">
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Sign Up</Button>
        </Link>
      </div>
    </header>

    <section className="mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center md:py-32">
      <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
        AI Financial Advice
      </h1>
      <p className="mt-4 max-w-lg text-lg text-muted-foreground">
        Financial advice that adapts to you, not the other way around.
      </p>
      <div className="mt-8 flex gap-4">
        <Link to="/register">
          <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
            Get Started
          </Button>
        </Link>
        <Link to="/login">
          <Button size="lg" variant="outline">
            Log In
          </Button>
        </Link>
      </div>
    </section>

    {/* Features */}
    <section className="mx-auto grid max-w-5xl gap-6 px-6 pb-24 md:grid-cols-2 lg:grid-cols-4">
      {features.map(({ icon: Icon, title, desc }) => (
        <div key={title} className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
            <Icon className="h-5 w-5 text-accent" />
          </div>
          <h3 className="font-semibold">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
        </div>
      ))}
    </section>

    {/* Footer */}
    <footer className="border-t py-8 text-center text-sm text-muted-foreground">
      <div className="flex justify-center gap-6">
        <span className="cursor-pointer hover:text-foreground">About</span>
        <span className="cursor-pointer hover:text-foreground">Privacy</span>
        <span className="cursor-pointer hover:text-foreground">Terms</span>
      </div>
      <p className="mt-3">© 2026 2Cents. All rights reserved.</p>
    </footer>
  </div>
);

export default Landing;
