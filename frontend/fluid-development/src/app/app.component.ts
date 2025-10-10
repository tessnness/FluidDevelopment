import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SeoService } from '../services/seo.service';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  template: `<router-outlet></router-outlet>`,
  standalone: true,
})
export class AppComponent {

  constructor(seo: SeoService) { seo.init(); }
}
