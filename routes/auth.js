import { Router } from "express";
import { authByEmailPwd } from "../helpers/authByEmailPwd.js";

export const authRouter = Router();

// Endpoint publico no autenticado y no autorizado
authRouter.get("/publico", (req, res) => res.send("Endpoint público"));

// Endpoint autenticado para todo usuario registrado
authRouter.post("/autenticado", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.sendStatus(400);

  try {
    const user = authByEmailPwd(email, password);
    return res.send(`Usuario ${user.name} autenticado`);
  } catch (error) {
    return res.sendStatus(401);
  }
});

// Endpoint autorizado para administradores
authRouter.post("/autorizado", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.sendStatus(400);

  try {
    const user = authByEmailPwd(email, password);
    if (user.role !== "admin") return res.sendStatus(403);
    res.send(`Usuario administrador ${user.name}`);
  } catch (error) {
    return res.sendStatus(401);
  }
});
