import {Ciudad, Municipio,  Parquimetro} from './interfaces'

export const municipios: Municipio[] = [
    {
        id: 1,
        name: "Antioquia"
    },
    {
        id: 2,
        name: "Cundinamarca"
    },
    {
        id: 3,
        name: "Valle"
    }
];

export const ciudades: Ciudad[] = [
    {
        id: 1,
        name: "Medellin",
        municipio_id: 1,
        coordenada: [-75.56359, 6.25184]
    },
    {
        id: 2,
        name: "Rionegro",
        municipio_id: 1,
        coordenada: [-75.37371, 6.155154]
    },
    {
        id: 3,
        name: "Bogota",
        municipio_id: 2,
        coordenada: [-74.08175, 4.60971]
    },
    {
        id: 4,
        name: "Cali",
        municipio_id: 3,
        coordenada: [-76.5225, 3.43722]
    }
];

export const parquimetros: Parquimetro[] = [
    {
        id: 1,
        name: "Provenza",
        ciudad_id: 1, // Medellín
        coordenada: [-75.5707, 6.2068], // Provenza, El Poblado, Medellín
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam dignissim."
    },
    {
        id: 2,
        name: "El Poblado",
        ciudad_id: 1, // Medellín
        coordenada: [-75.567, 6.207], // El Poblado, Medellín
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam dignissim."
    },
    {
        id: 3,
        name: "El Tesoro",
        ciudad_id: 1, // Medellín
        coordenada: [-75.559, 6.195], // Centro Comercial El Tesoro, Medellín
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam dignissim."
    },
    {
        id: 4,
        name: "Aeropuerto",
        ciudad_id: 2, // Rionegro
        coordenada: [-75.4231, 6.1645], // Aeropuerto José María Córdova, Rionegro
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam dignissim."
    },
    {
        id: 5,
        name: "Estadio Nemesio Camacho El Campín",
        ciudad_id: 3, // Bogotá
        coordenada: [-74.078, 4.648], // Estadio El Campín, Bogotá
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam dignissim."
    },
    {
        id: 6,
        name: "Marcador de prueba 1",
        ciudad_id: 4,
        coordenada: [-76.5095, 3.4771], // Al noreste del punto original, a menos de 500 metros
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam dignissim."
    },
    {
        id: 7,
        name: "Marcador de prueba 2",
        ciudad_id: 4,
        coordenada: [-76.5105, 3.4762], // Al suroeste del punto original, a menos de 500 metros
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam dignissim."
    },
    {
        id: 8,
        name: "Marcador de prueba 3",
        ciudad_id: 4,
        coordenada: [-76.5102, 3.4760], // Al sur del punto original, a menos de 500 metros
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam dignissim."
    }
    
]