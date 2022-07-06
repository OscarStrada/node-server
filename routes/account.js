import { Router } from "express";
import { USERS_BBDD } from "../bbdd.js";

export const accountRouter = Router();

// Middleware
accountRouter.use((req, res, next) => {
  console.log(req.ip);
  next();
});

// Obtener los detalles de una cuenta a partir del _id
accountRouter.get("/:guid", (req, res) => {
  const { guid } = req.params;
  const user = USERS_BBDD.find((user) => user._id === guid);
  if (!user) {
    return res.status(404).send();
  } else {
    return res.send(user);
  }
});

// Crear una nueva cuenta
accountRouter.post("/", (req, res) => {
  const { _id, name } = req.body;
  const user = USERS_BBDD.find((user) => user._id === _id);

  if (!_id || !name) return res.status(400).send();

  if (user) {
    return res.status(409).send();
  } else {
    USERS_BBDD.push({
      _id,
      name,
    });
    return res.send();
  }
});

// Actualizar el nombre de una cuenta
accountRouter.put("/:guid", (req, res) => {
  const { guid } = req.params;
  const { name } = req.body;
  const user = USERS_BBDD.find((user) => user._id === guid);

  if (!name) return res.status(400).send();

  if (!user) {
    return res.status(404).send();
  } else {
    user.name = name;
    return res.send();
  }
});

// Eliminar una cuenta
accountRouter.delete("/:guid", (req, res) => {
  const { guid } = req.params;
  const userIndex = USERS_BBDD.findIndex((user) => user._id === guid);
  if (userIndex === -1) {
    return res.status(404).send();
  } else {
    USERS_BBDD.splice(userIndex, 1);
    return res.send();
  }
});
