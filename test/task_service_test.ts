import TaskRepository from "../src/app/database/repositories/task_repository";
import TaskService from "../src/app/services/task_service";
import { expect } from "chai";
import fc from "fast-check";
import { faker } from "@faker-js/faker";

describe("Task service Database Operations", function () {
  let repo: TaskRepository;
  let service: TaskService;
  const databaseName = "test.db";
  before(function () {
    repo = new TaskRepository(databaseName);
    service = new TaskService(repo);
  });

  after(function () {
    service.deleteAllTasks();
  });

  it("should add a task", async function () {
    const property = fc.asyncProperty(
      fc.record({
        title: fc.string(),
        description: fc.string(),
        due_date: fc.date(),
        is_completed: fc.constantFrom(0, 1),
      }),
      async (task) => {
        const id = await service.addTask(task);
        const savedTask = await service.getTask(id);
        expect(savedTask.title).to.be.equal(task.title);
      },
    );
    await fc.assert(property);
  });

  it("should get a task by status", async function () {
    const task = {
      title: faker.hacker.verb(),
      description: faker.hacker.ingverb(),
      due_date: new Date(),
      is_completed: faker.helpers.arrayElement([0, 1]),
    };
    const status = task.is_completed;
    await service.addTask(task);
    const tasks = await service.getTaskByStatus(status);
    expect(tasks.map((t) => t.is_completed)).to.include(status);
  });

  it("should update a task", async function () {
    const task = {
      title: faker.hacker.verb(),
      description: faker.hacker.ingverb(),
      due_date: new Date(),
      is_completed: faker.helpers.arrayElement([0, 1]),
    };
    const newTask = {
      title: faker.hacker.verb(),
      description: faker.hacker.ingverb(),
      due_date: new Date(),
      is_completed: faker.helpers.arrayElement([0, 1]),
    };

    const id = await service.addTask(task);
    const result = await service.updateTask(id, newTask);
    const updatedTask = await service.getTask(id);

    expect(result).to.equal(true);
    expect(updatedTask.title).to.equal(newTask.title);
  });
});
