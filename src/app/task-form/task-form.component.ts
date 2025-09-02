import { Component, OnInit } from '@angular/core';   // 👈 import OnInit
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
 
@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {   // 👈 implement OnInit
  taskForm: FormGroup;
  employeeName: any;
  employeeId: any;
 
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
 
  ]
 
  private apiUrl = 'http://localhost:8084/api/v1/tasks/submit/TEST011';
 
  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.taskForm = this.fb.group({
      tasks: this.fb.array([this.createTask()])
    });
  }
 
  // ✅ Lifecycle hook runs when component loads
  ngOnInit(): void {
    this.loadEmployeeDetails("TEST011");   // 👈 replace with logged-in empId dynamically later
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
      prLink: [''],
      status: ['', Validators.required],
      hours: ['', Validators.required],
      extraHours: ['']
    });
  }
 
  toggleTask(index: number): void {
    this.expandedTaskIndex = this.expandedTaskIndex === index ? null : index;
  }
 
  addTask(): void {
    this.tasks.push(this.createTask());
  }
 
  removeTask(i: number): void {
    this.tasks.removeAt(i);
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
 
      this.http.post(this.apiUrl, finalData).subscribe({
        next: (response) => {
          console.log('✅ Data saved on backend:', response);
          alert('✅ Task saved successfully!');
        },
        error: (error) => {
          console.error('❌ Error while saving:', error);
          alert('❌ Failed to save task. Please try again.');
        }
      });
    } else {
      this.taskForm.markAllAsTouched();
      alert('⚠️ Please fill Employee ID, Employee Name and all required fields before submitting.');
    }
  }
 
  onFileChange(event: any): void {
    const file = event?.target?.files?.[0] ?? null;
    console.log('File selected:', file);
  }
 
  // ✅ New method to fetch employee details
  loadEmployeeDetails(empId: string): void {
    this.http.get<any>(`http://localhost:8084/api/v1/employees/${empId}`).subscribe({
      next: (data) => {
        console.log("✅ Employee data:", data);
        this.employeeId = data.employeeId;
        this.employeeName = data.employeeName;
      },
      error: (err) => {
        console.error("❌ Failed to fetch employee details", err);
        alert("Employee not found!");
      }
    });
  }
}
 
