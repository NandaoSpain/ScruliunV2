import request from "supertest"
import { app } from "@/app"
import { prisma } from "@/database/prisma"

describe("UsersController", () => {
  let userId: string
  afterAll(async() => {
    if(userId) {
      await prisma.user.delete({ where: { id: userId } })
    }
  })
  it("should create a new user", async () => {
    const userResponse = await request(app).post("/users").send({
      name: "Alice",
      email: "alice@example.com",
      password: "password123",
      role: "admin"
    })
    userId = userResponse.body.id
    expect(userResponse.status).toBe(201)
  })
})
