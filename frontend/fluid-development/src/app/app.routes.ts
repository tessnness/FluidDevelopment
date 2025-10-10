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
            {
                path: '', component: HomeComponent, title: 'Fluid Development - Proiectare și excuție construcții hidroedilitare',
                data: {
                    meta: [
                        { name: 'description', content: 'Proiectare și execuție de rețele, branșamente și construcții hidroedilitare, civile în România.' },
                        { property: 'og:title', content: 'Fluid Development' },
                        { property: 'og:type', content: 'website' }
                    ],
                    canonical: 'https://fluid-development.vercel.app/'
                }
            },
            {
                path: 'about', component: AboutComponent, title: 'Despre noi | Fluid Development',
                data: {
                    meta: [
                        { name: 'description', content: 'Experiență în proiectare și execuție de construcții.' },
                        { property: 'og:title', content: 'Despre Fluid Development' }
                    ],
                    canonical: 'https://fluid-development.vercel.app/about'
                }
            },
            {
                path: 'contact', component: ContactComponent, title: 'Contact | Fluid Development',
                data: {
                    meta: [
                        { name: 'description', content: 'Contactează echipa Fluid Development.' }
                    ],
                    canonical: 'https://fluid-development.vercel.app/contact'
                }
            },
            {
                path: 'projects', component: ProjectsListComponent, title: 'Proiecte | Fluid Development',
                data: {
                    meta: [
                        { name: 'description', content: 'Portofoliu de proiecte și lucrări în desfășurare.' },
                        { property: 'og:title', content: 'Proiecte Fluid Development' }
                    ],
                    canonical: 'https://fluid-development.vercel.app/projects'
                }
            },
            { path: 'projects/:slug', component: ProjectsDetailsComponent },
            {
                path: 'gdpr', component: GdprPageComponent, title: 'GDPR | Fluid Development',
                data: { canonical: 'https://fluid-development.vercel.app/gdpr' }
            },
            {
                path: 'terms', component: TermsPageComponent, title: 'Termeni și Condiții | Fluid Development',
                data: { canonical: 'https://fluid-development.vercel.app/terms' }
            },
            {
                path: 'cookies', component: CookiePolicyComponent, title: 'Politică Cookies | Fluid Development',
                data: { canonical: 'https://fluid-development.vercel.app/cookies' }
            }
        ]
    }
];
