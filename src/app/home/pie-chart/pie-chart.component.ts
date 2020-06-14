import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

import { SalesInterface } from  '../../shared/sales-interface';
import * as d3 from 'd3';

@Component({
  selector: 'app-pie-chart',
  templateUrl:'./pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PieChartComponent implements OnInit {
  @Input()  data:SalesInterface[];
 
   private width=500;
   private height=300;
  radius: number;
  // Arcs & pie
  private arc: any;  private pie: any;  private slices: any;
  private color: any;
  // Drawing containers
  private svg: any;  private mainContainer: any;
  //Tooltip
  private tooltip: any;  
  total=0;
  //Labels
  private arcLabel: any;
  private texts: any;

  constructor() {}
   //View switch
   isVisible = true;
    changeVisibility() {
        this.isVisible = !this.isVisible;
    }

 
  ngOnInit(): void {
    this.radius = (Math.min(this.width, this.height)) / 2;
    this.svg = d3.select('#pie').append('svg');
    this.setSVGDimensions();
    this.color =d3.scaleLinear().domain([0,this.data.length]).range(<any[]>['#00b300', '#4dff4d']); //colours range
    //this.color = d3.scaleOrdinal(d3.schemeCategory10);
    this.mainContainer = this.svg.append('g').attr('transform', `translate(${this.radius},${this.radius})`);
    this.pie = d3.pie().sort(null).value((d: any) => d.sales);
    this.draw();

    //listening to the window size
    window.addEventListener('resize', this.resize.bind(this));
    //tooltip
    this.tooltip = d3.select('#pie') 
    .append('div').attr('class', 'tooltip').style('display', 'none').style('opacity', 0);
  }
  private setSVGDimensions() {
    this.svg.style('width', this.width).style('height', this.height);
  }

  private draw() {
    this.setArcs();
    this.drawSlices();
    //labels
    this.drawLabels();
  }

  private setArcs() {
    const thickness=0.6; // for inner radius
    this.arc = d3.arc().outerRadius(this.radius).innerRadius(this.radius * thickness); 
    //labels
    this.arcLabel = d3.arc().innerRadius(this.radius * thickness).outerRadius(this.radius * .8);
  }

  private drawSlices() {
    this.slices = this.mainContainer.selectAll('path')
      .remove().exit()
      .data(this.pie(this.data))
      .enter().append('g').append('path')
      .attr('d', this.arc);
     

      
   //Tooltip
   this.slices
   .attr('fill', (d, i) => this.color(i))
   .on('mousemove', function (s) {
    
    for(var i = 0; i < this.data.length; i++){
      this.total += parseInt(this.data[i].sales);
    }
    const percent = (Math.abs(s.data.sales / this.total)*100).toFixed(2) + '%';
   
     this.tooltip .style('top', (d3.event.layerY + 15) + 'px').style('left', (d3.event.layerX) + 'px')
       .style('display', 'block').style('opacity', 1).style('height', '40px')
       this.tooltip.html(`name: ${s.data.month}<br>value: ${s.data.sales};<br>share: ${percent}`);
     }.bind(this))
   .on('mouseout', function () {
     this.tooltip.style('display', 'none').style('opacity', 0);
   }.bind(this));   
  
  
  }

  private drawLabels() {
    this.texts = this.mainContainer.selectAll('text')
      .remove().exit()
      .data(this.pie(this.data))
      .enter().append('text')
      .attr('text-anchor', 'middle').attr('transform', d => `translate(${this.arcLabel.centroid(d)})`).attr('dy', '0.35em');
    this.texts.append('tspan').filter(d => (d.endAngle - d.startAngle) > 0.05)
      .attr('x', 0).attr('y', 0).style('font-weight', 'bold')
      .text(d => d.data.month);
    this.texts.append('tspan').filter(d => (d.endAngle - d.startAngle) > 0.25)
      .attr('x', 0).attr('y', '1.3em').attr('fill-opacity', 0.7)
      .text(d => d.data.sales);
  }
  
  //resizing as the window changes
  private resize() {
    this.setSVGDimensions();
    this.setArcs();
    this.repaint();
    this.drawLabels();
  }

  private repaint() {
    this.drawSlices();
    this.drawLabels();
  }
}
