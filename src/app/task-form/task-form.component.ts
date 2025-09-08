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
  employeeName: string = '';
  employeeId: string = '';

  expandedTaskIndex: number | null=0;

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

  

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.taskForm = this.fb.group({
      tasks: this.fb.array([this.createTask()])
    });
  }

  ngOnInit(): void {
    // 1️⃣ Load employeeId from login details (localStorage/sessionStorage)
    const storedId = localStorage.getItem('employeeId');
    if (storedId) {
      this.employeeId = storedId;
      this.loadEmployeeDetails(storedId);
  }

  // 2️⃣ Initialize form
    this.taskForm = this.fb.group({
      tasks: this.fb.array([this.createTask()])
    });
  }


  // 🔹 Create a new Task form group
  createTask(): FormGroup {
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

   /** Getter for tasks form array */
  get tasks(): FormArray {
    return this.taskForm.get('tasks') as FormArray;
  }

  /** Add a new task */
  addTask(): void {
    this.tasks.push(this.createTask());
    this.expandedTaskIndex = this.tasks.length - 1; // expand new task
  }

  /** Remove a task */
  removeTask(index: number): void {
    this.tasks.removeAt(index);
    if (this.expandedTaskIndex === index) {
      this.expandedTaskIndex = null;
    }
  }

  /** Expand/Collapse task */
  toggleTask(index: number): void {
    this.expandedTaskIndex = this.expandedTaskIndex === index ? null : index;
  }

  /** File input change handler */
  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      console.log('Selected file:', file);
      // TODO: implement file upload logic
    }
  }

  /** Fetch employee details from backend */
  loadEmployeeDetails(employeeId: string): void {
    this.http.get<any>(`http://localhost:8080/api/v1/employees/${employeeId}`)
      .subscribe({
        next: (res) => {
          this.employeeName = res.employeeName; // backend should return employeeName
        },
        error: (err) => {
          console.error('Error fetching employee details:', err);
        }
      });
  }

  /** Submit the form */
  saveTask(): void {
    if (this.taskForm.invalid) {
      alert('Please fill all required fields!');
      return;
    }

    const payload = {
      employeeId: this.employeeId,
      employeeName: this.employeeName,
      ...this.taskForm.value
    };

    console.log('Final Payload:', payload);

    this.http.post('http://localhost:8080/api/v1/tasks/submit', payload)
      .subscribe({
        next: () => {
          alert('Task saved successfully!');
        },
        error: (err) => {
          console.error('Error saving task:', err);
        }
      });
  }
}
