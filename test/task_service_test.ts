import TaskRepository from "../src/app/database/repositories/task_repository";
import TaskService from "../src/app/services/task_service";
import { faker } from "@faker-js/faker";
import { expect } from "chai";
const fs = require("fs");

describe("Task service Database Operations", () => {
  let repo: TaskRepository;
  let service: TaskService;
  const databaseName = "test.db"
  before(() => {
    repo = new TaskRepository(databaseName);
    service = new TaskService(repo);
  });

  after(() => {
    service.deleteAllTasks();
  })

  it("should add a task", async () => {
    const task = {
      title: faker.hacker.verb(),
      description: faker.hacker.ingverb(),
      due_date: new Date(),
    };
    await service.addTask(task);
    const tasks = await service.getAllTasks();
    expect(tasks[0].title).to.be.equal(task.title);
  });
});
