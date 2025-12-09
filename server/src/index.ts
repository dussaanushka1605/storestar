import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { addStoreSchema, addUserSchema, loginSchema, ratingSchema, signupSchema } from "./validators";
import { comparePassword, hashPassword, signToken, verifyToken } from "./auth";

const prisma = new PrismaClient();
const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

type AuthPayload = { id: string; role: "admin" | "normal_user" | "store_owner" };

function authMiddleware(req: Request & { user?: AuthPayload }, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "unauthorized" });
  const token = header.replace("Bearer ", "");
  try {
    const payload = verifyToken(token) as AuthPayload;
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: "unauthorized" });
  }
}

app.post("/auth/signup", async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid" });
  const { name, email, address, password } = parsed.data;
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(409).json({ error: "email_exists" });
  const pwd = await hashPassword(password);
  const user = await prisma.user.create({ data: { name, email, address, password: pwd, role: "normal_user" } });
  const token = signToken({ id: user.id, role: user.role });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, address: user.address, role: user.role, createdAt: user.createdAt } });
});

app.post("/auth/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid" });
  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: "invalid_credentials" });
  const ok = await comparePassword(password, user.password);
  if (!ok) return res.status(401).json({ error: "invalid_credentials" });
  const token = signToken({ id: user.id, role: user.role });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, address: user.address, role: user.role, createdAt: user.createdAt } });
});

app.patch("/users/:id/password", authMiddleware, async (req, res) => {
  const { newPassword } = req.body as { newPassword: string };
  if (!newPassword) return res.status(400).json({ error: "invalid" });
  const pwd = await hashPassword(newPassword);
  await prisma.user.update({ where: { id: req.params.id }, data: { password: pwd } });
  res.json({ success: true });
});

app.get("/admin/stats", authMiddleware, async (req, res) => {
  const me = req.user!;
  if (me.role !== "admin") return res.status(403).json({ error: "forbidden" });
  const [totalUsers, totalStores, totalRatings] = await Promise.all([
    prisma.user.count(),
    prisma.store.count(),
    prisma.rating.count(),
  ]);
  res.json({ totalUsers, totalStores, totalRatings });
});

app.post("/admin/users", authMiddleware, async (req, res) => {
  const me = req.user!;
  if (me.role !== "admin") return res.status(403).json({ error: "forbidden" });
  const parsed = addUserSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid" });
  const { name, email, address, password, role } = parsed.data;
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(409).json({ error: "email_exists" });
  const pwd = await hashPassword(password);
  const user = await prisma.user.create({ data: { name, email, address, password: pwd, role } });
  res.json({ id: user.id, name: user.name, email: user.email, address: user.address, role: user.role, createdAt: user.createdAt });
});

app.get("/admin/users", authMiddleware, async (req, res) => {
  const me = req.user!;
  if (me.role !== "admin") return res.status(403).json({ error: "forbidden" });
  const q = typeof req.query.q === "string" ? req.query.q : undefined;
  const role = typeof req.query.role === "string" ? req.query.role : undefined;
  const sortField = typeof req.query.sortField === "string" ? req.query.sortField : "createdAt";
  const sortOrder = typeof req.query.sortOrder === "string" ? req.query.sortOrder : "desc";
  const where: Record<string, unknown> = {};
  if (role && role !== "all") where["role"] = role;
  if (q) (where as Record<string, unknown>).OR = [
    { name: { contains: q, mode: "insensitive" } },
    { email: { contains: q, mode: "insensitive" } },
    { address: { contains: q, mode: "insensitive" } },
  ];
  const users = await prisma.user.findMany({ where, orderBy: { [sortField]: sortOrder as "asc" | "desc" } });
  res.json(users.map(u => ({ id: u.id, name: u.name, email: u.email, address: u.address, role: u.role, createdAt: u.createdAt })));
});

app.post("/admin/stores", authMiddleware, async (req, res) => {
  const me = req.user!;
  if (me.role !== "admin") return res.status(403).json({ error: "forbidden" });
  const parsed = addStoreSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid" });
  const store = await prisma.store.create({ data: parsed.data });
  res.json(store);
});

app.get("/admin/stores", authMiddleware, async (req, res) => {
  const me = req.user!;
  if (me.role !== "admin") return res.status(403).json({ error: "forbidden" });
  const q = typeof req.query.q === "string" ? req.query.q : undefined;
  const sortField = typeof req.query.sortField === "string" ? req.query.sortField : "createdAt";
  const sortOrder = typeof req.query.sortOrder === "string" ? req.query.sortOrder : "desc";
  const where: Record<string, unknown> = {};
  if (q) (where as Record<string, unknown>).OR = [
    { name: { contains: q, mode: "insensitive" } },
    { address: { contains: q, mode: "insensitive" } },
  ];
  const stores = await prisma.store.findMany({ where, orderBy: { [sortField]: sortOrder as "asc" | "desc" }, include: { owner: true } });
  const data = await Promise.all(stores.map(async s => {
    const avg = await prisma.rating.aggregate({ where: { storeId: s.id }, _avg: { rating: true }, _count: { rating: true } });
    return { ...s, averageRating: avg._avg.rating || 0, totalRatings: avg._count.rating };
  }));
  res.json(data);
});

app.get("/stores", authMiddleware, async (req, res) => {
  const q = typeof req.query.q === "string" ? req.query.q : undefined;
  const where: Record<string, unknown> = {};
  if (q) (where as Record<string, unknown>).OR = [
    { name: { contains: q, mode: "insensitive" } },
    { address: { contains: q, mode: "insensitive" } },
  ];
  const stores = await prisma.store.findMany({ where });
  const data = await Promise.all(stores.map(async s => {
    const avg = await prisma.rating.aggregate({ where: { storeId: s.id }, _avg: { rating: true } });
    return { ...s, averageRating: avg._avg.rating || 0 };
  }));
  res.json(data);
});

app.post("/stores/:id/ratings", authMiddleware, async (req, res) => {
  const me = req.user!;
  const parsed = ratingSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "invalid" });
  const existing = await prisma.rating.findUnique({ where: { userId_storeId: { userId: me.id, storeId: req.params.id } } });
  if (existing) {
    const updated = await prisma.rating.update({ where: { id: existing.id }, data: { rating: parsed.data.rating } });
    return res.json(updated);
  }
  const created = await prisma.rating.create({ data: { userId: me.id, storeId: req.params.id, rating: parsed.data.rating } });
  res.json(created);
});

app.get("/owner/stores", authMiddleware, async (req, res) => {
  const me = req.user!;
  if (me.role !== "store_owner") return res.status(403).json({ error: "forbidden" });
  const stores = await prisma.store.findMany({ where: { ownerId: me.id } });
  const data = await Promise.all(stores.map(async s => {
    const ratings = await prisma.rating.findMany({ where: { storeId: s.id }, include: { user: true } });
    const avg = await prisma.rating.aggregate({ where: { storeId: s.id }, _avg: { rating: true } });
    return { ...s, ratings, averageRating: avg._avg.rating || 0, totalRatings: ratings.length };
  }));
  res.json(data);
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`server on http://localhost:${port}`);
});
