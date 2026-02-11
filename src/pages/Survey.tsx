import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { US_STATES } from "@/lib/mockData";

const Survey = () => {
  const { completeOnboarding } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    state: "",
    monthlyIncome: "",
    monthlyRent: "",
    carPayment: "",
    weeklyGrocery: "",
    eatingOutPerWeek: "",
    recurringExpenses: "",
    personality: "planner" as "planner" | "spontaneous",
  });

  const update = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    completeOnboarding({
      fullName: form.fullName,
      state: form.state,
      monthlyIncome: Number(form.monthlyIncome),
      monthlyRent: Number(form.monthlyRent),
      carPayment: Number(form.carPayment),
      weeklyGrocery: Number(form.weeklyGrocery),
      eatingOutPerWeek: Number(form.eatingOutPerWeek),
      recurringExpenses: form.recurringExpenses,
      personality: form.personality,
    });
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mb-2 text-2xl font-bold tracking-tight">
            <span className="text-accent">2</span>Cents
          </div>
          <CardTitle className="text-xl">Tell us about your finances</CardTitle>
          <CardDescription>This helps us personalize your experience</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input placeholder="Alex Morgan" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>State</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={form.state}
                onChange={(e) => update("state", e.target.value)}
                required
              >
                <option value="">Select state...</option>
                {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Monthly Income ($)</Label>
                <Input type="number" placeholder="5000" value={form.monthlyIncome} onChange={(e) => update("monthlyIncome", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Monthly Rent ($)</Label>
                <Input type="number" placeholder="1500" value={form.monthlyRent} onChange={(e) => update("monthlyRent", e.target.value)} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Car Payment ($)</Label>
                <Input type="number" placeholder="300" value={form.carPayment} onChange={(e) => update("carPayment", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Weekly Groceries ($)</Label>
                <Input type="number" placeholder="100" value={form.weeklyGrocery} onChange={(e) => update("weeklyGrocery", e.target.value)} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Times eating out per week</Label>
              <Input type="number" placeholder="3" value={form.eatingOutPerWeek} onChange={(e) => update("eatingOutPerWeek", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Recurring Expenses</Label>
              <Textarea placeholder="e.g. Netflix $15, Gym $40, Spotify $10..." value={form.recurringExpenses} onChange={(e) => update("recurringExpenses", e.target.value)} />
            </div>
            <div className="space-y-3">
              <Label>I tend to...</Label>
              <RadioGroup value={form.personality} onValueChange={(v) => update("personality", v)}>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="planner" id="planner" />
                  <Label htmlFor="planner" className="font-normal">Prefer to make plans</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="spontaneous" id="spontaneous" />
                  <Label htmlFor="spontaneous" className="font-normal">Prefer to be spontaneous</Label>
                </div>
              </RadioGroup>
            </div>
            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              Continue to Dashboard
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Survey;
