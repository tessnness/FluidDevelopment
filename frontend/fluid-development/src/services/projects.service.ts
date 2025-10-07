import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class ProjectsService {
    private base = environment.apiBase;

    constructor(private http: HttpClient) { }


    list(q: any = null, category: any = null, status: any = null, location: any = null, featured = false) {
        return this.http.get(`${environment.apiBase}/projects?${q ? `&search=${encodeURIComponent(q)}` : ''}${category ? `&${category}` : ``}${status ? `&${status}` : ``}${location ? `&${location}` : ``}${featured ? `?featured=${featured}` : ``}`,);
       
    }

    // list(q: string | null = null, category: string | null = null, status: string | null = null) {
    //     const params: any = {};
    //     if (q) params.q = q;
    //     if (category) params.category = category;
    //     if (status !== null && status !== undefined) params.status = status; // '' disables filter
    //     return this.http.get<any[]>(`${environment.apiBase}/projects`, { params });
    // }


    get(slug: string) {
        return this.http.get(`${this.base}/projects/${slug}`);
    }

}
