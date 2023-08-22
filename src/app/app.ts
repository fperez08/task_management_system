import { group, text, select, confirm } from "@clack/prompts";
import TaskService from "./services/task_service";
import TaskRepository from "./database/repositories/task_repository";
import { formatDate } from "./utils/date_utils";

class App {
  private service: TaskService;
  constructor() {
    this.service = new TaskService(
      new TaskRepository("task_manager_system.db"),
    );
  }

  public async addTask() {
    const taskData = await group({
      title: () => text({ message: "Title for your task:" }),
      user: () => text({ message: "Assing to:" }),
      description: () => text({ message: "Description:" }),
      due_date: () => text({ message: "Deadline:" }),
    });
    await this.service.addTask({
      title: taskData.title,
      user: taskData.user,
      description: taskData.description,
      due_date: new Date(taskData.due_date),
    });
  }

  public async showAllTasks() {
    const tasks = await this.service.getAllTasks();
    this.showTasks(tasks);
  }

  public async findATask() {
    const menuOption = await select({
      message: "Select the method to search 🕵🏻‍♂️ your task 🗒️:",
      options: [
        { value: "id", label: "Search by Id 🔑" },
        { value: "status", label: "Search by completion status ✅" },
        { value: "overdue", label: "Search Overdue tasks 😟" },
      ],
    });
    switch (menuOption) {
      case "id": {
        const task = await this.searchTaskById();
        this.showTasks([task]);
        break;
      }
      case "status": {
        const statusOption = await select({
          message: "Select the status:",
          options: [
            { value: 1, label: "Completed ✅" },
            { value: 0, label: "Not completed ❌" },
          ],
        });
        const tasks = await this.service.getTaskByStatus(
          statusOption as number,
        );
        this.showTasks(tasks);
        break;
      }
      case "overdue": {
        const tasks = await this.service.getOverdueTasks();
        this.showTasks(tasks);
        break;
      }
      default:
        console.log("❌ Option not valid try again");
        break;
    }
  }

  public async updateTask() {
    const task = await this.searchTaskById();
    const menuOption = await select({
      message: "Select the field do you want to update:",
      options: [
        { value: "title", label: "Title" },
        { value: "user", label: "User" },
        { value: "description", label: "Description" },
        { value: "due_date", label: "Due Data" },
        { value: "is_completed", label: "Completion status" },
      ],
    });
    switch (menuOption) {
      case "title": {
        task[menuOption] = (await text({
          message: "Type the new title",
          placeholder: task[menuOption],
        })) as string;
        await this.service.updateTask(
          task.id as number,
          "title",
          task[menuOption],
        );
        break;
      }
      case "user": {
        task[menuOption] = (await text({
          message: "Type the new user",
          placeholder: task[menuOption],
        })) as string;
        await this.service.updateTask(
          task.id as number,
          "user",
          task[menuOption] as string,
        );
        break;
      }
      case "description": {
        task[menuOption] = (await text({
          message: "Type the new description",
          placeholder: task[menuOption],
        })) as string;
        await this.service.updateTask(
          task.id as number,
          "description",
          task[menuOption],
        );
        break;
      }
      case "due_date": {
        const rawDate = (await text({
          message: "Type the new date",
          placeholder: formatDate(task[menuOption]),
        })) as string;
        task[menuOption] = new Date(rawDate);
        await this.service.updateTask(
          task.id as number,
          "due_date",
          task[menuOption],
        );
        break;
      }

      case "is_completed": {
        if (task[menuOption] === 0) {
          const result = await confirm({
            message: "Do you want to mark this task as Completed",
          });
          task[menuOption] = result ? 1 : 0;
        } else {
          const result = await confirm({
            message: "Do you want to mark this task as Not Completed",
          });
          task[menuOption] = result ? 0 : 1;
        }
        await this.service.updateTask(
          task.id as number,
          "is_completed",
          task[menuOption] as number,
        );
        break;
      }
      default:
        console.log("❌ Option not valid try again");
        break;
    }
    console.log("Task updated succesfully ✅");
  }

  private showTasks(tasks: Task[]) {
    if (tasks.length === 0) {
      console.log("😕 Tasks not found");
      return;
    }
    const formatedTasks = tasks.map((t) => ({
      Id: t.id,
      Title: t.title,
      User: t.user,
      Description: t.description,
      "Due Date": formatDate(t.due_date),
      Completed: t.is_completed === 1,
    }));
    console.table(formatedTasks);
  }

  private async searchTaskById(): Promise<Task> {
    const strId = await text({
      message: "Enter the task id",
      placeholder: "1234",
    });
    const task = await this.service.getTask(parseInt(strId.toString()));
    if (!task) {
      console.log(`😕 Task not found with the Id: ${strId.toString()}`);
      return task;
    }
    return task;
  }
}

export default new App();
