import request from "supertest";
import { app } from "@/app";

describe("TasksController", () => {
  let teamId: string;
  let authToken: string;
  let taskId: string;
  beforeAll(async () => {
    const userResponse = await request(app).post("/users").send({
      name: "johw",
      email: "johw@example.com",
      password: "password123",
      role: "admin",
    });

    const response = await request(app).post("/sessions").send({
      email: "johw@example.com",
      password: "password123",
    });
    authToken = response.body.token;

    const teamResponse = await request(app)
      .post("/teams")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        name: "testTeam",
        description: "a team for tests",
      });
    teamId = teamResponse.body.id;
  });
  afterAll(async () => {
    const taskRemove = await request(app)
      .delete(`/tasks/${taskId}`)
      .set("Authorization", `Bearer ${authToken}`)
    expect(taskRemove.status).toBe(201)
    
    const teamRemove = await request(app)
      .delete(`/teams/${teamId}`)
      .set("Authorization", `Bearer ${authToken}`)
    expect(teamRemove.status).toBe(204)

    const userRemove = await request(app)
      .delete("/users")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ email: "johw@example.com" });
    expect(userRemove.status).toBe(204);

  });
  it("should be able to create a new task", async () => {
    const response = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        title: "New Task",
        description: "This is a new task",
        assignedTo: "johw",
        team: "testTeam",
      });
    taskId = response.body.id;
    expect(response.status).toBe(200);
    expect(response.body.title).toBe("New Task");
    expect(response.body.description).toBe("This is a new task");
  });

  it("should be able to get all tasks", async () => {
    const responseTask = await request(app)
      .get("/tasks")
      .set("Authorization", `Bearer ${authToken}`);
    expect(responseTask.status).toBe(200);
    expect(responseTask.body.length).toBeGreaterThan(0);
  });

  it("should be able to get a single task by ID", async () => {
    const taskIndex = await request(app)
      .get(`/tasks/${taskId}`)
      .set("Authorization", `Bearer ${authToken}`)
      
    expect(taskIndex.status).toBe(200);
    expect(taskIndex.body.title).toBe("New Task");
    expect(taskIndex.body.description).toBe("This is a new task");
    expect(taskIndex.body.id).toBe(`${taskId}`);
  });
});
