import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProjectsService } from '../../services/projects.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  standalone: true,
  imports: [FormsModule]
})
export class ContactComponent implements OnInit {

  projectService = inject(ProjectsService)

  form = { name: '', email: '', message: '' };
  loading = false;
  success = false;
  error = false;
  email = 'office@fluiddevelopment.ro';


  constructor() { }

  ngOnInit() {
  }

  submit() {
    this.success = this.error = false;
    this.loading = true;

    const body = new FormData();
    body.set('name', this.form.name.trim());
    body.set('email', this.form.email.trim());
    body.set('message', this.form.message.trim());

    this.projectService.sendMessage(body).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;
        this.form = { name: '', email: '', message: '' };
      },
      error: () => {
        this.loading = false;
        this.error = true;
      }
    });
  }

}
