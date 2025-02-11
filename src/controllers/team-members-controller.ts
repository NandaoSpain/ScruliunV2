import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { Request, Response } from "express";
import { z } from "zod";

class TeamMembersController {
  async relationships(request: Request, response: Response) {
    const bodySchema = z.object({
      teamName: z.string(),
      userName: z.string(),
    });

    const { teamName, userName } = bodySchema.parse(request.body);

    const [team, user] = await Promise.all([
      prisma.team.findUnique({ where: { name: teamName } }),
      prisma.user.findFirst({ where: { name: userName } }),
    ]);

    if (!team) {
      throw new AppError("Team not found", 404);
    }

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const existingRelationship = await prisma.teamMembers.findUnique({
      where: { userId_teamId: { userId: user.id, teamId: team.id } }
    });

    if (existingRelationship) {
      throw new AppError("Relationship already exists", 409);
    }

    const relationship = await prisma.teamMembers.create({
      data: { teamId: team.id, userId: user.id },
    });
    response.status(201).json(relationship);
  }
  async remove(request: Request, response: Response) {
    const { id } = request.params
    const relationship = await prisma.teamMembers.findUnique({ where: { id } });
    if (!relationship) {
      throw new AppError("Relationship not found", 404);
    }
    await prisma.teamMembers.delete({ where: { id } });
    response.status(204).send();
  }
}

export { TeamMembersController };
