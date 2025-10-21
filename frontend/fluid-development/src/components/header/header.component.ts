import { Component, ElementRef, HostListener, inject, OnInit, ViewChild } from '@angular/core';
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

  @ViewChild('menuParent', { static: true }) menuParent!: ElementRef<HTMLElement>;
  @ViewChild('navToggle', { static: true }) navToggle!: ElementRef<HTMLInputElement>;
  @ViewChild('hamburgerLabel', { static: true }) hamburgerLabel!: ElementRef<HTMLElement>;


  ngAfterViewInit() {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        if (this.navToggle?.nativeElement) {
          this.navToggle.nativeElement.checked = false;
        }
      });
  }

  @HostListener('document:click', ['$event'])
  @HostListener('document:touchstart', ['$event'])
  handleDocClick(e: Event) {
    const target = e.target as Node;
    const menu = this.menuParent.nativeElement;
    const toggle = this.navToggle.nativeElement;
    const label = this.hamburgerLabel.nativeElement;

    const clickedInsideMenu = menu.contains(target);
    const clickedToggleOrLabel = toggle.contains(target) || label.contains(target);

    if (!clickedInsideMenu && !clickedToggleOrLabel) {
      toggle.checked = false;
    }
  }

  @HostListener('document:keydown.escape')
  closeOnEsc() { this.navToggle.nativeElement.checked = false; }

  constructor() { }

  ngOnInit() {
  }



}
