import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule, Menubar } from 'primeng/menubar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [Menubar]
})
export class HomeComponent implements OnInit {

  items: MenuItem[] | undefined
  constructor() { }

  ngOnInit() {
    this.items = [
      {
        label: 'Acasă'
      },
      {
        label: 'Despre'
      },
      {
        label: 'Proiecte',
        items: [
          {
            label: 'În desfaşurare',
            icon: 'pi pi-clock'
          },
          {
            label: 'Încheiate',
            icon: 'pi pi-check'
          }
        ]
      },
      {
        label: 'Contact'
      }

    ]
  }

}
