// app.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventosService } from '../../../services/evento.service';
import { Evento } from '../../../services/models/evento.model';
import { ProductosService } from '../../../services/productos.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ProductoEvento } from '../../../services/models/productoEvento.model';
@Component({
  selector: 'estadisticas-evento-component',
  standalone: true,
  imports: [FormsModule, CommonModule, MatDialogModule,
    MatButtonModule,MatInputModule],
  templateUrl: './estadisticas-evento.component.html',
  styleUrls: ['./estadisticas-evento.component.css']
})
export class EstadisticasEventoComponent implements OnInit{
  idEvento:string = '';
  evento!:Evento;
  productosEvento: ProductoEvento[] = [];
  filtroBusqueda: string = '';

  
  constructor(
    private eventoService: EventosService,
    private productosService: ProductosService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.idEvento = params.get('idEvento') || '';
      if (this.idEvento) {
        this.obtenerEvento();
      }
    });
  }

  irAInicio() {
    this.router.navigate(['']);
  }

  productosFiltrados() {
    const filtro = this.filtroBusqueda.toLowerCase();
    return this.productosEventoLista.filter(p => p.nombre.toLowerCase().includes(filtro));
  }
  
  obtenerEvento() {
    this.eventoService.getEvento(this.idEvento).subscribe((evento:Evento) => {
      this.evento = evento;
      this.obtenerProductos();
    });
  }

  obtenerProductos(){
    this.productosService.getProductosEvento(this.idEvento).subscribe(productos => {
      this.productosEvento = productos;
    });
  }

  get productosEventoOrdenados() {
    return this.productosEvento
      .filter(producto => producto.vendidos > 0)
      .slice()
      .sort((a, b) => b.ganancias - a.ganancias)
      .slice(0, 5);
  }

  get productosEventoLista() {
    return this.productosEvento
      .sort((a, b) => b.ganancias - a.ganancias)
  }
  
  get maxGanancia() {
    return Math.max(...this.productosEvento.map(p => p.ganancias || 0), 1);
  }
  
  calcularGananciasTotales(): number {
    return this.productosEvento.reduce((acc, prod) => acc + (prod.ganancias || 0), 0);
  }

  volver(){
    this.router.navigate([`eventos/detalle/${this.idEvento}`]);
  }
}