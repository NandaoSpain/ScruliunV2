import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "@/database/prisma";
import { hash } from "bcrypt";
import { AppError } from "@/utils/AppError";
import { UserRole } from "@prisma/client";

class UsersController {
  async create(request: Request, response: Response) {
    const userSchema = z.object({
      name: z.string().min(3).trim(),
      email: z.string().email(),
      password: z.string().min(6),
      role: z.enum(["admin", "user"]),
    });

    const { name, email, password, role } = userSchema.parse(request.body);

    const userWithSameEmail = await prisma.user.findMany({
      where: { email: email },
    });

    if (userWithSameEmail.length > 0) {
      throw new AppError(
        `User ${userWithSameEmail} already exists, forgot your user or password?`,
        400
      );
    }

    const hashedPassword = await hash(password, 8);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role as UserRole,
      },
    });

    const { password: _, ...userWithoutPassword } = user;

    response.status(201).json(userWithoutPassword);
  }

  async remove(request: Request, response: Response) {
    const bodySchema = z.object({
      email: z.string().email(),
    });
    const { email } = bodySchema.parse(request.body);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError(`User with email ${email} not found`, 404);
    }

    await prisma.user.delete({
      where: { id: user.id },
    });

    response.status(204).send();
  }

  async index(request: Request, response: Response): Promise<void> {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!users.length) {
      throw new AppError("No users found", 404);
    }

    response.json(users);
  }
  async show(request: Request, response: Response) {
    const { id } = request.params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: { Task: true }
    });
    if (!user) {
      throw new AppError(`User not found`, 404);
    }
    response.json(user);
  }
}

export { UsersController };
