import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, MessageCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { spendingTrend, dailyTips } from "@/lib/mockData";

const Dashboard = () => {
  const { user } = useAuth();
  const tip = useMemo(() => dailyTips[Math.floor(Math.random() * dailyTips.length)], []);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {user?.fullName || "there"}!</h1>
          <p className="text-muted-foreground">Here's your financial snapshot.</p>
        </div>

        {/* Daily Tip */}
        <Card className="border-accent/20 bg-accent/5">
          <CardContent className="flex items-start gap-4 p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
              <Lightbulb className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-accent">Daily Budgeting Tip</p>
              <p className="mt-1 text-sm text-foreground">{tip}</p>
            </div>
          </CardContent>
        </Card>

        {/* Spending Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monthly Spending Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={spendingTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 89%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                  <Tooltip formatter={(v: number) => [`$${v}`, "Spending"]} />
                  <Line type="monotone" dataKey="amount" stroke="hsl(152, 44%, 49%)" strokeWidth={2.5} dot={{ fill: "hsl(152, 44%, 49%)", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Monthly Income</p>
              <p className="text-2xl font-bold">${user?.monthlyIncome?.toLocaleString() || "6,500"}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Est. Monthly Expenses</p>
              <p className="text-2xl font-bold">$3,435</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">Savings Rate</p>
              <p className="text-2xl font-bold text-accent">47%</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Floating Chat */}
      <Link to="/chat" className="fixed bottom-6 right-6 z-50">
        <Button size="icon" className="h-14 w-14 rounded-full bg-accent text-accent-foreground shadow-lg hover:bg-accent/90">
          <MessageCircle className="h-6 w-6" />
        </Button>
      </Link>
    </AppLayout>
  );
};

export default Dashboard;
