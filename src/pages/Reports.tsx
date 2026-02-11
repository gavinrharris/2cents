import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line,
} from "recharts";
import { spendingBreakdown, savingsTrend } from "@/lib/mockData";

const Reports = () => (
  <AppLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Finance Report</h1>
        <p className="text-muted-foreground">Your monthly financial overview</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Total Income</p>
            <p className="text-2xl font-bold">$6,500</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Total Expenses</p>
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

      {/* Spending Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Spending Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={spendingBreakdown} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 89%)" />
                <XAxis type="number" tickFormatter={(v) => `$${v}`} tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="category" tick={{ fontSize: 12 }} width={90} />
                <Tooltip formatter={(v: number) => [`$${v}`, "Amount"]} />
                <Bar dataKey="amount" fill="hsl(152, 44%, 49%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Savings Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Savings Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={savingsTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 89%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v) => `$${v}`} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v: number) => [`$${v}`, "Saved"]} />
                <Line type="monotone" dataKey="saved" stroke="hsl(152, 44%, 49%)" strokeWidth={2.5} dot={{ fill: "hsl(152, 44%, 49%)", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  </AppLayout>
);

export default Reports;
