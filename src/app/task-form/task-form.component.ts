import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { createEmitAndSemanticDiagnosticsBuilderProgram } from 'typescript';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
 
@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, RouterModule],
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
 
 
  
 
  constructor(private fb: FormBuilder, private http: HttpClient, private activatedRouter: ActivatedRoute, private router: Router) {
    this.taskForm = this.fb.group({
      tasks: this.fb.array([this.createTask()])
    });
 
    // console.log("Query params:", this.router.get);
  }
 
  ngOnInit(): void {
 
  this.activatedRouter.queryParamMap.subscribe(params => {
    const empIdFromUrl = params.get('employeeId');
    const storedEmpId = localStorage.getItem('employeeId');
 
    if (empIdFromUrl) {
      this.employeeId = empIdFromUrl;
      localStorage.setItem('employeeId', empIdFromUrl);
      this.loadEmployeeDetails(empIdFromUrl);
    } else if (storedEmpId) {
      this.employeeId = storedEmpId;
      this.loadEmployeeDetails(storedEmpId);
    } else {
      console.warn('⚠️ No employeeId found in URL or localStorage!');
    }
  });

    this.taskForm = this.fb.group({
    tasks: this.fb.array([this.createTask(true)])
  });
 
 
  }
 
 
  // 🔹 Create a new Task form group
  createTask(isFirst: boolean = false): FormGroup {
  return this.fb.group({
    date: [isFirst ? '' : null, isFirst ? Validators.required : []],
    project: ['', Validators.required],
    teamLead: ['', Validators.required],
    taskTitle: ['', Validators.required],
    description: ['', Validators.required],
    reference: [''],
    prLink: [''],
    status: ['', Validators.required],
    hours: ['', Validators.required],
    extraHours: [''],
    file: [null]   // 🔹 add this so file control exists
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
 
onFileChange(event: any, index?: number): void {
  const file = event.target.files[0];
  if (file && index !== undefined) {
    this.tasks.at(index).get('file')?.setValue(file);
    console.log(`Selected file for task ${index}:`, file);
  } else if (index !== undefined) {
    this.tasks.at(index).get('file')?.setValue(null);
  }
}

  /** Fetch employee details from backend */
  loadEmployeeDetails(employeeId: string): void {
    this.http.get<any>(`https://192.168.0.22:8243/employee/api/${employeeId}`)
      .subscribe({
        next: (res) => {
          this.employeeName = res.employeeName; // backend should return employeeName
       },
        error: (err) => {
          console.error('Error fetching employee details:', err);
        }
      });
  }
saveTask(): void {
  if (this.taskForm.invalid) {
    alert('Please fill all required fields!');
    return;
  }

  const formData = new FormData();

  // Attach tasks as JSON
  formData.append('tasks', JSON.stringify(this.taskForm.value.tasks));

  // Attach files
  this.tasks.controls.forEach((control) => {
    const file = control.get('file')?.value;
    if (file) {
      formData.append('files', file, file.name);
    }
  });

  this.http.post<any>(
    `https://192.168.0.22:8243/employee/api/v1/tasks/submit/${this.employeeId}`,
    formData,
    {
      headers: {
        Authorization: 'd44d4aeb-be2d-4dff-ba36-2526d7e19722'
      }
    }
  ).subscribe({
    next: (res) => {
      console.log('✅ Success:', res);
      alert('Task saved successfully!');

      // 🔹 Reset the form (clear all tasks)
      this.taskForm.reset();
      this.taskForm.setControl('tasks', this.fb.array([this.createTask(true)]));

      // 🔹 Reset expanded index
      this.expandedTaskIndex = 0;

      // 👉 If you still want to refresh the page completely, uncomment:
      // window.location.reload();
    },
    error: (err) => {
      console.error('❌ Error saving task:', err);
    }
  });
}

onExit(): void {
    if (confirm('Are you sure you want to exit?')) {
    localStorage.clear();
    window.location.href = 'https://login-ivory-tau.vercel.app/';
  }
}
  

}












