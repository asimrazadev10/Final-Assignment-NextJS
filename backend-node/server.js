import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import cron from "node-cron";

import connectToMongo from "./db.js";
import alertService from "./services/alertService.js";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import subscriptionRoutes from "./routes/subscriptions.js";
import workspaceRoutes from "./routes/workspaces.js";
import planRoutes from "./routes/plans.js";
import clientRoutes from "./routes/clients.js";
import budgetRoutes from "./routes/budgets.js";
import subscriptionClientRoutes from "./routes/subscriptionClients.js";
import alertRoutes from "./routes/alerts.js";
import invoiceRoutes from "./routes/invoices.js";
import userPlanRoutes from "./routes/userPlans.js";
import uploadRoutes from "./routes/upload.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

app.get("/api/health", (_req, res) =>
  res.json({ ok: true, service: "subflow" })
);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/subscriptionClients", subscriptionClientRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/userPlans", userPlanRoutes);
app.use("/api/upload", uploadRoutes);

const PORT = process.env.PORT;

connectToMongo().then(() => {
  app.listen(PORT, () => {
    console.log(`API active on http://localhost:${PORT}`);
    
    // Run alert checks immediately on startup
    alertService.runAlertChecks();
    
    // Schedule alert checks to run every hour
    // Cron format: minute hour day month day-of-week
    // '0 * * * *' means at minute 0 of every hour
    cron.schedule('0 * * * *', () => {
      console.log('Running scheduled alert checks...');
      alertService.runAlertChecks();
    });
    
    console.log('Automatic alert checking scheduled to run every hour');
  });
});
