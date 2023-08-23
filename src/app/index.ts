import { intro, outro, select } from "@clack/prompts";
import app from "./app";

async function main() {
  intro(`Welcome to the Task Manager System 🗒️`);
  let menuOption = await select({
    message: "What do you want to do? 😃",
    options: [
      { value: "addTask", label: "Create a task ➕" },
      { value: "showAllTasks", label: "Show all tasks 🗒️" },
      { value: "findTask", label: "Find a task 🔎" },
      { value: "updateTask", label: "Edit a task 📝" },
      { value: "deleteTask", label: "Delete a task 🗑️" },
      { value: "exit", label: "Exit ❌" },
    ],
  });
  while (menuOption !== "exit") {
    switch (menuOption) {
      case "addTask":
        await app.addTask();
        break;
      case "showAllTasks":
        await app.showAllTasks();
        break;
      case "findTask":
        await app.findATask();
        break;
      case "updateTask":
        await app.updateTask();
        break;
      case "deleteTask":
        await app.deleteTask();
        break;
      default:
        outro(`Good bye! 👋🏻`);
        process.exit(0);
        break;
    }

    menuOption = await select({
      message: "What do you want to do? 😃",
      options: [
        { value: "addTask", label: "Create a task ➕" },
        { value: "showAllTasks", label: "Show all tasks 🗒️" },
        { value: "findTask", label: "Find a task 🔎" },
        { value: "updateTask", label: "Edit a task 📝" },
        { value: "exit", label: "Exit ❌" },
      ],
    });
  }

  outro(`Good bye! 👋🏻`);
}

main();
