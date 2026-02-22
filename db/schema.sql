-- twocents database schema
-- Create tables in dependency order: Login, Spender, Savings, MonthlyBudget, then Profile

CREATE TABLE Login (
  Email VARCHAR(255) PRIMARY KEY,
  Password VARCHAR(255) NOT NULL,
  RecoveryEmail VARCHAR(255)
);

CREATE TABLE Spender (
  SpenderID SERIAL PRIMARY KEY,
  TypeName VARCHAR(100),
  Description TEXT
);

CREATE TABLE Savings (
  SavingsID SERIAL PRIMARY KEY,
  CurrentSavings DECIMAL(12, 2) DEFAULT 0,
  DesiredSavings DECIMAL(12, 2),
  EndDate DATE,
  InitialSavings DECIMAL(12, 2) DEFAULT 0
);

CREATE TABLE MonthlyBudget (
  BudgetID SERIAL PRIMARY KEY,
  Income DECIMAL(12, 2),
  CarPayment DECIMAL(12, 2),
  Rent DECIMAL(12, 2),
  Gas DECIMAL(12, 2),
  JobStabilityFlag BOOLEAN DEFAULT false,
  WeeklyGrocery DECIMAL(10, 2),
  EatingOutPerWeek DECIMAL(10, 2),
  RecurringExpenses TEXT
);

CREATE TABLE Profile (
  UserID SERIAL PRIMARY KEY,
  Email VARCHAR(255) NOT NULL UNIQUE REFERENCES Login(Email),
  FirstName VARCHAR(100),
  LastName VARCHAR(100),
  State VARCHAR(100),
  BudgetID INTEGER REFERENCES MonthlyBudget(BudgetID),
  SavingsID INTEGER REFERENCES Savings(SavingsID),
  SpenderID INTEGER REFERENCES Spender(SpenderID)
);
