import { Component } from '@angular/core';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrl: './report.component.css'
})
export class ReportComponent {
  verReportes() {
    // Lógica para ver reportes
    console.log('Ver Reportes');
  }

  descargarReportes() {
    // Lógica para descargar reportes
    console.log('Descargar Reportes');
  }
}
