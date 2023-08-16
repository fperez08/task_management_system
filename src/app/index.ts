import blessed from "blessed";

// Create a screen
const screen = blessed.screen({
  smartCSR: true,
  title: "Task Management System",
});

// Create a box for the welcome message
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const welcomeBox = blessed.box({
  parent: screen,
  top: "center",
  left: "center",
  width: "100%",
  height: 3,
  content: "{center}Welcome to Task Management System!{/center}",
  tags: true,
  style: {
    fg: "white",
    bg: "blue",
  },
});

// Create a list menu
const menuItems = [
  "Add a task",
  "Create a task",
  "View all tasks",
  "Edit a task",
  "Filter a task",
  "Delete a task",
  "Exit the program",
];

const menu = blessed.list({
  parent: screen,
  top: 3 + 1,
  left: "center",
  width: "shrink",
  height: menuItems.length,
  items: menuItems,
  style: {
    fg: "white",
    bg: "black",
    selected: {
      fg: "black",
      bg: "white",
    },
  },
});

// Handle menu selection
menu.on("select", (item, index) => {
  if (index === menuItems.length - 1) {
    screen.destroy();
    process.exit();
  }
  // Handle other menu selections here
});

// Focus the menu
menu.focus();

// Render the screen
screen.render();
