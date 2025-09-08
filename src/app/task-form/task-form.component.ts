import { Component, OnInit } from '@angular/core';
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
export class TaskFormComponent implements OnInit {
  taskForm: FormGroup;
  employeeName: string | null = null;
  employeeId: string | null = null;

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

  // ✅ API Endpoints
  private taskApiUrl = 'http://localhost:8080/api/v1/tasks/submit';
  private employeeApiUrl = 'http://localhost:8080/api/v1/employees';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.taskForm = this.fb.group({
      tasks: this.fb.array([this.createTask()])
    });
  }

  ngOnInit(): void {
    // ✅ Employee ID comes from login/session/localStorage
    this.employeeId = localStorage.getItem('employeeId'); // 👈 stored during login
    if (this.employeeId) {
      this.loadEmployeeDetails(this.employeeId);
    }
  }

  // 🔹 FormArray getter
  get tasks(): FormArray {
    return this.taskForm.get('tasks') as FormArray;
  }

  // 🔹 Create a new Task form group
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

  // 🔹 Expand/collapse toggle
  toggleTask(index: number): void {
    this.expandedTaskIndex = this.expandedTaskIndex === index ? null : index;
  }

  // 🔹 Add task row
  addTask(): void {
    this.tasks.push(this.createTask());
  }

  // 🔹 Remove task row
  removeTask(i: number): void {
    this.tasks.removeAt(i);
    if (this.expandedTaskIndex === i) {
      this.expandedTaskIndex = null;
    }
  }

  // 🔹 Save task to backend
  saveTask(): void {
    if (this.taskForm.valid && this.employeeId && this.employeeName) {
      const finalData = {
        employeeId: this.employeeId,
        employeeName: this.employeeName,
        tasks: this.taskForm.value.tasks
      };

      this.http.post(`${this.taskApiUrl}/${this.employeeId}`, finalData).subscribe({
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
      alert('⚠️ Please check your Employee ID and all required fields.');
    }
  }

  // 🔹 Fetch employee details by ID
  private loadEmployeeDetails(employeeId: string): void {
    this.http.get<any>(`${this.employeeApiUrl}/${employeeId}`).subscribe({
      next: (employee) => {
        // 👇 map this to your backend response keys
        this.employeeName = employee.employeeName || employee.name;
        console.log('✅ Employee details loaded:', employee);
      },
      error: (err) => {
        console.error('❌ Failed to load employee details:', err);
      }
    });
  }

  // 🔹 File upload handler
  onFileChange(event: any): void {
    const file = event?.target?.files?.[0] ?? null;
    console.log('File selected:', file);
  }
}
