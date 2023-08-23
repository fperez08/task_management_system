import sqlite3 from "sqlite3";
import { isOverDueDate } from "../../utils/date_utils";
class TaskRepository {
  private db: sqlite3.Database;

  constructor(databaseName: string) {
    this.db = new sqlite3.Database(databaseName);
    this.createTable();
  }

  private createTable(): void {
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user TEXT,
        title TEXT,
        description TEXT,
        due_date DATE,
        is_completed INTEGER
      )
    `;
    this.db.run(createTableQuery);
  }

  public getAll(): Promise<Task[]> {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM tasks";
      this.db.all(query, (error: Error, rows: Task[]) => {
        if (error) reject(error);
        resolve(rows);
      });
    });
  }

  public add(task: Task): Promise<number> {
    if (!task.user) task.user = "unassigned";
    const query = `
      INSERT INTO tasks (user, title, description, due_date, is_completed)
      values(?, ?, ?, ?, ?)
    `;
    const values = [
      task.user,
      task.title,
      task.description,
      task.due_date,
      task.is_completed || 0,
    ];
    return new Promise((resolve, reject) => {
      this.db.run(query, values, function (error: Error) {
        if (error) reject(error);
        const id = this?.lastID || 1;
        resolve(id);
      });
    });
  }

  public deleteAll(): void {
    const dropTableQuery = "DELETE FROM tasks";
    this.db.run(dropTableQuery, (err: Error) => {
      if (err) {
        console.error("Error deleting records:", err.message);
      } else {
        console.log("All records deleted successfully!");
      }
      this.db.close();
    });
  }

  public getById(id: number): Promise<Task> {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM tasks WHERE id = ?";
      this.db.get(query, [id], (error: Error, row: Task) => {
        if (error) reject(error);
        resolve(row);
      });
    });
  }

  public getByStatus(status: number): Promise<Task[]> {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM tasks WHERE is_completed = ?";
      this.db.all(query, [status], (error: Error, rows: Task[]) => {
        if (error) reject(error);
        resolve(rows);
      });
    });
  }

  public update(
    id: number,
    columnName: string,
    value: string | Date | number,
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const query = `
      UPDATE tasks
      SET ${columnName} = ?
      WHERE id = ?
      `;
      this.db.run(query, [value, id], (error: Error) => {
        if (error) reject(error);
        resolve(true);
      });
    });
  }

  public async getOverdue(): Promise<Task[]> {
    const tasks = await this.getAll();
    return tasks.filter((task) => isOverDueDate(task.due_date));
  }

  public deleteAllById(id: number): void {
    const dropTableQuery = "DELETE FROM tasks where id = ?";
    this.db.run(dropTableQuery, [id], (err: Error) => {
      if (err) {
        console.error("Error deleting records:", err.message);
      } else {
        console.log("All records deleted successfully!");
      }
    });
  }
}
export default TaskRepository;
