import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from '../enviroments/enviroment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // googleCenter: google.maps.LatLngLiteral = { lat: 40.730610, lng: -73.935242 }; // Coordenadas iniciales de Google Maps

  map!: mapboxgl.Map; // Declaramos el mapa como propiedad
  currentPosition: [number, number] = [0, 0]; // Para almacenar la posición actual

  ngOnInit(): void {
    // Intentar obtener la ubicación del usuario
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        // Obtener latitud y longitud del usuario
        this.currentPosition = [position.coords.longitude, position.coords.latitude];
        
        // Inicializar el mapa de Mapbox en la ubicación del usuario
        this.map = new mapboxgl.Map({
          accessToken: environment.mapboxAccessToken, // Token de Mapbox
          container: 'mapbox', // ID del contenedor
          style: 'mapbox://styles/mapbox/streets-v11', // Estilo del mapa
          center: this.currentPosition, // Centrar el mapa en la ubicación actual
          zoom: 14 // Nivel de zoom
        });

        // Agregar un marcador en la ubicación actual
        new mapboxgl.Marker()
          .setLngLat(this.currentPosition)
          .addTo(this.map);
      }, (error) => {
        console.error('Error al obtener la geolocalización', error);
      });
    } else {
      console.error('Geolocalización no es soportada por este navegador.');
    }
  }
}