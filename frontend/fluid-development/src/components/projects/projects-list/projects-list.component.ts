import { Component, inject, OnInit } from '@angular/core';
import { ProjectsService } from '../../../services/projects.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from "@angular/router";

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.css'],
  standalone: true,
  imports: [FormsModule, RouterLink, RouterModule]
})
export class ProjectsListComponent implements OnInit {

  projectService = inject(ProjectsService)
  route = inject(ActivatedRoute)
  router = inject(Router)

  projects: any[] = [];
  allProjects: any[] = [];
  categories: string[] = [];
  locations: string[] = [];

  searchString: string;

  private el?: HTMLScriptElement;

  public _selectedCategory: string | undefined;;

  public get selectedCategory() {
    return this._selectedCategory;
  }

  public set selectedCategory(value) {
    this._selectedCategory = value;

    let params = { category: value ?? null };
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge',
    });
  }

  public _selectedStatus: string | undefined;;

  public get selectedStatus() {
    return this._selectedStatus;
  }

  public set selectedStatus(value) {
    this._selectedStatus = value;

    let params = { status: value ?? null };
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge',
    });
  }

  public _selectedLocation: string | undefined;;

  public get selectedLocation() {
    return this._selectedLocation;
  }

  public set selectedLocation(value) {
    this._selectedLocation = value;

    let params = { location: value ?? null };
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge',
    });
  }



  constructor() { }

  ngOnInit() {

    if (typeof document === 'undefined') return;

    const data = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Acasă", "item": "https://www.fluiddevelopment.ro/" },
        { "@type": "ListItem", "position": 2, "name": "Proiecte", "item": "https://www.fluiddevelopment.ro/projects" }
      ]
    };

    document.head.querySelectorAll('script[type="application/ld+json"][data-name="projects-breadcrumb"]')
      .forEach(s => s.remove());

    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.setAttribute('data-name', 'projects-breadcrumb');
    s.text = JSON.stringify(data);
    document.head.appendChild(s);
    this.el = s;

    this.projectService.list(undefined, undefined, undefined, undefined).subscribe(all => {
      this.allProjects = all;
      this.categories = [...new Set(all.map(p => p.category).filter(Boolean))].sort();
      this.locations = [...new Set(all.map(p => p.location).filter(Boolean))].sort();

      this.getAllProjects();
    });

    this.route.queryParams.subscribe(res => {
      this.searchString = res['search'] ?? undefined
      this._selectedCategory = res['category'] ?? undefined;
      this._selectedStatus = res['status'] ?? undefined;
      this._selectedLocation = res['location'] ?? undefined;

      if (this.allProjects.length) {
        this.getAllProjects();
      }


    })

  }

  ngOnDestroy() {
    if (typeof document === 'undefined') return;
    this.el?.remove();
  }

  getAllProjects() {
    this.projectService.list(this.searchString, this.selectedCategory, this.selectedStatus, this.selectedLocation).subscribe(r => {
      this.projects = r;
    })
  }


  searchNow() {
    let params = { search: this.searchString, pageNo: 1 };
    this.router.navigate([],
      {
        relativeTo: this.route,
        queryParams: params,
        queryParamsHandling: 'merge'
      });
  }

}
