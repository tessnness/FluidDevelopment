import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class ProjectsService {
    private base = environment.apiBase;

    constructor(private http: HttpClient) { }


    list(search?: string, category?: string, status?: string, location?: string, featured?: boolean) {
        const param = new URLSearchParams();
        if (search?.trim()) param.set('q', search.trim());
        if (category) param.set('category', category);
        if (status) param.set('status', status);
        if (location) param.set('location', location);
        if (featured) param.set('featured', 'true');
        return this.http.get<any[]>(`${environment.apiBase}/projects${param.toString() ? `?${param}` : ''}`);
    }


    getDetails(slug: string) {
        return this.http.get(`${this.base}/projects/${slug}`);
    }

}
