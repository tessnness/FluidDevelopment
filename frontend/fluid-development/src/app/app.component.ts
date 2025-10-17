import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SeoService } from '../services/seo.service';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet,],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
})
export class AppComponent {

  private destroy$ = new Subject<void>();

  constructor(
    seo: SeoService,
  ) {
    seo.init();

  }

    ngOnInit(): void {

  }



}
