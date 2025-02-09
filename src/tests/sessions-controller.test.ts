import { app } from "@/app";
import request from "supertest";

describe("SessionsController", () => {
  let authToken: string;
  beforeAll(async () => {
    await request(app).post("/users").send({
      name: "Test User",
      email: "test@example.com",
      password: "123456",
      role: "admin",
    });
  });
  afterAll(async () => {
    await request(app)
      .delete("/users")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ email: "test@example.com" });
  });

  it("should be 404 not found a user with a inexistent email", async () => {
    const response = await request(app)
      .post("/sessions")
      .send({ email: "inexistent@email.com", password: "123456" });

    expect(response.status).toBe(404);
  });

  it("should be 401 unauthorized with wrong password", async () => {
    const response = await request(app)
      .post("/sessions")
      .send({ email: "test@example.com", password: "wrong_password" });

    expect(response.status).toBe(401);
  });

  it("should be able to create a session with valid credentials", async () => {
    const response = await request(app)
      .post("/sessions")
      .send({ email: "test@example.com", password: "123456" });
    authToken = response.body.token;
    expect(response.status).toBe(200);
  });
});
