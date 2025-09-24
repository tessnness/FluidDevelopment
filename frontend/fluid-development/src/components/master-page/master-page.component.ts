import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from '../footer/footer.component';
import { RouterModule } from '@angular/router';


import {Router, NavigationEnd} from '@angular/router';
import {filter, map, startWith} from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';


@Component({
  selector: 'app-master-page',
  templateUrl: './master-page.component.html',
  styleUrls: ['./master-page.component.css'],
  imports: [HeaderComponent, RouterModule, FooterComponent, AsyncPipe]
})
export class MasterPageComponent implements OnInit {

  private router = inject(Router);  // ← defined first

  isHome$ = this.router.events.pipe( // ← now safe to use
    filter((e): e is NavigationEnd => e instanceof NavigationEnd),
    map(e => e.urlAfterRedirects === '/'),
    startWith(this.router.url === '/')
  );


  constructor() { }

  

  ngOnInit() {

    
  }

}
