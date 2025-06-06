import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, deleteDoc, query, where } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { Producto } from './models/producto.model';
import { ProductoEvento } from './models/productoEvento.model';


@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  private productosRef;
  private productosEventoRef;

  constructor(private firestore: Firestore) {
    this.productosRef = collection(this.firestore, 'productos');
    this.productosEventoRef = collection(this.firestore, 'productoEvento');
  }

  getProductosEvento(idEvento: string): Observable<ProductoEvento[]> {
    const q = query(this.productosEventoRef, where('idEvento', '==', idEvento));
    return collectionData(q, { idField: 'id' }) as Observable<ProductoEvento[]>;
  }

  getProductos(): Observable<Producto[]> {
    return collectionData(this.productosRef, { idField: 'id' }) as Observable<Producto[]>;
  }

  getProductosEventos(idEvento: string): Observable<ProductoEvento[]> {
    const q = query(this.productosRef, where('idEvento', '==', idEvento));
    return collectionData(q, { idField: 'id' }) as Observable<ProductoEvento[]>;
  }

  // Añadir un producto nuevo
  addProducto(producto: Producto): Promise<void> {
    return addDoc(this.productosRef, producto).then(() => {});
  }


  // Añadir un producto al eevento
  addProductoEvento(producto: ProductoEvento): Promise<void> {
    return addDoc(this.productosEventoRef, producto).then((docRef) => {
      return updateDoc(docRef, { id: docRef.id });
    });
  }

  // Actualizar un producto existente
  updateProducto(producto: Producto): Promise<void> {
    if (!producto.id) throw new Error('El producto debe tener un ID para actualizar');
    const productoDoc = doc(this.firestore, `productos/${producto.id}`);
    return updateDoc(productoDoc, {
      nombre: producto.nombre,
      precio: producto.precio
    });
  }

  updateProductoEvento(producto: ProductoEvento): Promise<void> {
    if (!producto.id) throw new Error('El producto debe tener un ID para actualizar');
    const productoDoc = doc(this.firestore, `productoEvento/${producto.id}`);
    return updateDoc(productoDoc, {
      id: producto.id, 
    nombre: producto.nombre,
    precio: producto.precio,
    stock: producto.stock,
    vendidos: producto.vendidos,
    ganancias: producto.ganancias,
    idEvento: producto.idEvento,
    venderMuestra: producto.venderMuestra
    });
  }
  
  // Borrar un producto
  deleteProducto(id: string): Promise<void> {
    const productoDoc = doc(this.firestore, `productos/${id}`);
    return deleteDoc(productoDoc);
  }

  deleteProductoEvento(id: string): Promise<void> {
    const productoDoc = doc(this.firestore, `productoEvento/${id}`);
    return deleteDoc(productoDoc);
  }
  
}
