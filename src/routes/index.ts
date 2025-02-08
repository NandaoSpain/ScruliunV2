import { Router } from "express"
import { usersRoutes } from "./users-controller-routes";

const routes = Router()

routes.use("/users", usersRoutes)

export { routes }
