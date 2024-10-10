export interface Municipio {
    id: number;
    name: string;
}

export interface Ciudad {
    id: number;
    municipio_id: number;
    name: string;
    coordenada: [number, number];
}

export interface Parquimetro {
    id: number;
    ciudad_id: number;
    name: string;
    description: string;
    coordenada: [number, number];
}