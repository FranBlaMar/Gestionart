import { Component, AfterViewInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'inicio-component',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements AfterViewInit {

  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    this.initMobileOptimizations();
    this.initScrollArrow();
    this.initMenuAnimation();
  }

  private initMobileOptimizations(): void {
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (event) => {
      const now = (new Date()).getTime();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    }, false);
  }

  private initScrollArrow(): void {
    const scrollArrow = document.querySelector('.scroll-arrow');
    if (scrollArrow) {
      scrollArrow.addEventListener('click', () => {
        document.querySelector('.menu')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      });
    }
  }

  private initMenuAnimation(): void {
    setTimeout(() => {
      const menu = document.querySelector('.menu') as HTMLElement;
      if (menu) {
        menu.style.opacity = '0';
        menu.style.transform = 'translateY(30px)';
        setTimeout(() => {
          menu.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
          menu.style.opacity = '1';
          menu.style.transform = 'translateY(0)';
        }, 300);
      }
    }, 100);

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches) {
      const elements = document.querySelectorAll('.nube, .cloud, .bird, .sparkle');
      elements.forEach(el => {
        (el as HTMLElement).style.animation = 'none';
      });
    }
  }

  nuevoEvento(): void {
    this.router.navigate(['/eventos/nuevo']);
  }

  listaEventos(): void {
    this.router.navigate(['/eventos/lista']);
  }

  gestionarProductos(): void{
    this.router.navigate(['/listaproductos']);
  }

}
