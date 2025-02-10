import { Router } from "express";
import { TeamsController } from "@/controllers/teams-controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verify-user-authorization";

const teamsRoutes = Router()

const teamsController = new TeamsController()

teamsRoutes.use(ensureAuthenticated)
teamsRoutes.use(verifyUserAuthorization(["admin"]))

teamsRoutes.get('/', teamsController.index)
teamsRoutes.post('/', teamsController.create)
teamsRoutes.put('/:id', teamsController.update)
teamsRoutes.delete('/:id', teamsController.remove)

export { teamsRoutes }
