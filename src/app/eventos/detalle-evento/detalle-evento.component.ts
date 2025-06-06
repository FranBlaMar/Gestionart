// app.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventosService } from '../../services/evento.service';
import { Evento } from '../../services/models/evento.model';
import { Producto } from '../../services/models/producto.model';
import { ProductosService } from '../../services/productos.service';
import { ProductoEvento } from '../../services/models/productoEvento.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { PopupComponent } from '../../pop-up/pop-up.component';
import { MatInputModule } from '@angular/material/input';
@Component({
  selector: 'detalle-evento-component',
  standalone: true,
  imports: [FormsModule, CommonModule, MatDialogModule,
    MatButtonModule,MatInputModule],
  templateUrl: './detalle-evento.component.html',
  styleUrls: ['./detalle-evento.component.css']
})
export class DetalleEventoComponent implements OnInit{
  idEvento:string = '';
  evento!:Evento;
  productosEvento!:ProductoEvento[];
  productosEventoFiltrados!:ProductoEvento[];

  terminoBusqueda: string = '';
  modoEdicion: boolean = false;
  cantidad:number = 1;
  productoVender!: ProductoEvento;

  @ViewChild('confirmacionBorrado') confirmacionBorradoTemplate: any;
  @ViewChild('confirmacionVenta') confirmacionVentaTemplate: any;

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

    const rutaActual = this.router.url;
  const segmentos = this.route.snapshot.url;

  if (segmentos.length >= 2) {
    const tipo = segmentos[1].path; // "detalle" o "edicion"
    const id = segmentos[2]?.path;

    if (tipo === 'detalle') {
      this.modoEdicion = false;
      this.idEvento = id;
    }else{
      this.modoEdicion = true;
    }
    console.log(this.modoEdicion)
  }
  }

  irAInicio() {
    this.router.navigate(['']);
  }
  
  obtenerEvento() {
    this.eventoService.getEvento(this.idEvento).subscribe(evento => {
      this.evento = evento;
      this.obtenerProductos();
    });
  }

  obtenerProductos(){
    this.productosService.getProductosEvento(this.idEvento).subscribe(productos => {
      this.productosEvento = productos;
      console.log(productos)
      this.productosEventoFiltrados = [...this.productosEvento];
    });
  }
  
  filtrarProductos() {
    const texto = this.terminoBusqueda.toLowerCase().trim();
    if (texto === '') {
      this.productosEventoFiltrados = [...this.productosEvento];
    } else {
      this.productosEventoFiltrados = this.productosEvento.filter(producto =>
        producto.nombre.toLowerCase().includes(texto)
      );
    }
  }

  abrirAgregarProducto() {
    
    this.router.navigate([`/eventos/${this.idEvento}/addProductos`]);
  }
  

  abrirModalVender(producto:ProductoEvento){
    this.productoVender = producto;
    this.dialog.open(this.confirmacionVentaTemplate);
  }

  editarProducto(producto: ProductoEvento){
      const dialogRef = this.dialog.open(PopupComponent, {
        data: { producto: producto, modo: "EditarProductoEvento" }
      });
    
      dialogRef.afterClosed().subscribe(result => {
      });
  }


  borrarEvento() {
    this.dialog.open(this.confirmacionBorradoTemplate);
  }

  confirmarVenta(){
    if(this.productoVender.stock < this.cantidad){
      this.snackBar.open('X Stock insuficiente', '', {
        duration: 2500,
        panelClass: ['error-snackbar'],
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    }else if((this.productoVender.stock == this.cantidad) && this.productoVender.venderMuestra){
      this.snackBar.open('✓ También venderas el de muestra', '', {
        duration: 2500,
        panelClass: ['success-snackbar'],
        horizontalPosition: 'center',
        verticalPosition: 'top'
    });
      this.productoVender.stock = this.productoVender.stock - this.cantidad;
      this.productoVender.vendidos = this.productoVender.vendidos + this.cantidad;
      this.productoVender.ganancias = this.productoVender.ganancias + (this.cantidad * this.productoVender.precio);
      this.productosService.updateProductoEvento(this.productoVender);
      this.snackBar.open('✓ Producto vendido', '', {
        duration: 2500,
        panelClass: ['success-snackbar'],
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    }else{
      this.productoVender.stock = this.productoVender.stock - this.cantidad;
      this.productoVender.vendidos = this.productoVender.vendidos + this.cantidad;
      this.productoVender.ganancias = this.productoVender.ganancias + (this.cantidad * this.productoVender.precio);
      this.productosService.updateProductoEvento(this.productoVender);
      this.snackBar.open('✓ Producto vendido', '', {
        duration: 2500,
        panelClass: ['success-snackbar'],
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    }
    this.cantidad = 1;
    this.dialog.closeAll(); 
  }

  verEstadisticas(){
    this.router.navigate([`/eventos/${this.idEvento}/estadisticas`]);
  }

  confirmarBorrado() {
    if (this.evento.id) {
      this.eventoService.borrarEvento(this.evento.id);

      this.snackBar.open('✓ Evento eliminado', '', {
        duration: 2500,
        panelClass: ['success-snackbar'],
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });

      if(this.productosEvento){
        this.productosEvento.forEach((ele)=>{
          if(ele.id){
            this.productosService.deleteProductoEvento(ele.id);
          }
        })
      }
    }
    this.dialog.closeAll(); 
    this.router.navigate(['/eventos/lista']);
  }
}