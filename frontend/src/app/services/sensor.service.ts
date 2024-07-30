import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'; // Importar el operador map
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SensorService {

  private URL = 'http://18.226.180.169:3000'; // URL del endpoint

  constructor(private http: HttpClient) { }

  getSensors() {
    return this.http.get<any[]>(`${this.URL}/get-sensor`).pipe(
      map(sensors => sensors.map(sensor => sensor.light)) // Extraer solo el parámetro 'light'
    );
  }
  getSensorsTotal() {
    return this.http.get<any[]>(`${this.URL}/get-sensor`);
  }

  getSounds() {
    return this.http.get<any[]>(`${this.URL}/get-sound`).pipe(
      map(sounds => sounds.map(sounds => sounds.sound))
    );
  }

  getSoundsTotal() {
    return this.http.get<any[]>(`${this.URL}/get-sound`);
  }
}
