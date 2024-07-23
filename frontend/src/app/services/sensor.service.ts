import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'; // Importar el operador map
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SensorService {

  private apiUrl = 'http://localhost:3000/get-sensor'; // URL del endpoint

  constructor(private http: HttpClient) { }

  getSensors() {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(sensors => sensors.map(sensor => sensor.light)) // Extraer solo el parámetro 'light'
    );
  }
}
