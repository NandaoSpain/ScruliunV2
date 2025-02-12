import { Router } from "express"
import { TeamMembersController } from "@/controllers/team-members-controller"
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated"
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization"

const teamMembersController = new TeamMembersController()

const teamMembersRoutes = Router()

teamMembersRoutes.use(ensureAuthenticated)
teamMembersRoutes.use(verifyUserAuthorization(["admin"]))
teamMembersRoutes.post("/", teamMembersController.relationships)
teamMembersRoutes.delete("/:id", teamMembersController.remove)
teamMembersRoutes.get("/", teamMembersController.index)
teamMembersRoutes.get("/:id", teamMembersController.show)

export { teamMembersRoutes }