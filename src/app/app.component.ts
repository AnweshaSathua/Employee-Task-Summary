// app.component.ts
import { Component } from '@angular/core';
import { TaskFormComponent } from './task-form/task-form.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [CommonModule, TaskFormComponent] // ✅ Include CommonModule too
})
export class AppComponent {}
