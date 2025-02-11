import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { Request, Response } from "express";
import { z } from "zod";

class TeamsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().min(3).max(50),
      description: z.string().min(3),
    });
    const team = bodySchema.parse(request.body);

    const teamExists = await prisma.team.findUnique({
      where: { name: team.name },
    });

    if (teamExists) {
      throw new AppError("Team already exists", 400);
    }

    const newTeam = await prisma.team.create({
      data: team,
    });

    response.status(201).json(newTeam);
  }
  async remove(request: Request, response: Response) {
    const { id } = request.params;
    const team = await prisma.team.findUnique({ where: { id: id } });
    const task = await prisma.task.findFirst({ where: { teamId: id } });

    if (task?.teamId === team?.id) {
      throw new AppError("Can't delete team with tasks assigned", 400);
    }

    if (!team) {
      throw new AppError("Team not found", 404);
    }

    await prisma.team.delete({ where: { id: id } });

    response.status(204).send();
  }
  async update(request: Request, response: Response) {
    const { id } = request.params;
    const bodySchema = z.object({
      name: z.string().min(3).max(50),
      description: z.string().min(3),
    });
    const { description, name } = bodySchema.parse(request.body);
    const team = await prisma.team.findUnique({ where: { id: id } });
    if (!team) {
      throw new AppError("Team not found", 404);
    }
    await prisma.team.update({
      where: { id: id },
      data: { description, name },
    });
    response.status(200).json(team);
  }
  async index(request: Request, response: Response) {
    const teams = await prisma.team.findMany();
    response.json(teams);
  }
  async show(request: Request, response: Response) {
    const { id } = request.params;
    const team = await prisma.team.findUnique({
      where: { id: id },
      include: { 
        Task: { select: { title: true } }
      },
    });
    if (!team) {
      throw new AppError("Team not found", 404);
    }
    response.json(team);
  }

}
export { TeamsController };
