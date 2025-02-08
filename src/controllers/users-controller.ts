import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "@/database/prisma";
import { hash } from "bcrypt";
import { AppError } from "@/utils/AppError";

class UsersController {
  async createUser(request: Request, response: Response) {
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
        role: request.body.role,
      },
    });

    const { password: _, ...userWithoutPassword } = user

    response.status(201).json(userWithoutPassword);
  }
}

export { UsersController }
