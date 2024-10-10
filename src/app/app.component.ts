import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from '../environments/environment';
import { ciudades, municipios, parquimetros } from './utils/parkimeters-response';
import { Ciudad, Municipio, Parquimetro } from './utils/interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  map!: mapboxgl.Map; // Declaramos el mapa como propiedad
  currentPosition: [number, number] = [0, 0]; // Para almacenar la posición actual

  selectedMunicipioId: number | null = null; // No seleccionamos ningún municipio al inicio
  selectedCiudadId: number | null = null; // No seleccionamos ninguna ciudad al inicio
  filteredCiudades: Ciudad[] = [];
  isCiudadSelectDisabled: boolean = true; // El select de ciudades está deshabilitado inicialmente


  ciudades_component: Ciudad[] = ciudades;
  municipios_component: Municipio[] = municipios;
  parquimetros_component: Parquimetro[] = parquimetros;

  ngOnInit(): void {
    this.filterCiudades();

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
          zoom: 17 // Nivel de zoom
        });
        console.log(this.currentPosition)
        // Agregar un marcador en la ubicación actual
        this.map.on('load', () => {
          this.userMarker(this.currentPosition); // Marcador 1
          this.parquimetros_component.map(parquimetro => (
            this.addMarker(parquimetro.coordenada, parquimetro.description)
          ))
        });
      }, (error) => {
        console.error('Error al obtener la geolocalización', error);
      });
    } else {
      console.error('Geolocalización no es soportada por este navegador.');
    }
  }

  addMarker(coordinates: [number, number], title: string): void {
    // Crear un nuevo marcador
    const marker = new mapboxgl.Marker()
      .setLngLat(coordinates) // Establecer la ubicación del marcador
      .setPopup(new mapboxgl.Popup().setText(title)) // Agregar un popup con el título
      .addTo(this.map); // Añadir el marcador al mapa
  }

  userMarker(coordinates: [number, number]): void {
    // Crear un marcador personalizado
    const markerElement = document.createElement('div');
    markerElement.className = 'my-marker'; // Clase CSS personalizada
    markerElement.style.backgroundImage = "url('assets/custom_marker.svg')"; // Ruta desde 'assets'
    markerElement.style.width = '50px'; // Ancho del ícono
    markerElement.style.height = '50px'; // Alto del ícono 
    markerElement.style.backgroundSize = 'contain'; // Asegurar que la imagen cubra todo el div
    markerElement.style.backgroundRepeat = 'no-repeat';
    
    // Crear un nuevo marcador
    const marker = new mapboxgl.Marker(markerElement)
      .setLngLat(coordinates) // Establecer la ubicación del marcador
      .addTo(this.map); // Añadir el marcador al mapa
  }

  filterCiudades() {
    this.filteredCiudades = this.ciudades_component.filter(c => c.municipio_id === this.selectedMunicipioId);
  }

  onMunicipioChange(event: any) {
    const municipioId = +event.target.value;
    if (municipioId) {
      this.selectedMunicipioId = municipioId;
      this.filteredCiudades = this.ciudades_component.filter(c => c.municipio_id === municipioId);
      this.isCiudadSelectDisabled = false; // Habilitar el select de ciudades
    } else {
      // Si no selecciona nada (opción "Selecciona una opción"), deshabilitamos el select de ciudades
      this.filteredCiudades = [];
      this.isCiudadSelectDisabled = true;
      this.selectedCiudadId = null;
    }
  }

  onCiudadChange(event: any) {
    const ciudadId = +event.target.value;
    this.selectedCiudadId = ciudadId;
    const selectedCiudad = this.ciudades_component.find(c => c.id === ciudadId);
    if (selectedCiudad) {
      this.moveToCoordinates(selectedCiudad.coordenada); // Mover el mapa a las coordenadas de la ciudad
    }
  }

  onBackToCurrentPosition() {
    this.moveToCoordinates(this.currentPosition, 17);
  }

  moveToCoordinates(coordinates: [number, number], zoomMap = 11) {
    this.map.flyTo({
      center: coordinates, // Coordenadas a las que se moverá el mapa
      zoom: zoomMap // Zoom al que se acercará
    });
  }

}