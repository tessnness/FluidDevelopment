import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from "@angular/router";
import { CountUpModule } from 'ngx-countup';
import { ProjectsService } from '../../services/projects.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [RouterModule, CountUpModule, CommonModule]
})
export class HomeComponent implements OnInit {

  countOpts = {
    duration: 2,
    useGrouping: false,
  }

  projectService = inject(ProjectsService)
  projects: any;

  constructor() { }

  ngOnInit() {
    this.getAllProjects()

  }

  getAllProjects(){
    this.projectService.list(undefined, undefined, undefined, undefined, true).subscribe(r => {
      this.projects = r;
      console.log(r)
    })
  }



}
