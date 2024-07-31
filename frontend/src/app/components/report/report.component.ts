import { Component, ViewChild, OnInit  } from '@angular/core';
import { StudentComponent } from '../student/student.component';
import { SensorService } from '../../services/sensor.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface LightData {
  createdAt: string;
  light: number;
}

interface SoundData {
  createdAt: string;
  sound: number;
}

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrl: './report.component.css'
})
export class ReportComponent implements OnInit{
  lights: number[] = []; 
  sounds: number[] = []; 
  l: LightData[] = []; 
  s: SoundData[] = []; 
  @ViewChild(StudentComponent) studentComponent!: StudentComponent;

  constructor(private ss: SensorService) {console.log("hlp");}

  ngOnInit(): void {
    this.ss.getSensors().subscribe(
      (lights: number[]) => {
        this.lights = lights;
      },
      error => console.error('Error al obtener las mediciones luz:', error)
    );
    this.ss.getSounds().subscribe(
      (sounds: number[]) => {
        this.sounds = sounds;
      },
      error => console.error('Error al obtener las mediciones sonido:', error)
    );

    this.ss.getSensorsTotal().subscribe(
      (data: LightData[]) => {
        this.l = data;
      },
      error => console.error('Error al obtener las mediciones de luz:', error)
    );
    this.ss.getSoundsTotal().subscribe(
      (data: SoundData[]) => {
        this.s = data;
      },
      error => console.error('Error al obtener las mediciones de sonido:', error)
    );
  }


  descargarReportes() {
    // Lógica para descargar reportes
    this.exportToPDF();
    this.exportChartsToExcel();
    console.log('Descargar Reportes');
  }

  exportToPDF() {
    const doc = new jsPDF({
      orientation: 'landscape', // Configurar la orientación a horizontal
      unit: 'mm',               // Unidad de medida en milímetros
      format: 'a4'              // Formato del documento
    });
    
    // Agrega el encabezado
    doc.setFontSize(18);
    doc.text('DataSense Analytics', 125, 20);
    doc.setFontSize(14);
    doc.text('Reporte de Monitoreo', 130, 30);
  
    // Fecha actual
    const date = new Date();
    doc.setFontSize(12);
    doc.text(`Fecha: ${date.toLocaleDateString()}`, 14, 40);
  
    // Agregar tabla de datos de sonido
    doc.addPage();
    doc.setFontSize(16);
    doc.text('Datos de Sonido', 14, 20);
    (doc as any).autoTable({
      startY: 30,
      head: [['Timestamp', 'Nivel de Sonido']],
      body: this.s.map((item: SoundData) => [item.createdAt, item.sound]),
    });
  
    // Agregar tabla de datos de luz
    doc.addPage();
    doc.setFontSize(16);
    doc.text('Datos de Luz', 14, 20);
    (doc as any).autoTable({
      startY: 30,
      head: [['Timestamp', 'Intensidad de Luz']],
      body: this.l.map((item: LightData) => [item.createdAt, item.light]),
    });
  
    // Guardar el documento
    doc.save('reporte-monitoreo.pdf');
  }
  


  exportToExcel(lightData: number[], soundData: number[], filename: string) {
    // Convertir datos de luz y sonido en una estructura adecuada para Excel
    const lightChartData = lightData.map((value, index) => ({
      'Medición': `Luz ${index + 1}`,
      'Valor': value
    }));
  
    const soundChartData = soundData.map((value, index) => ({
      'Medición': `Sonido ${index + 1}`,
      'Valor': value
    }));
  
    // Crear una hoja de cálculo para cada conjunto de datos
    const lightSheet = XLSX.utils.json_to_sheet(lightChartData);
    const soundSheet = XLSX.utils.json_to_sheet(soundChartData);
  
    // Crear un libro de trabajo nuevo
    const wb = XLSX.utils.book_new();
  
    // Añadir las hojas al libro de trabajo
    XLSX.utils.book_append_sheet(wb, lightSheet, 'Datos de Luz');
    XLSX.utils.book_append_sheet(wb, soundSheet, 'Datos de Sonido');
  
    // Escribir el archivo Excel
    XLSX.writeFile(wb, filename);
  }

  exportChartsToExcel() {
      const lightData = this.lights;
      const soundData = this.sounds;
  
      if (lightData && soundData) {
        // Exportar datos a Excel
        this.exportToExcel(lightData, soundData, 'chart_data.xlsx');
      } else {
        console.error('Datos de gráficos no encontrados.');
      }
}
}
