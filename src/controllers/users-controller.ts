import { Request, Response } from "express";
import { z } from "zod";

class UsersController {
  async createUser(request: Request, response: Response) {
    const userSchema = z.object({
      name: z.string().min(3),
      email: z.string().email(),
      password: z.string().min(6),
      role: z.string(),
      team: z.string().trim()
    })

    const { name, email, password, role, team } = userSchema.parse(request.body)

    
  }
}
