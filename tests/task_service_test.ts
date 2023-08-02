import TaskRepository from "../src/app/database/repositories/task_repository";
import TaskService from "../src/app/services/task_service";

describe("Task service Database Operations", () => {
  it("should add a task", () => {
    const repo = new TaskRepository("test.db");
    const service = new TaskService(repo);
    service.addTask();
  });
});
