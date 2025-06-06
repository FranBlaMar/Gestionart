import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, deleteDoc, docData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Evento } from './models/evento.model';


@Injectable({
  providedIn: 'root'
})
export class EventosService {
  private eventosRef;

  constructor(private firestore: Firestore) {
    this.eventosRef = collection(this.firestore, 'eventos');
  }

  getEventos(): Observable<Evento[]> {
    return collectionData(this.eventosRef, { idField: 'id' }) as Observable<Evento[]>;
  }

  getEvento(idEvento: string): Observable<Evento> {
    const eventoDocRef = doc(this.firestore, 'eventos', idEvento);
    return docData(eventoDocRef, { idField: 'id' }) as Observable<Evento>;
  }

  // Añadir un evento nuevo
  addEvento(evento: Evento): Promise<void> {
    return addDoc(this.eventosRef, evento).then(() => {});
  }

  // Método para borrar evento por id
  borrarEvento(idEvento: string): Promise<void> {
    const eventoDocRef = doc(this.firestore, `eventos/${idEvento}`);
    return deleteDoc(eventoDocRef);
  }

}
