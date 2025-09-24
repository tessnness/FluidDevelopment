import { Component, OnInit } from '@angular/core';
import { MenubarModule, Menubar } from 'primeng/menubar';
import { RouterModule } from "@angular/router";
import { CountUpModule } from 'ngx-countup';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [RouterModule, CountUpModule]
})
export class HomeComponent implements OnInit {

  countOpts = {
    duration: 2,
    useGrouping: false,
  }

  constructor() { }

  ngOnInit() {

  }



}
