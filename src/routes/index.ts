import { Router } from "express"
import { usersRoutes } from "./users-routes";
import { sessionsRoutes } from "./sessions-routes";
import { teamsRoutes } from "./teams-routes";
import { tasksRoutes } from "./tasks-routes";
import { teamMembersRoutes } from "./team-members-routes";

const routes = Router()

routes.use("/users", usersRoutes)
routes.use("/sessions", sessionsRoutes)
routes.use("/teams", teamsRoutes)
routes.use("/tasks", tasksRoutes)
routes.use("/team-members", teamMembersRoutes)

export { routes }
