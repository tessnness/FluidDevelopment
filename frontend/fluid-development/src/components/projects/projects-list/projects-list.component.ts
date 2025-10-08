import { Component, inject, OnInit } from '@angular/core';
import { ProjectsService } from '../../../services/projects.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.css'],
  standalone: true,
  imports: [FormsModule]
})
export class ProjectsListComponent implements OnInit {

  projectService = inject(ProjectsService)
  route = inject(ActivatedRoute)
  router = inject(Router)

  projects: any;
  searchString: string;
  // selectedCategory: string;
  // selectedStatus: string;
  // selectedLocation: string;

  public _selectedCategory: string | undefined;;

  public get selectedCategory() {
    return this._selectedCategory;
  }

  public set selectedCategory(value) {
    this._selectedCategory = value;

    let params = { category: value };
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

    let params = { status: value };
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

    let params = { location: value };
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge',
    });
  }


  
  constructor() { }

  ngOnInit() {
    this.route.queryParams.subscribe(res => {
      // if (res['pageNo']) {
      //   this.sortingPagingCriteria.pageNumber = res["pageNo"] ? parseInt(res["pageNo"]) : 1;
      // }
      // if (res["tagId"]) {
      //   this.tagId = res["tagId"]
      // }
      if (res["search"]) {
        this.searchString = res['search'];

      }
      this._selectedCategory = res['category'];
      this._selectedStatus   = res['status'];
      this._selectedLocation = res['location'];


      this.getAllProjects()


    })

  }
//   list(q: any = null, category: any = null, status: any = null, location: any = null, featured = false) {
//     return this.http.get(`${environment.apiBase}/projects${q ? `?search=${encodeURIComponent(q)}` : ''}${category ? `&${category}` : ``}${status ? `&${status}` : ``}${location ? `&${location}` : ``}${featured ? `?featured=${featured}` : ``}`,);
   
// }

  getAllProjects(){
    this.projectService.list(this.searchString, this.selectedCategory, this.selectedStatus, this.selectedLocation ).subscribe(r => {
      this.projects = r;
      console.log(r)
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
