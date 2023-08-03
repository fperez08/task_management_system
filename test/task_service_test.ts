import TaskRepository from "../src/app/database/repositories/task_repository";
import TaskService from "../src/app/services/task_service";
import { faker } from "@faker-js/faker";
const fs = require("fs");

describe("Task service Database Operations", () => {
  let repo: TaskRepository;
  let service: TaskService;

  before(() => {
    repo = new TaskRepository("test.db");
    service = new TaskService(repo);
  });

  after(() => {
    fs.unlink("test.db", (err: any) => {
      if (err) {
        console.error("Error deleting the file:", err);
      } else {
        console.log("File deleted successfully!");
      }
    });
  });

  it("should add a task", () => {
    service.addTask({
      title: faker.hacker.verb(),
      description: faker.hacker.ingverb(),
      due_date: new Date(),
    });
  });
});
