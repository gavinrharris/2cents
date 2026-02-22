/**
 * Generate bcrypt hashes for seed.sql Login passwords.
 * Run from backend: node scripts/generate-seed-passwords.js
 * Use the same password for all 4 seed users (default: "password").
 */
import bcrypt from "bcrypt";

const password = process.argv[2] || "password";
const rounds = 10;

const hash = await bcrypt.hash(password, rounds);
console.log("-- Replace the Password values in db/seed.sql with this hash (password is:", JSON.stringify(password) + ")");
console.log(hash);
console.log("");
console.log("-- Or use this full Login INSERT (copy into seed.sql):");
console.log(`INSERT INTO Login (Email, Password, RecoveryEmail) VALUES`);
console.log(`  ('alex.smith@example.com', '${hash}', 'alex.recovery@example.com'),`);
console.log(`  ('jordan.lee@example.com', '${hash}', 'jordan.recovery@example.com'),`);
console.log(`  ('sam.taylor@example.com', '${hash}', 'sam.recovery@example.com'),`);
console.log(`  ('casey.martin@example.com', '${hash}', 'casey.recovery@example.com');`);
