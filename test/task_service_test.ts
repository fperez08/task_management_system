import TaskRepository from "../src/app/database/repositories/task_repository";
import TaskService from "../src/app/services/task_service";
import { expect } from "chai";
import fc from "fast-check";

describe("Task service Database Operations", function () {
  let repo: TaskRepository;
  let service: TaskService;
  const databaseName = "task_manager_system.db";
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
        is_completed: fc.constantFrom(0,1)
      }),
      async (task) => {
        const id = await service.addTask(task);
        const savedTask = await service.getTask(id);
        expect(savedTask.title).to.be.equal(task.title);
      },
    );
    await fc.assert(property);
  });
});
