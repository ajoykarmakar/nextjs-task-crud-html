import { Injectable } from '@nestjs/common';
import { Task } from './task.model';

@Injectable()
export class TaskService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskById(id: string): Task {
    return this.tasks.find((task) => task.id === id);
  }

  createTask(title: string, description: string): Task {
    const newTask: Task = {
      id: new Date().getTime().toString(),
      title,
      description,
      completed: false,
      createDate: new Date(),
      completedDate: new Date(),
    };
    this.tasks.push(newTask);
    return newTask;
  }

  updateTask(id: string, updateData: Partial<Task>): Task {
    const task = this.getTaskById(id);
    if (task) {
      Object.assign(task, updateData);
      if (task.completed && !task.completedDate) {
        task.completedDate = new Date();
      }
    }
    return task;
  }

  deleteTask(id: string): void {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }
}
