import "dotenv/config";

import { app } from "./app.js";
import { connectDatabase } from "./config/db.js";

const port = Number(process.env.PORT ?? 3001);

async function start() {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is required");
  }

  await connectDatabase();

  app.listen(port, () => {
    console.log(
      `CareBridge API running on http://localhost:${port}`
    );
  });
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});