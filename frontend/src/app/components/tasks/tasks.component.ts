import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
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

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() { 
    this.taskService.getTasks().subscribe(data => {
      this.tasks = data;
    });
  }

addTask() {
    const payload = {
      title: this.newTitle,
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

  deleteTask(id: number){
    this.taskService.deleteTask(id).subscribe(() => {
      this.tasks = this.tasks.filter(t => t.id !== id);
    });
  }

}
