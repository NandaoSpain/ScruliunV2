import { Router } from "express"
import { TasksController } from "@/controllers/tasks-controller"
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated"
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization"

const tasksRoutes = Router()

const tasksController = new TasksController()

tasksRoutes.use(ensureAuthenticated)
tasksRoutes.use(verifyUserAuthorization(["admin"]))
tasksRoutes.post("/", tasksController.create)
tasksRoutes.get("/", tasksController.index)
tasksRoutes.get("/:id", tasksController.show)

export { tasksRoutes }
