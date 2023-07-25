import TaskRepository from "./database/repositories/task_repository";
import TaskService from "./services/task_service";
async function main() {
  const taskRepo = new TaskRepository();
  const taskService = new TaskService(taskRepo);

  await taskService.addTask({
    title: "create code",
    description: "Weon",
    due_date: new Date(),
  });

  const tasks = await taskService.getAllTasks();
  console.log("🚀 ~ file: index.ts:14 ~ main ~ tasks:", tasks);
}
main();
