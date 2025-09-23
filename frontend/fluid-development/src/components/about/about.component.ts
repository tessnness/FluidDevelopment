import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  standalone: true,
  imports: [HeaderComponent, ]
})
export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
