import { Router } from "express"
import { TaskHistoryController } from "@/controllers/task-history-controller"
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated"

const taskHistoryController = new TaskHistoryController()

const taskHistoryRoutes = Router()

taskHistoryRoutes.use(ensureAuthenticated)
taskHistoryRoutes.post("/", taskHistoryController.create)

export { taskHistoryRoutes }
