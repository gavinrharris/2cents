-- Seed data: Spender types, sample budgets/savings, then 4 sample users (Login + Profile)
-- Run after schema.sql

-- Spender types (referenced by Profile)
INSERT INTO Spender (TypeName, Description) VALUES
  ('Conservative', 'Prefers saving and rarely splurges'),
  ('Moderate', 'Balances spending and saving'),
  ('Spender', 'Enjoys spending on wants'),
  ('Flexible', 'Varies by month and goals');

-- Savings records
INSERT INTO Savings (CurrentSavings, DesiredSavings, EndDate, InitialSavings) VALUES
  (1500.00, 5000.00, '2025-12-31', 1000.00),
  (3200.00, 10000.00, '2026-06-30', 2000.00),
  (500.00, 2000.00, '2025-09-01', 500.00),
  (8000.00, 15000.00, '2026-12-31', 6000.00);

-- Monthly budgets (Income, CarPayment, Rent, Gas, JobStabilityFlag, WeeklyGrocery, EatingOutPerWeek, RecurringExpenses)
INSERT INTO MonthlyBudget (Income, CarPayment, Rent, Gas, JobStabilityFlag, WeeklyGrocery, EatingOutPerWeek, RecurringExpenses) VALUES
  (4500.00, 350.00, 1200.00, 150.00, true, 120.00, 2, 'Netflix $15, Gym $40, Spotify $10'),
  (6200.00, 0.00, 1400.00, 200.00, true, 150.00, 3, 'Streaming $25, Insurance $80'),
  (3200.00, 280.00, 900.00, 120.00, false, 80.00, 1, 'Phone $60'),
  (5500.00, 420.00, 1100.00, 180.00, true, 140.00, 2, 'Netflix $15, Spotify $10, Gym $45');

-- 4 sample users: Login then Profile
-- Password for all 4 accounts: password (bcrypt hash below)
INSERT INTO Login (Email, Password, RecoveryEmail) VALUES
  ('alex.smith@example.com', '$2b$10$WMvhkuipa7Lr0otxcnJ1ZekwMX5g24AGu8xkO3H5sJBzbxwaL85EK', 'alex.recovery@example.com'),
  ('jordan.lee@example.com', '$2b$10$WMvhkuipa7Lr0otxcnJ1ZekwMX5g24AGu8xkO3H5sJBzbxwaL85EK', 'jordan.recovery@example.com'),
  ('sam.taylor@example.com', '$2b$10$WMvhkuipa7Lr0otxcnJ1ZekwMX5g24AGu8xkO3H5sJBzbxwaL85EK', 'sam.recovery@example.com'),
  ('casey.martin@example.com', '$2b$10$WMvhkuipa7Lr0otxcnJ1ZekwMX5g24AGu8xkO3H5sJBzbxwaL85EK', 'casey.recovery@example.com');

INSERT INTO Profile (Email, FirstName, LastName, State, BudgetID, SavingsID, SpenderID) VALUES
  ('alex.smith@example.com', 'Alex', 'Smith', 'California', 1, 1, 1),
  ('jordan.lee@example.com', 'Jordan', 'Lee', 'New York', 2, 2, 2),
  ('sam.taylor@example.com', 'Sam', 'Taylor', 'Texas', 3, 3, 3),
  ('casey.martin@example.com', 'Casey', 'Martin', 'Washington', 4, 4, 4);
