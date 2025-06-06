import { Component, AfterViewInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']})
export class AppComponent  {
  private currentRoute = '';

  
  constructor(private router: Router) {
    // Escucha cambios de ruta para lazy loading
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.urlAfterRedirects;
        console.log('Ruta cambiada a:', this.currentRoute);
      });
  }

  getRouteAnimationData() {
    return this.currentRoute;
  }
}
