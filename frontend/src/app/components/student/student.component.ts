import { Component, OnInit, Inject  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SensorService } from '../../services/sensor.service';
import { ChartData, ChartOptions } from 'chart.js'; 
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrl: './student.component.css'
})
export class StudentComponent  implements OnInit{
  lights: number[] = []; 
  isBrowser: boolean;
  lightChart: ChartData<'line'> = {
    labels: [], // Etiquetas para el gráfico
    datasets: [
      {
        data: [],
        label: 'Luz',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };
  chartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Luz: ${context.raw}`;
          }
        }
      }
    }
  };

  constructor(private http: HttpClient, private ss: SensorService, @Inject(PLATFORM_ID) private platformId: Object) { 
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.ss.getSensors().subscribe(
      (lights: number[]) => {
        this.lights = lights;
        this.updateChart();
      },
      error => console.error('Error al obtener los sensores:', error)
    );
  }
  updateChart() {
    this.lightChart.labels = this.lights.map((_, index) => `Medición ${index + 1}`);
    this.lightChart.datasets[0].data = this.lights;
  }
} 

