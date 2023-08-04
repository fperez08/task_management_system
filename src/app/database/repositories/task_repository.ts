import sqlite3 from "sqlite3";
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
        title TEXT,
        description TEXT,
        due_date DATE
      )
    `;
    this.db.run(createTableQuery);
  }

  public getAll(): Promise<Task[]> {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM tasks";
      this.db.all(query, (error, rows: Task[]) => {
        if (error) reject(error);
        resolve(rows);
      });
    });
  }

  public add(task: Task): Promise<number> {
    const query = `
      INSERT INTO tasks (title, description, due_date)
      values(?, ?, ?)
    `;
    const values = [task.title, task.description, task.due_date];
    return new Promise((resolve, reject) => {
      this.db.run(query, values, function (error) {
        if (error) reject(error);
        const id = this?.lastID || 1;
        resolve(id);
      });
    });
  }

  public deleteAll():void {
    const dropTableQuery = 'DELETE FROM tasks';
    this.db.run(dropTableQuery, (err) => {
      if (err) {
        console.error('Error deleting records:', err.message);
      } else {
        console.log('All records deleted successfully!');
    }
      this.db.close();
    });
  }

  public getById(id:number): Promise<Task> {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM tasks WHERE id = ?";
      this.db.get(query, [id], (error:Error, row: Task) => {
        if (error) reject(error);
        resolve(row);
      });
    });
  }
}
export default TaskRepository;
