import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

async function main() {
  try {
    console.log("📦 Starting database deployment...");
    
    console.log("🔄 Running database migrations...");
    await execAsync("npx prisma migrate deploy");
    
    console.log("🔄 Generating Prisma client...");
    await execAsync("npx prisma generate");
    
    console.log("✅ Database deployment completed successfully!");
  } catch (error) {
    console.error("❌ Error during database deployment:", error);
    process.exit(1);
  }
}

main(); 