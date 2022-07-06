import { Router } from "express";
import { authByEmailPwd } from "../helpers/authByEmailPwd.js";
import { nanoid } from "nanoid";
import { USERS_BBDD } from "../bbdd.js";

export const authSessionRouter = Router();
const sessions = [];

// Login con email y password
authSessionRouter.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.sendStatus(400);

  try {
    const { guid } = authByEmailPwd(email, password);
    const sessionId = nanoid();

    sessions.push({ sessionId, guid });
    res.cookie("sessionId", sessionId, {
      httpOnly: true,
    });
    return res.send();
  } catch (error) {
    return res.sendStatus(401);
  }
});

// Solicitud con sesion para obtener el perfil del usuario
authSessionRouter.get("/profile", (req, res) => {
  const { cookies } = req;
  if (!cookies.sessionId) return res.sendStatus(401);

  const userSessionId = sessions.find(
    (session) => session.sessionId === cookies.sessionId
  );
  if (!userSessionId) return res.sendStatus(401);

  const user = USERS_BBDD.find((user) => user.guid === userSessionId.guid);
  if (!user) return res.sendStatus(401);
  delete user.password;

  return res.send(user);
});
