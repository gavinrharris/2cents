import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, MessageCircle, PieChart, Lightbulb, ArrowRight } from "lucide-react";

const steps = [
  { icon: Lightbulb, title: "Complete Your Profile", desc: "Tell us about your finances so we can personalize your experience." },
  { icon: TrendingUp, title: "Track Your Spending", desc: "See where your money goes with automatic categorization." },
  { icon: MessageCircle, title: "Chat with Your AI Advisor", desc: "Get instant, personalized financial guidance anytime." },
  { icon: PieChart, title: "Review Monthly Reports", desc: "Understand your financial health with clear visual reports." },
];

const Orientation = () => (
  <div className="flex min-h-screen items-center justify-center bg-background px-4">
    <div className="w-full max-w-2xl">
      <div className="mb-8 text-center">
        <span className="text-3xl font-bold tracking-tight">
          <span className="text-accent">2</span>Cents
        </span>
        <h1 className="mt-4 text-2xl font-bold">Welcome! Here's how it works</h1>
        <p className="mt-2 text-muted-foreground">Get the most out of your AI financial advisor in 4 simple steps.</p>
      </div>

      <div className="space-y-4">
        {steps.map(({ icon: Icon, title, desc }, i) => (
          <Card key={title} className="border bg-card">
            <CardContent className="flex items-start gap-4 p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent font-bold">
                {i + 1}
              </div>
              <div>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link to="/survey">
          <Button size="lg" className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
            Let's Get Started <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  </div>
);

export default Orientation;
