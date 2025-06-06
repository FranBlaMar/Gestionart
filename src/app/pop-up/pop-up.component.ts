import { Component, AfterViewInit, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Router, RouterOutlet } from '@angular/router';
import { Producto } from '../services/models/producto.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductosService } from '../services/productos.service';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';

import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { ProductoEvento } from '../services/models/productoEvento.model';


@Component({
  selector: 'pop-up-component',
  standalone: true,
  imports: [FormsModule, CommonModule, MatDialogModule,
    MatButtonModule, MatOptionModule, MatFormFieldModule, MatSelectModule, MatInputModule,
    MatTableModule,MatCheckboxModule, MatRadioModule ],
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.css']
})



export class PopupComponent implements OnInit{
  productoEditar!: any;
  modo!: string;


  columnasTabla: string[] = ['seleccionar', 'nombre', 'cantidad', 'muestra'];


  @ViewChild('confirmacionBorrado') confirmacionBorradoTemplate: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  public dialogRef: MatDialogRef<PopupComponent>,
  private productosService: ProductosService,
  public dialog: MatDialog,
  private snackBar: MatSnackBar
) {
  
}


  ngOnInit() {
    this.productoEditar = this.data.producto;
    this.modo = this.data.modo;

    if(this.modo == 'AddProductoLista'){
      this.productoEditar = {
        nombre: "",
        precio: 0
      }
    }else if(this.modo == 'EditarProductoEvento'){
      this.productoEditar = this.data.producto;
    }
  }

 

  guardarProductoEditado(){
    if(this.modo == 'EditarProductoLista'){
    this.productosService.updateProducto(this.productoEditar);
    this.snackBar.open('✓ Producto editado', '', {
      duration: 2500,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }else if(this.modo == 'EditarProductoEvento'){

    this.productosService.updateProductoEvento(this.productoEditar);
    this.snackBar.open('✓ Producto editado', '', {
      duration: 2500,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  
  this.dialogRef.close();
  }

  borrarProducto() {
      this.dialog.open(this.confirmacionBorradoTemplate);
  }

  confirmarBorrado() {
    if(this.modo == 'EditarProductoLista'){
      if (this.productoEditar.id) {
        this.productosService.deleteProducto(this.productoEditar.id);
  
        this.snackBar.open('✓ Producto eliminado', '', {
          duration: 2500,
          panelClass: ['success-snackbar'],
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    }else if(this.modo == 'EditarProductoEvento'){
      if (this.productoEditar.id) {
        this.productosService.deleteProductoEvento(this.productoEditar.id);
  
        this.snackBar.open('✓ Producto eliminado', '', {
          duration: 2500,
          panelClass: ['success-snackbar'],
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    }
    
    this.dialogRef.close(); 
    this.dialog.closeAll(); 
    
  }

  guardarProductoNuevo(){
    this.productosService.addProducto(this.productoEditar);
    this.snackBar.open('✓ Producto añadido', '', {
      duration: 2500,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
    this.dialogRef.close();
  }

  cerrar(){
    this.dialogRef.close();
  }


}
