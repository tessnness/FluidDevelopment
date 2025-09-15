import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.dev';

@Injectable({ providedIn: 'root' })
export class ProjectsService {
    base = environment.apiBase;

    constructor(private http: HttpClient) { }

    list(params: any = {}) {
        return this.http.get<{ items: any[]; total: number }>(`${this.base}/projects`, { params });
    }

    get(slug: string) {
        return this.http.get<any>(`${this.base}/projects/${slug}`);
    }

}
