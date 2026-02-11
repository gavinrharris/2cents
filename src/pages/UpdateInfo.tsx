import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { US_STATES } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";

const UpdateInfo = () => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    state: user?.state || "",
    monthlyIncome: String(user?.monthlyIncome || ""),
    monthlyRent: String(user?.monthlyRent || ""),
    carPayment: String(user?.carPayment || ""),
    weeklyGrocery: String(user?.weeklyGrocery || ""),
    eatingOutPerWeek: String(user?.eatingOutPerWeek || ""),
    recurringExpenses: user?.recurringExpenses || "",
    personality: user?.personality || "planner",
  });

  const update = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName: form.fullName,
      state: form.state,
      monthlyIncome: Number(form.monthlyIncome),
      monthlyRent: Number(form.monthlyRent),
      carPayment: Number(form.carPayment),
      weeklyGrocery: Number(form.weeklyGrocery),
      eatingOutPerWeek: Number(form.eatingOutPerWeek),
      recurringExpenses: form.recurringExpenses,
      personality: form.personality as "planner" | "spontaneous",
    });
    toast({ title: "Saved!", description: "Your financial info has been updated." });
  };

  return (
    <AppLayout>
      <Card className="mx-auto max-w-lg">
        <CardHeader>
          <CardTitle className="text-xl">Update Financial Info</CardTitle>
          <CardDescription>Keep your profile current for better advice</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={form.fullName} onChange={(e) => update("fullName", e.target.value)} required />
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
                <Input type="number" value={form.monthlyIncome} onChange={(e) => update("monthlyIncome", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Monthly Rent ($)</Label>
                <Input type="number" value={form.monthlyRent} onChange={(e) => update("monthlyRent", e.target.value)} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Car Payment ($)</Label>
                <Input type="number" value={form.carPayment} onChange={(e) => update("carPayment", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Weekly Groceries ($)</Label>
                <Input type="number" value={form.weeklyGrocery} onChange={(e) => update("weeklyGrocery", e.target.value)} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Times eating out per week</Label>
              <Input type="number" value={form.eatingOutPerWeek} onChange={(e) => update("eatingOutPerWeek", e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Recurring Expenses</Label>
              <Textarea value={form.recurringExpenses} onChange={(e) => update("recurringExpenses", e.target.value)} />
            </div>
            <div className="space-y-3">
              <Label>I tend to...</Label>
              <RadioGroup value={form.personality} onValueChange={(v) => update("personality", v)}>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="planner" id="up-planner" />
                  <Label htmlFor="up-planner" className="font-normal">Prefer to make plans</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="spontaneous" id="up-spontaneous" />
                  <Label htmlFor="up-spontaneous" className="font-normal">Prefer to be spontaneous</Label>
                </div>
              </RadioGroup>
            </div>
            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </AppLayout>
  );
};

export default UpdateInfo;
