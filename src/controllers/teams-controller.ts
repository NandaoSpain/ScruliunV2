import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"
import { Request, Response } from "express"
import { z } from "zod"

class TeamsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().min(3).max(50),
      description: z.string().min(3)
    })
    const team = bodySchema.parse(request.body)

    const teamExists = await prisma.team.findUnique({ where: { name: team.name} })

    if (teamExists) {
      throw new AppError("Team already exists", 400)
    }
    
    const newTeam = await prisma.team.create({
      data: team,
    })

    response.status(201).json(newTeam)
  }
}

export { TeamsController }