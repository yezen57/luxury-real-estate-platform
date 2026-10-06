// @ts-nocheck
import app from "./app";
import { logger } from "./lib/logger";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

// @ts-ignore - Vercel strict mode complains about Express types
app.listen(port, () => {
  logger.info({ port }, "Server listening");
});

