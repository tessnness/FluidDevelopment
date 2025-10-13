import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectsService } from '../../../services/projects.service';
import { RouterLink } from "@angular/router";
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-projects-details',
  templateUrl: './projects-details.component.html',
  styleUrls: ['./projects-details.component.css'],
  imports: [RouterLink]
})
export class ProjectsDetailsComponent implements OnInit {

  route = inject(ActivatedRoute)
  projectService = inject(ProjectsService)
  title = inject(Title)
  meta = inject(Meta)

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

  getDetails() {
    this.projectService.getDetails(this.slug).subscribe(r => {
      this.project = r;
      console.log(r)

      const pageTitle = `${this.project.name} | Proiect | Fluid Development`;
      const desc = (this.project.description || '').slice(0, 155);

      this.title.setTitle(pageTitle);
      this.meta.updateTag({ name: 'description', content: desc }, "name='description'");
      this.meta.updateTag({ property: 'og:title', content: pageTitle }, "property='og:title'");
      this.meta.updateTag({ property: 'og:description', content: desc }, "property='og:description'");
      // this.meta.updateTag({ property: 'og:type', content: 'article' }, "property='og:type'");

      const url = `https://fluid-development.vercel.app/projects/${this.slug}`;
      this.setCanonical(url);

    })
  }

  setCanonical(url: string){
    let link = document.querySelector(`link[rel='canonical']`) as HTMLLinkElement | null;

    if(!link){
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }

    link.setAttribute('href', url);
  }




}
