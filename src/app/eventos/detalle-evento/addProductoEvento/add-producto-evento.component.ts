// app.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventosService } from '../../../services/evento.service';
import { ProductosService } from '../../../services/productos.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ProductoEvento } from '../../../services/models/productoEvento.model';
import { Producto } from '../../../services/models/producto.model';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';

export interface ProductoConSeleccion {
  id?: string ;
  nombre: string;
  precio: number;
  seleccionado: boolean;
  cantidadEvento: number;
  venderMuestra: boolean;
}

@Component({
  selector: 'add-producto-evento-component',
  standalone: true,
  imports: [FormsModule, CommonModule, MatDialogModule,
    MatButtonModule, MatInputModule, MatRadioModule,MatCheckboxModule, MatTableModule ],
  templateUrl: './add-producto-evento.component.html',
  styleUrls: ['./add-producto-evento.component.css']
})
export class AddProductoEventoComponent implements OnInit{
 
  idEvento!: string;
  productosEvento: ProductoEvento[] = [];

  productosListaSeleccion: ProductoConSeleccion[] = [];

  productosLista!: Producto[];

  terminoBusqueda: string = '';


  productosFiltrados: any[] = [];
  
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
    });
    this.getProductos();
  }

  filtrarProductos(): void {
    if (!this.terminoBusqueda || this.terminoBusqueda.trim() === '') {
      this.productosFiltrados = [...this.productosListaSeleccion];
    } else {
      const termino = this.terminoBusqueda.toLowerCase().trim();
      this.productosFiltrados = this.productosListaSeleccion.filter(producto => 
        producto.nombre.toLowerCase().includes(termino)
      );
    }
  }

  // Método para limpiar la búsqueda
  limpiarBusqueda(): void {
    this.terminoBusqueda = '';
    this.filtrarProductos();
  }

  getProductos(){
    this.productosService.getProductos().subscribe(productos => {
      this.productosLista = productos;
      this.productosFiltrados = productos;
      this.inicializarProductos();
    });
  }


  inicializarProductos() {
    this.productosListaSeleccion = this.productosLista.map(producto => ({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      seleccionado: false,
      cantidadEvento: 1,
      venderMuestra: false
    }));
  }

  toggleProducto(producto: ProductoConSeleccion) {
    if (producto.seleccionado) {
      this.agregarProductoEvento(producto);
    } else {
      this.quitarProductoEvento(producto.id);
    }
  }

  agregarProductoEvento(producto: ProductoConSeleccion) {
    const productoEvento: ProductoEvento = {
      nombre: producto.nombre,
      precio: producto.precio,
      stock: producto.cantidadEvento,
      vendidos: 0,
      idEvento: this.idEvento,
      ganancias: 0,
      venderMuestra: producto.venderMuestra,
    };

    const index = this.productosEvento.findIndex(p => p.nombre === producto.nombre);
    if (index >= 0) {
      this.productosEvento[index] = productoEvento;
    } else {
      this.productosEvento.push(productoEvento);
    }
  }

  quitarProductoEvento(productoId?: string ) {
    const productoOriginal = this.productosLista.find(p => p.id === productoId);
    if (productoOriginal) {
      this.productosEvento = this.productosEvento.filter(p => p.nombre !== productoOriginal.nombre);
    }
  }

  // Actualizar producto cuando cambian cantidad o muestra
  actualizarProductoEvento(producto: ProductoConSeleccion) {
    if (producto.seleccionado) {
      this.agregarProductoEvento(producto);
    }
  }

  // Obtener productos seleccionados para enviar al backend
  obtenerProductosEvento(): ProductoEvento[] {
    return this.productosEvento;
  }

  // Limpiar selección
  limpiarSeleccion() {
    this.productosListaSeleccion.forEach(producto => {
      producto.seleccionado = false;
      producto.cantidadEvento = 1;
      producto.venderMuestra = false;
    });
    this.productosEvento = [];
  }

  irAInicio() {
    this.router.navigate(['']);
  }

  guardarProductosEvento() {
    this.productosEvento.forEach((producto)=>{
      this.productosService.addProductoEvento(producto);
    })

    this.snackBar.open('✓ Productos añadidos', '', {
      duration: 2500,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
    this.router.navigate([`eventos/editar/${this.idEvento}`]);

  }
  
  scrollToResumen(): void {
    const elemento = document.getElementById('resumen');
    if (elemento) {
      elemento.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }
  scrollToBusqueda(): void {
    const elemento = document.getElementById('buscador');
    if (elemento) {
      elemento.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  }
  
}