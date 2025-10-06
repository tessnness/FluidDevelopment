import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProjectsService {
    private base = environment.apiBase;

    constructor(private http: HttpClient) { }


    list(q = null, category = null, status = null) {
        return this.http.get(`${this.base}/projects${q ? `&${q}` : ``}${category ? `&${category}` : ``}${status ? `&${status}` : ``}`,);
    }

    get(slug: string) {
        return this.http.get(`${this.base}/projects/${slug}`);
    }

}
