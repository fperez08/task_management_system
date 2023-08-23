import { faker } from "@faker-js/faker";
import TaskService from "./services/task_service";
import TaskRepository from "./database/repositories/task_repository";

const service = new TaskService(new TaskRepository("task_manager_system.db"));
async function generateData() {
  for (let index = 0; index < 100; index++) {
    const task = {
      user: faker.internet.userName(),
      title: faker.word.verb(),
      description: faker.word.words(),
      due_date: new Date(faker.date.anytime()),
      is_completed: faker.helpers.arrayElement([0, 1]),
    };
    await service.addTask(task);
  }
}

generateData();
