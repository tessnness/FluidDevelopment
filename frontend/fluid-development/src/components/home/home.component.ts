import { Component, OnInit } from '@angular/core';
import { MenubarModule, Menubar } from 'primeng/menubar';
import { RouterModule } from "@angular/router";
import { CountUpModule } from 'ngx-countup';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';




@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [RouterModule, CountUpModule, FloatLabel, InputTextModule, FormsModule]
})
export class HomeComponent implements OnInit {

  openProjects: boolean | undefined;
  countOpts = {
    duration: 2,
    useGrouping: false,
  }

  value1: string | undefined;
  value2: string | undefined;
  value3: string | undefined;

  // target = 2000

  // replay(){
  //   this.target = 0;
  //   setTimeout(() => {
  //     this.target = 2000
  //   }, 0)
  // }

  constructor() { }

  ngOnInit() {

  }



}
