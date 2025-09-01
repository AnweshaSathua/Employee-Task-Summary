import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent {
  taskForm: FormGroup;
  employeeName: any;
  employeeId: any;

  // 👇 Manage which task is expanded
  expandedTaskIndex: number | null = null;

  // Example project list
  projects: string[] = [
    "Account, Card, Deposit, customer Onboarding",
   "Agent Banking",
    "Corporate Banking (Mobile)",
    "Icust",
    "Internet Banking (Retail & Corporate) ",
    "KIOSK",
    "LOS",
    "Median",
    "Mobile Banking ",
    "SIAS",
    "Teller",
    "Wallet Banking ",
    "Website"

  ];

  teamLeads: string[] = [
    "Sakthivel M",
    "Vidyashree Acharya",
    "Parameswar Parida",
    "Gayathri Ramaraj",
    "Srihari",
    "Abhilash Kar",
    "Kamarthi Siva Kumar",
    "Vankara Pavan Sai Kishore Naidu",
    "Abhishek Thakur",
    "Srinivasan T",
    "Senthil Selvaraj"

  ];

  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      tasks: this.fb.array([this.createTask()])
    });
  }

  get tasks(): FormArray {
    return this.taskForm.get('tasks') as FormArray;
  }

  private createTask(): FormGroup {
    return this.fb.group({
      date: ['', Validators.required],
      project: ['', Validators.required],
      teamLead: ['', Validators.required],
      taskTitle: ['', Validators.required],
      description: ['', Validators.required],
      reference: [null],
      prLink: [''],   // ✅ added PR field
      status: ['', Validators.required],
      hours: ['', Validators.required],
      extraHours: ['']
    });
  }

  // 👇 Toggle expand/collapse
  toggleTask(index: number): void {
    this.expandedTaskIndex = this.expandedTaskIndex === index ? null : index;
  }

  addTask(): void {
    this.tasks.push(this.createTask());
  }

  removeTask(i: number): void {
    this.tasks.removeAt(i);
    // collapse if removed one was expanded
    if (this.expandedTaskIndex === i) {
      this.expandedTaskIndex = null;
    }
  }

  saveTask(): void {
  if (this.taskForm.valid && this.employeeId && this.employeeName) {
    const finalData = {
      employeeId: this.employeeId,
      employeeName: this.employeeName,
      tasks: this.taskForm.value.tasks
    };

    console.log('✅ Final Submitted Data:', finalData);

    // 🔎 Check PR link for each task
    finalData.tasks.forEach((task: { prLink: string; }, i: number) => {
      if (task.prLink && task.prLink.trim() !== '') {
        console.log(`✅ Task ${i + 1}: PR Link added -> ${task.prLink}`);
      } else {
        console.warn(`⚠️ Task ${i + 1}: No PR link provided`);
      }
    });

    alert('✅ Task saved successfully!');
  } else {
    this.taskForm.markAllAsTouched();
    console.warn('⚠️ Form Invalid or Employee Info Missing');
    alert('⚠️ Please fill Employee ID, Employee Name and all required fields before submitting.');
  }
}


  onFileChange(event: any): void {
    const file = event?.target?.files?.[0] ?? null;
    console.log('File selected:', file);
  }
}
