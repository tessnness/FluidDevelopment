import { Routes } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { AboutComponent } from '../components/about/about.component';
import { ContactComponent } from '../components/contact/contact.component';
import { ProjectsListComponent } from '../components/projects/projects-list/projects-list.component';
import { ProjectsDetailsComponent } from '../components/projects/projects-details/projects-details.component';
import { MasterPageComponent } from '../components/master-page/master-page.component';
import { GdprPageComponent } from '../components/pages/gdpr-page/gdpr-page.component';
import { TermsPageComponent } from '../components/pages/terms-page/terms-page.component';
import { CookiePolicyComponent } from '../components/pages/cookie-policy/cookie-policy.component';

export const routes: Routes = [
    {
        path: '', component: MasterPageComponent,
        children: [
            { path: '', component: HomeComponent },
            { path: 'about', component: AboutComponent },
            { path: 'contact', component: ContactComponent },
            { path: 'projects', component: ProjectsListComponent },
            { path: 'projects/:slug', component: ProjectsDetailsComponent },
            { path: 'gdpr', component: GdprPageComponent },
            { path: 'terms', component: TermsPageComponent },
            { path: 'cookies', component: CookiePolicyComponent }
        ]
    }
];
