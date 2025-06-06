// app.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventosService } from '../services/evento.service';
import { Evento } from '../services/models/evento.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'evento-component',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './evento.component.html',
  styleUrls: ['./evento.component.css']
})
export class EventoComponent implements OnInit {
  nombreEvento: string = "";
  fechaEvento!: Date;
  modo: string = "";
  eventos: Evento[] = [];
  filtroNombre: string = "";
  eventosFiltrados: Evento[] = [];

  constructor(
    private eventoService: EventosService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }


  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.modo = params.get('modo') || '';
      if (this.modo === 'lista') {
        this.obtenerEventos();
      }
    });
  }
  irAInicio() {
    this.router.navigate(['']);
  }
  comprobarNombre() {
    return !this.nombreEvento || this.nombreEvento.trim() === "";
  }

  obtenerEventos() {
    this.eventoService.getEventos().subscribe(eventos => {
      this.eventos = eventos.sort((a, b) =>
        new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      );
      this.filtrarEventos();
    });
  }

  crearEvento() {
    let evento: Evento = {
      nombre: this.nombreEvento,
      dineroTotal: 0,
      fecha: this.fechaEvento
    };
    this.eventoService.addEvento(evento);
    this.router.navigate(['eventos/lista']);
  }

  filtrarEventos() {
    const texto = this.filtroNombre.toLowerCase().trim();
    if (texto === "") {
      // Volver a mostrar los 5 más recientes si se borra el filtro
      this.eventosFiltrados = this.eventos.slice(0, 5);
    } else {
      this.eventosFiltrados = this.eventos.filter(e =>
        e.nombre.toLowerCase().includes(texto)
      );
    }
  }

  detalleEvento(evento: Evento) {
    console.log(evento)
    this.router.navigate([`eventos/detalle/${evento.id}`]);
  }

  editarEvento(evento: Evento) {
    console.log(evento)
    this.router.navigate([`eventos/editar/${evento.id}`]);
  }
}