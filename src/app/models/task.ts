// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Task {
  id?: number;
  user?: string;
  title: string;
  description: string;
  due_date: Date | number;
  is_completed: number;
}
