import TaskRepository from "../src/app/database/repositories/task_repository";
import TaskService from "../src/app/services/task_service";
import { expect } from "chai";
import fc from "fast-check";
import { faker } from "@faker-js/faker";
import { isOverDueDate } from "../src/app/utils/date_utils";

describe("Task Service Database Operations", function () {
  let repo: TaskRepository;
  let service: TaskService;
  let status: number;
  let id: number;
  let user: string;
  let title: string;
  let description: string;
  let due_date: Date;
  let is_completed: number;
  const databaseName = "test.db";

  before(async function () {
    repo = new TaskRepository(databaseName);
    service = new TaskService(repo);
    const task = {
      title: faker.hacker.verb(),
      description: faker.hacker.ingverb(),
      due_date: new Date(),
      is_completed: faker.helpers.arrayElement([0, 1]),
    };
    user = faker.internet.userName();
    title = faker.hacker.verb();
    description = faker.hacker.ingverb();
    due_date = new Date();
    is_completed = faker.helpers.arrayElement([0, 1]);

    status = task.is_completed;
    id = await service.addTask(task);
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

  it("should be a task with unassiged user", async function () {
    const task = await service.getTask(id);
    expect(task.user).to.equal("unassigned");
  });

  it("should get a task by status", async function () {
    const tasks = await service.getTaskByStatus(status);
    expect(tasks.map((t) => t.is_completed)).to.include(status);
  });

  it("should update task user", async function () {
    const result = await service.updateTask(id, "user", user);
    const updatedTask = await service.getTask(id);

    expect(result).to.equal(true);
    expect(updatedTask.user).to.equal(user);
  });

  it("should update task title", async function () {
    const result = await service.updateTask(id, "title", title);
    const updatedTask = await service.getTask(id);

    expect(result).to.equal(true);
    expect(updatedTask.title).to.equal(title);
  });

  it("should update task description", async function () {
    const result = await service.updateTask(id, "description", description);
    const updatedTask = await service.getTask(id);

    expect(result).to.equal(true);
    expect(updatedTask.description).to.equal(description);
  });

  it("should update task due_date", async function () {
    const result = await service.updateTask(id, "due_date", due_date);
    const updatedTask = await service.getTask(id);
    const taskDate = new Date(updatedTask.due_date).toString();

    expect(result).to.equal(true);
    expect(taskDate).to.equal(due_date.toString());
  });

  it("should update task is_completed", async function () {
    const result = await service.updateTask(id, "is_completed", is_completed);
    const updatedTask = await service.getTask(id);

    expect(result).to.equal(true);
    expect(updatedTask.is_completed).to.equal(is_completed);
  });

  it("should retrieve overdue tasks", async function () {
    const task = {
      title: faker.hacker.verb(),
      description: faker.hacker.ingverb(),
      due_date: new Date("2022-05-15"),
      is_completed: faker.helpers.arrayElement([0, 1]),
    };
    await service.addTask(task);
    const tasks = await service.getOverdueTasks();
    expect(isOverDueDate(tasks[0].due_date)).to.be.true;
  });
});
