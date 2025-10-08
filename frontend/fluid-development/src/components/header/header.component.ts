import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [RouterModule,]
})
export class HeaderComponent implements OnInit {

  router = inject(Router)

  @ViewChild('navToggle') navToggle!: ElementRef<HTMLInputElement>;

  ngAfterViewInit() {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        if (this.navToggle?.nativeElement) {
          this.navToggle.nativeElement.checked = false;
        }
      });
  }

  constructor() { }

  ngOnInit() {
  }

}
