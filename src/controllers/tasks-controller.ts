import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { Request, Response } from "express";
import { z } from "zod";

class TasksController {
  async create(request: Request, response: Response): Promise<any> {
    const bodySchema = z.object({
      title: z.string().min(3).max(50),
      description: z.string().min(2).max(200),
      assignedTo: z.string(),
      team: z.string(),
    });
    const { title, description, assignedTo, team } = bodySchema.parse(
      request.body
    );

    const user = await prisma.user.findFirst({
      where: { name: { equals: assignedTo, mode: "insensitive" } },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const teamData = await prisma.team.findFirst({
      where: { name: { equals: team, mode: "insensitive" } },
    });

    if (!teamData) {
      throw new AppError("Team not found", 404);
    }

    const task = await prisma.task.create({      
      data: {
        title,
        description,
        assignedTo: user.id,
        teamId: teamData.id,
      },
    });

    response.json(task);
  }
}

export { TasksController };
