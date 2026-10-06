// @ts-nocheck
import { Router } from "express";

const router = Router();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

router.post("/admin/login", (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    req.session!.admin = true;
    res.json({ success: true, message: "تم تسجيل الدخول بنجاح" });
  } else {
    res.status(401).json({ success: false, message: "بيانات الدخول غير صحيحة" });
  }
});

router.post("/admin/logout", (req, res) => {
  req.session = null;
  res.json({ message: "تم تسجيل الخروج بنجاح" });
});

router.get("/admin/me", (req, res): void => {
  if (!req.session?.admin) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  res.json({ username: ADMIN_USERNAME, authenticated: true });
});

export default router;

