import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { TaskPriority, TaskStatus } from "@prisma/client";
import { Request, Response } from "express";
import { z } from "zod";

class TasksController {
  async create(request: Request, response: Response) {
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

    const taskStatus = task.status

    const taskHistory = await prisma.taskHistory.create({
      data: {
        taskId: task.id,
        action: "created",
        userId: user.id,
      },
    })

    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        assignedTo: user.id,
        teamId: teamData.id,
        status: request.body.status ?? TaskStatus.pending,
        priority: request.body.priority ?? TaskPriority.low,
      },
    });

    response.json(newTask);
  }
  async index(request: Request, response: Response) {
    const tasks = await prisma.task.findMany({
      include: {
        User: { select: { id: true, name: true } },
        Team: { select: { id: true, name: true } },
      },
    });
    response.json(tasks);
  }
  async show(request: Request, response: Response) {
    const { id } = request.params;
    const task = await prisma.task.findFirst({
      where: { id },
      include: {
        User: { select: { id: true, name: true } },
        Team: { select: { id: true, name: true } },
      },
    });
    if (!task) {
      throw new AppError("Task not found", 404);
    }
    response.json(task);
  }
  async update(request: Request, response: Response) {
    const { id } = request.params;
    const bodySchema = z.object({
      assignedTo: z.string(),
      team: z.string(),
      status: z.nativeEnum(TaskStatus).default(TaskStatus.pending), 
      priority: z.nativeEnum(TaskPriority).default(TaskPriority.low)
    });
    const { assignedTo, team, status, priority } = bodySchema.parse(
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
    const task = await prisma.task.update({
      where: { id },
      data: {
        assignedTo: user.id,
        teamId: teamData.id,
        status,
        priority,
      },
      include: {
        User: { select: { id: true, name: true } },
        Team: { select: { id: true, name: true } },
      },
    })
    response.json(task);
  } 
  async remove(request: Request, response: Response) {
    const { id } = request.params
    const task = await prisma.task.findFirst({ where: { id: id} })
    if (!task) {
      throw new AppError("Task not found", 404);
    }
    await prisma.task.delete({ where: { id: id } })
    response.status(201).json({ message: "Task deleted successfully"});
  }
}

export { TasksController };
