import { Component, OnInit, Inject, ViewChild, ElementRef  } from '@angular/core';
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
  @ViewChild('lightChartContainer') lightChartContainer!: ElementRef;
  @ViewChild('soundChartContainer') soundChartContainer!: ElementRef;

  lights: number[] = []; 
  sounds: number[] = []; 
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

  lightChartBar: ChartData<'bar'> = {
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

  chartOptionsBar: ChartOptions<'bar'> = {
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

  soundChart: ChartData<'line'> = {
    labels: [], // Etiquetas para el gráfico
    datasets: [
      {
        data: [],
        label: 'Sonido',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };

  soundChartBar: ChartData<'bar'> = {
    labels: [], // Etiquetas para el gráfico
    datasets: [
      {
        data: [],
        label: 'Sonido',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };

  chartOptions1: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Sound: ${context.raw}`;
          }
        }
      }
    }
  };

  chartOptionsBar1: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Sound: ${context.raw}`;
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
      error => console.error('Error al obtener las mediciones luz:', error)
    );
    this.ss.getSounds().subscribe(
      (sounds: number[]) => {
        this.sounds = sounds;
        this.updateChart();
      },
      error => console.error('Error al obtener las mediciones sonido:', error)
    );
  }
  updateChart() {
    this.lightChart.labels = this.lights.map((_, index) => `Luz ${index + 1}`);
    this.lightChart.datasets[0].data = this.lights;
    this.soundChart.labels = this.sounds.map((_, index) => `Sonido ${index + 1}`);
    this.soundChart.datasets[0].data = this.sounds;
    this.lightChartBar.labels =  this.lights.map((_, index) => `Luz ${index + 1}`);
    this.lightChartBar.datasets[0].data = this.lights;
    this.soundChartBar.labels = this.sounds.map((_, index) => `Sonido ${index + 1}`);
    this.soundChartBar.datasets[0].data = this.sounds;

  }

  getLightChartElement() {
    return this.lightChartContainer?.nativeElement;
  }

  getSoundChartElement() {
    return this.soundChartContainer?.nativeElement;
  }

} 

