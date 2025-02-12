import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { TaskStatus } from "@prisma/client";
import { Request, Response } from "express";
import { z } from "zod";

class TaskHistoryController {
  async create(request: Request, response: Response) {
    const { taskId } = request.params;
    const bodySchema = z.object({
      changedBy: z.string(),
      newStatus: z.nativeEnum(TaskStatus),
    });
    const { changedBy, newStatus } = bodySchema.parse(request.body);

    const user = await prisma.user.findFirst({ where: { id: changedBy } });

    if (!user) {
      throw new AppError("User not found", 404);
    }
    const task = await prisma.task.findUnique({ where: { id: taskId } });

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    // o task history tenho q instruduzir a cada alteraçao na task e assim a cada alteraçao gera um historico

    const oldStatus = task.status;
    
    if (oldStatus === newStatus) {
      throw new AppError("New status is the same as the current status", 400);
    }
    await prisma.task.update({
      where: { id: taskId },
      data: { status: newStatus },
    });
    await prisma.taskHistory.create({
      data: {
        taskId: task.id,
        changedBy: user.id,
        oldStatus: oldStatus as TaskStatus,
        newStatus: newStatus as TaskStatus,
      },
    });
  }
}

export { TaskHistoryController };
