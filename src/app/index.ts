import { intro, outro, select, group, text } from "@clack/prompts";
import TaskService from "./services/task_service";
import TaskRepository from "./database/repositories/task_repository";

async function main() {
  const db = "task_manager_system.db";
  const service = new TaskService(new TaskRepository(db));
  intro(`Welcome to the Task Manager System 🗒️`);
  const menuOption = await select({
    message: "What do you want to do? 😃",
    options: [
      { value: "addTask", label: "Create a task" },
      { value: "getAllTasks", label: "Show all tasks" },
      { value: "findTask", label: "Find a task" },
    ],
  });

  switch (menuOption) {
    case "addTask": {
      const taskData = await group({
        title: () => text({ message: "Title for your task:" }),
        user: () => text({ message: "Assing to:" }),
        description: () => text({ message: "Description:" }),
        due_date: () => text({ message: "Deadline:" }),
      });
      await service.addTask({
        title: taskData.title,
        user: taskData.user,
        description: taskData.description,
        due_date: new Date(taskData.due_date),
      });
      break;
    }
    case "getAllTasks": {
      const tasks = await service.getAllTasks();
      console.table(tasks);
      break;
    }
    default:
      outro(`Good bye! 👋🏻`);
      process.exit(0);
      break;
  }
  outro(`Good bye! 👋🏻`);
}

main();
