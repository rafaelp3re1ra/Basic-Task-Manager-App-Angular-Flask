import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-tasks',
  imports: [CommonModule, FormsModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})

export class TasksComponent {
  tasks: Task[] = [];
  newTitle = '';
  newDescription = '';
  editingTask: Task | null = null;
  editTitle = '';
  editDescription = '';
  username = '';

  constructor(private taskService: TaskService, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.loadTasks();
    this.username = this.authService.getUsername() ?? '';
  }

  loadTasks() { 
    this.taskService.getTasks().subscribe(data => {
      this.tasks = data;
    });
  }

  addTask() {
    const title = this.newTitle?.trim();
    if (!title) {
      return;
    }

    const payload = {
      title,
      description: this.newDescription,
      done: false
    };

    this.taskService.createTask(payload).subscribe(() => {
      this.newTitle = '';
      this.newDescription = '';
      this.loadTasks();
    });
  }

  toggleTask(task: Task) {
    const updatedTask: Task = { ...task, done: !task.done };
    this.taskService.updateTask(updatedTask).subscribe(() => {
      task.done = updatedTask.done;
    });
  }

  editTask(task: Task) {
    this.editingTask = task;
    this.editTitle = task.title;
    this.editDescription = task.description || '';
  }

  saveEdit() {
    if (this.editingTask) {
      const title = this.editTitle?.trim();
      if (!title) {
        return;
      }

      const updatedTask: Task = { ...this.editingTask, title, description: this.editDescription };
      this.taskService.updateTask(updatedTask).subscribe(() => {
        this.editingTask = null;
        this.loadTasks();
      });
    }
  }

  cancelEdit() {
    this.editingTask = null;
  }

  deleteTask(id: number){
    this.taskService.deleteTask(id).subscribe(() => {
      this.tasks = this.tasks.filter(t => t.id !== id);
    });
  }

  confirmDelete(id: number, title?: string) {
    const name = title ? ` \"${title}\"` : '';
    const ok = window.confirm(`Delete task${name}? This action cannot be undone.`);
    if (ok) {
      this.deleteTask(id);
    }
  }

  logout() {
    this.authService.logout();
    this.tasks = [];
    this.router.navigate(['/login']);
  }

}
