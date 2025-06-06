import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Producto } from '../services/models/producto.model';
import { ProductosService } from '../services/productos.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PopupComponent } from '../pop-up/pop-up.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'productos-component',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  productos: Producto[]= [];
  productosFiltrados:Producto[] = [];
  terminoBusqueda: string = '';
  productoSeleccionado: any = null;
  
  constructor(private productosService: ProductosService,
    private dialog: MatDialog,
    private router: Router
  ){};

  ngOnInit(): void {
    this.getProductos();
  }

  irAInicio() {
    this.router.navigate(['']);
  }
  getProductos(){
    this.productosService.getProductos().subscribe(productos => {
      this.productos = productos;
      this.productosFiltrados = [...this.productos];
      this.productosFiltrados.sort((a, b) =>
        a.nombre.localeCompare(b.nombre, 'es', { 
          sensitivity: 'base',
          numeric: true,
          ignorePunctuation: true
        })
      );
    });
  }
  
  filtrarProductos() {
    const texto = this.terminoBusqueda.toLowerCase().trim();
    
    if (texto === '') {
      this.productosFiltrados = [...this.productos];
    } else {
      this.productosFiltrados = this.productos.filter(producto =>
        producto.nombre.toLowerCase().includes(texto)
      );
    }
    this.productosFiltrados.sort((a, b) =>
      a.nombre.localeCompare(b.nombre, 'es', { 
        sensitivity: 'base',
        numeric: true,
        ignorePunctuation: true
      })
    );
  }
  

  abrirDialogoEditar(producto: any) {
    const dialogRef = this.dialog.open(PopupComponent, {
      data: { producto: producto, modo: "EditarProductoLista" }
    });
  
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  abrirDialogoAdd() {
    const dialogRef = this.dialog.open(PopupComponent, {
      data: { producto: null, modo: "AddProductoLista" }
    });
  
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  
}
