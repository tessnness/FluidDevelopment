import { Component, ElementRef, inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { RouterLink, RouterModule } from "@angular/router";
import { CountUpModule } from 'ngx-countup';
import { ProjectsService } from '../../services/projects.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [RouterModule, CountUpModule, CommonModule, FormsModule, RouterLink]
})
export class HomeComponent implements OnInit {

  countOpts = {
    duration: 2,
    useGrouping: false,
  }


  carouselItems = [
    { icon: 'home', title: 'FONDAT ÎN', number: 2004, text: '' },
    { icon: 'map', title: 'PREZENȚI ÎN', number: 9, text: 'ORAȘE' },
    { icon: 'water_pump', title: 'PROIECTE ÎNCHEIATE', number: 70, text: '' },
    { icon: 'engineering', title: 'PROIECTE ÎN DERULARE', number: 6, text: '' },
    { icon: 'diversity_3', title: 'ECHIPĂ DE', number: 96, text: 'ANGAJAȚI' },
    { icon: 'domain', title: 'REȚELE DE', number: 120, text: 'km' },
  ];



  projectService = inject(ProjectsService)
  zone = inject(NgZone)
  projects: any;

  form = { name: '', email: '', message: '' };
  loading = false;
  success = false;
  error = false;

  @ViewChild('carousel', { static: true }) carousel!: ElementRef<HTMLElement>;

  pauseMs = 2400;
  smoothScroll = true;
  desktopItems = 3;
  mobileItems = 2;
  private timerId: number | undefined;
  private paused = false;
  private resizeObs?: ResizeObserver;


  constructor() { }

  ngOnInit() {
    this.getAllProjects()

  }

  getAllProjects() {
    this.projectService.list(undefined, undefined, undefined, undefined, true).subscribe(r => {
      this.projects = r;
    })
  }

  submit() {
    this.success = this.error = false;
    this.loading = true;

    const body = new FormData();
    body.set('name', this.form.name.trim());
    body.set('email', this.form.email.trim());
    body.set('message', this.form.message.trim());

    this.projectService.sendMessage(body).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;
        this.form = { name: '', email: '', message: '' };
      },
      error: () => {
        this.loading = false;
        this.error = true;
      }
    });
  }

  ngAfterViewInit() {
    this.setupResizeObserver();
    this.start();
  }

  ngOnDestroy() {
    this.stop();
    this.resizeObs?.disconnect();
  }

  pauseAutoAdvance() { this.paused = true; }
  resumeAutoAdvance() { this.paused = false; }

  private start() {
    this.stop();
    this.zone.runOutsideAngular(() => {
      this.timerId = window.setInterval(() => this.tick(), this.pauseMs);
    });
  }

  private stop() {
    if (this.timerId) { clearInterval(this.timerId); this.timerId = undefined; }
  }

  private tick() {
    if (this.paused) return;
    const el = this.carousel.nativeElement;
    const { stepPx, atEnd } = this.computeStep(el);

    if (atEnd) {
      el.scrollTo({ left: 0, behavior: 'auto' });
      return;
    }

    el.scrollBy({
      left: stepPx,
      behavior: this.smoothScroll ? 'smooth' : 'auto'
    });
  }

  private computeStep(el: HTMLElement) {
    const items = Array.from(el.querySelectorAll<HTMLElement>('.carousel-item'));
    const first = items[0];
    if (!first) return { stepPx: 0, atEnd: true };

    const rect = first.getBoundingClientRect();
    const styles = getComputedStyle(first);
    const marginL = parseFloat(styles.marginLeft || '0');
    const marginR = parseFloat(styles.marginRight || '0');
    const itemFull = rect.width + marginL + marginR;

    const itemsPerView = el.clientWidth >= 1024 ? this.desktopItems : this.mobileItems;
    const stepPx = itemFull * itemsPerView;

    const maxScrollLeft = el.scrollWidth - el.clientWidth;
    const atEnd = el.scrollLeft >= maxScrollLeft - 2;

    return { stepPx, atEnd };
  }

  private setupResizeObserver() {
    const el = this.carousel.nativeElement;
    this.resizeObs = new ResizeObserver(() => {
      const { stepPx } = this.computeStep(el);
      if (stepPx > 0) {
        const pageIndex = Math.round(el.scrollLeft / stepPx);
        el.scrollTo({ left: pageIndex * stepPx, behavior: 'auto' });
      }
    });
    this.resizeObs.observe(el);
  }

}
