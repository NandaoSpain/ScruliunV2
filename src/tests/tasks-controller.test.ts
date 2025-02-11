import request from "supertest";
import { app } from "@/app";

describe("TasksController", () => {
  let teamId: string;
  let authToken: string;
  let taskId: string;
  let relationshipId: string
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
    const teamRemove = await request(app)
      .delete(`/teams/${teamId}`)
      .set("Authorization", `Bearer ${authToken}`);
    expect(teamRemove.status).toBe(204);

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
      .set("Authorization", `Bearer ${authToken}`);

    expect(taskIndex.status).toBe(200);
    expect(taskIndex.body.title).toBe("New Task");
    expect(taskIndex.body.description).toBe("This is a new task");
    expect(taskIndex.body.id).toBe(`${taskId}`);
  });

  it("should return 404 if task ID does not exist", async () => {
    const response = await request(app)
      .get("/tasks/non-existent-id")
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Task not found");
  });

  it("should be return 404 when create a task with a non-existent user", async () => {
    const response = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        title: "New Task",
        description: "This is a new task",
        assignedTo: "non-existent-user",
        team: "testTeam",
      });
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("User not found");
  });

  it("should be return 404 when trying to update a task assigned to a different user", async () => {
    const response = await request(app)
     .put(`/tasks/${taskId}`)
     .set("Authorization", `Bearer ${authToken}`)
     .send({
        title: "Updated Task",
        description: "This is an updated task",
        assignedTo: "another-user",
        team: "testTeam",
      });
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("User not found");
  });

  it("should be able to update a task", async () => {
    const response = await request(app)
     .put(`/tasks/${taskId}`)
     .set("Authorization", `Bearer ${authToken}`)
     .send({
        assignedTo: "johw",
        team: "testTeam",
        status: "completed",
        priority: "high",
      });
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("completed");
  });

  it("should be able to delete a task", async () => {
    const response = await request(app)
     .delete(`/tasks/${taskId}`)
     .set("Authorization", `Bearer ${authToken}`);
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Task deleted successfully");
  });

  it("should return 404 when trying to delete a non-existent task", async () => {
    const response = await request(app)
      .delete(`/tasks/${taskId}`)
      .set("Authorization", `Bearer ${authToken}`)      
  
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Task not found");
  });
  
  // team-members tests

  it("should be able to create a new relationship", async () => {
    const response = await request(app)
     .post("/team-members")
     .set("Authorization", `Bearer ${authToken}`)
     .send({
        teamName: "testTeam",
        userName: "johw",
      });
    relationshipId = await response.body.id
    expect(response.status).toBe(201);
  })

  it("should be able to delete a relationship", async () => {
    const response = await request(app)
     .delete(`/team-members/${relationshipId}`)
     .set("Authorization", `Bearer ${authToken}`)    
    expect(response.status).toBe(204);
  })
});
