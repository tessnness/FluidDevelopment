import { DOCUMENT } from '@angular/common';
import { Inject, inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { NavigationEnd } from '@angular/router';
import { Router } from 'express';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private renderer: Renderer2;

  router = inject(Router)
  title = inject(Title)
  meta = inject(Meta)
  rendererFactory = inject(RendererFactory2)


  constructor(
    @Inject(DOCUMENT) private doc: Document
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null)
  }

  init() {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      const route = this.getLeaf(this.router.routerStare.root);
      const data = route.snapshot.data || {};

      if (route.snapshot.title) {
        this.title.setTitle(`${route.snapshot.title}`);
      }

      const metas = data['meta'] as Array<Record<string, string>> | undefined;
      if (metas?.length) {
        metas.forEach(tag => {
          if ('name' in tag)
            this.meta.updateTag(tag, `name='${(tag as any).name}'`);
          else if ('property' in tag)
            this.meta.updateTag(tag, `property='${(tag as any).property}'`)
          else
            this.meta.addTag(tag);
        })
      }

      this.setCanonical(data['canonical']);
    })
  }

  private getLeaf(route: any) {
    while (route.firstChild) route = route.firstChild;
    return route;
  }

  private setCanonical(url?: string) {
    if (!url)
      return;
    let link: HTMLLinkElement | null = this.doc.querySelector(`link[rel='canonical']`);
    if (!link) {
      link = this.renderer.createElement('link');
      this.renderer.setAttribute(link, 'rel', 'canonical');
      this.renderer.appendChild(this.doc.head, link);
    }
    this.renderer.setAttribute(link, 'href', url);
  }
}

