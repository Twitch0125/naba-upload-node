import { config } from "dotenv";
config();

if (!process.env.AUTH_PASSWORD) {
  console.log("Please set AUTH_PASSWORD environment variable");
  process.exit();
}


process.addListener("SIGINT", () => process.exit());
process.addListener("SIGTERM", () => process.exit());
process.addListener("SIGABRT", () => process.exit());