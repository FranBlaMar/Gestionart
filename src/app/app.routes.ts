import { Routes } from '@angular/router';
import { EventoComponent } from './eventos/evento.component';

export const routes: Routes = [
  {
    path: 'eventos/:modo',
    loadComponent: () => import('./eventos/evento.component').then(m => m.EventoComponent)
  },
  {
    path: 'eventos/detalle/:idEvento',
    loadComponent: () => import('./eventos/detalle-evento/detalle-evento.component').then(m => m.DetalleEventoComponent)
  },
  {
    path: 'eventos/:idEvento/addProductos',
    loadComponent: () => import('./eventos/detalle-evento/addProductoEvento/add-producto-evento.component').then(m => m.AddProductoEventoComponent)
  },
  {
    path: 'eventos/:idEvento/estadisticas',
    loadComponent: () => import('./eventos/detalle-evento/estadisticas/estadisticas-evento.component').then(m => m.EstadisticasEventoComponent)
  },
  {
    path: 'eventos/editar/:idEvento',
    loadComponent: () => import('./eventos/detalle-evento/detalle-evento.component').then(m => m.DetalleEventoComponent)
  },
  {
    path: '',
    loadComponent: () => import('./inicio/inicio.component').then(m => m.InicioComponent)
  },
  {
    path: 'listaproductos',
    loadComponent: () => import('./productos/productos.component').then(m => m.ProductosComponent)
  }
];
