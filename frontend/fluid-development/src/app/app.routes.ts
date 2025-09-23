import { Routes } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { AboutComponent } from '../components/about/about.component';
import { ContactComponent } from '../components/contact/contact.component';
import { ProjectsListComponent } from '../components/projects/projects-list/projects-list.component';
import { ProjectsDetailsComponent } from '../components/projects/projects-details/projects-details.component';
import { MasterPageComponent } from '../components/master-page/master-page.component';

export const routes: Routes = [
    {
        path: '', component: MasterPageComponent,
        children: [
            { path: '', component: HomeComponent },
            { path: 'about', component: AboutComponent },
            { path: 'contact', component: ContactComponent },
            { path: 'projects', component: ProjectsListComponent },
            { path: 'projects/:slug', component: ProjectsDetailsComponent }
        ]
    }
];
