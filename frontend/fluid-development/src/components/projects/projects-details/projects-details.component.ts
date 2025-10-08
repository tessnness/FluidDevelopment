import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectsService } from '../../../services/projects.service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-projects-details',
  templateUrl: './projects-details.component.html',
  styleUrls: ['./projects-details.component.css'],
  imports: [RouterLink]
})
export class ProjectsDetailsComponent implements OnInit {

  route = inject(ActivatedRoute)
  projectService = inject(ProjectsService)

  slug: any;
  project: any;

  constructor() { }

  ngOnInit() {

    this.route.paramMap.subscribe(p => {
      this.slug = p.get('slug')
      console.log(p)
      console.log(this.slug)
      this.getDetails();
    });
  }

  getDetails(){
    this.projectService.getDetails(this.slug).subscribe(r => {
      this.project = r
      console.log(r)
    })
  }



}
