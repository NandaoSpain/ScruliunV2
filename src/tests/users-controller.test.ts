import request from "supertest";
import { app } from "@/app";

describe("UsersController", () => {
  let userEmail: string;
  let authToken: string;

  it("should create a new user", async () => {
    const userResponse = await request(app).post("/users").send({
      name: "Alice",
      email: "alice@example.com",
      password: "password123",
      role: "admin",
    });
    userEmail = userResponse.body.email;
    expect(userResponse.status).toBe(201);
  });

  it("should not create a new user with email existing", async () => {
    const response = await request(app).post("/users").send({
      name: "Bob",
      email: "alice@example.com",
      password: "password123",
      role: "admin",
    });
    expect(response.status).toBe(400);
  });

  it("should create a session", async () => {
    const response = await request(app).post("/sessions").send({
      email: "alice@example.com",
      password: "password123",
    });
    authToken = response.body.token;
    expect(response.status).toBe(200);
    expect(response.body.token).toBeTruthy();
  });

  it("should return a list of users", async () => {
    const response = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it("should remove a user", async () => {
    const response = await request(app)
      .delete("/users")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ email: userEmail });

    expect(response.status).toBe(204);
  });

  it("should not remove a user without authorization", async () => {
    const response = await request(app)
      .delete("/users")
      .send({ email: userEmail });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("invalid JWT token");
  });

  it("should not remove a inexistent user", async () => {
    const response = await request(app)
      .delete("/users")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ email: "nonexistent@example.com" });

    expect(response.status).toBe(404);
  });
});
