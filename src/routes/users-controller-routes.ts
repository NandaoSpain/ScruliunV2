import { Router } from "express";
import { UsersController } from "@/controllers/users-controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";

const usersRoutes = Router();
const usersController = new UsersController();

usersRoutes.post("/", usersController.createUser);
usersRoutes.delete(
  "/",
  ensureAuthenticated,
  verifyUserAuthorization(["admin"]),
  usersController.removeUser
);

export { usersRoutes };
