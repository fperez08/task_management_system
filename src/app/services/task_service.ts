import TaskRepository from "../database/repositories/task_repository";

class TaskService {
  private repo: TaskRepository;
  constructor(taskRepo: TaskRepository) {
    this.repo = taskRepo;
  }

  public getAllTasks(): Promise<Task[]> {
    return this.repo.getAll();
  }

  public addTask(task: Task): Promise<number> {
    return this.repo.add(task);
  }
}

export default TaskService;
