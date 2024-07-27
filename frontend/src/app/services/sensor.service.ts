import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'; // Importar el operador map
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SensorService {

  private URL = 'http://localhost:3000'; // URL del endpoint

  constructor(private http: HttpClient) { }

  getSensors() {
    return this.http.get<any[]>(`${this.URL}/get-sensor`).pipe(
      map(sensors => sensors.map(sensor => sensor.light)) // Extraer solo el parámetro 'light'
    );
  }

  getSounds() {
    return this.http.get<any[]>(`${this.URL}/get-sound`).pipe(
      map(sounds => sounds.map(sounds => sounds.sound))
    );
  }
}