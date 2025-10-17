import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from "@angular/router";
import { CountUpModule } from 'ngx-countup';
import { ProjectsService } from '../../services/projects.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [RouterModule, CountUpModule, CommonModule, FormsModule]
})
export class HomeComponent implements OnInit {

  countOpts = {
    duration: 2,
    useGrouping: false,
  }

  carouselItems = [
    { icon: 'home', title: 'FONDAT ÎN', number: 2004, text: '' },
    { icon: 'map', title: 'PREZENȚI ÎN', number: 9, text: 'ORAȘE' },
    { icon: 'water_pump', title: 'PROIECTE ÎNCHEIATE', number: 70, text: '' },
    { icon: 'engineering', title: 'PROIECTE ÎN DERULARE', number: 6, text: '' },
    { icon: 'diversity_3', title: 'ECHIPĂ DE', number: 96, text: 'ANGAJAȚI' },
    { icon: 'domain', title: 'REȚELE DE', number: 120, text: 'km' },
  ];



  projectService = inject(ProjectsService)
  projects: any;

  form = { name: '', email: '', message: '' };
  loading = false;
  success = false;
  error = false;

  constructor() { }

  ngOnInit() {
    this.getAllProjects()

  }

  getAllProjects() {
    this.projectService.list(undefined, undefined, undefined, undefined, true).subscribe(r => {
      this.projects = r;
      console.log(r)
    })
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
