import { Component, OnInit } from '@angular/core';
import { CookiePolicyComponent } from '../pages/cookie-policy/cookie-policy.component';
import { GdprPageComponent } from '../pages/gdpr-page/gdpr-page.component';
import { TermsPageComponent } from '../pages/terms-page/terms-page.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  standalone: true,
  imports: [RouterModule]
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
