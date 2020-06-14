import { Component, OnInit, Input, ViewEncapsulation, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import * as d3Scale from 'd3-scale';

import { SalesInterface } from '../../shared/sales-interface';


@Component({
    selector: 'app-area-chart',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './area-chart.component.html',
    styleUrls: ['./area-chart.component.scss']
})
export class AreaChartComponent  implements OnInit {
    @Input()  data1:SalesInterface[];
   //Initial dimentions
   hostElement='#area'; // Native element hosting the SVG container
  
   data: any[] = [
   {date:new Date ('01-01-2019'), sales: 80, expense:50},
   {date:new Date ('02-02-2019'), sales: 100, expense:60},
   {date:new Date ('03-03-2019'), sales: 120, expense:90},
   {date:new Date ('04-04-2019'), sales: 140, expense:80},
   {date:new Date ('05-05-2019'), sales: 100, expense:250},
   {date:new Date ('06-06-2019'), sales: 120, expense:50},
   {date:new Date ('07-07-2019'), sales: 60, expense:70},
   {date:new Date ('08-08-2019'), sales: 200, expense:150},
   {date:new Date ('09-09-2019'), sales: 80, expense:50},
   ];

   private margin = {top: 20, right: 20, bottom: 30, left: 50};
   private width: number;
   private height: number;
   private x: any;
   private y: any;
   private svg: any;private mainContainer: any;
   private color1:any; private color2:any;
   private area: any;
    // group containers (X axis, Y axis and bars)
   private gx: any; private gy: any; 
   // Scales and Axis
   private xAxis: any;  private xScale: any;  private yAxis: any;  private yScale: any;
   private maxY: number; private maxY1: number; private maxY2: number;
   
 constructor() {
     // configure margins and width/height of the graph

  this.width = 600 - this.margin.left - this.margin.right;
  this.height = 300 - this.margin.top - this.margin.bottom;
  this.maxY1=this.data.reduce(function(max, x) { return (x.sales > max) ? x.sales : max; }, 0);
  this.maxY2=this.data.reduce(function(max, x) { return (x.expense > max) ? x.expense : max; }, 0);
  this.maxY=0;
  if (this.maxY1<this.maxY2) {this.maxY=this.maxY2;} else {this.maxY=this.maxY1;}
  this.color1='orange';
  this.color2='blue';
 }
 ngOnInit() {
  this.buildSvg();
  this.setAxisScales();
  this.drawAxis();
  this.drawLineAndPath();
   //Listening to the window size
  window.addEventListener('resize', this.resize.bind(this));
  }

  private buildSvg() {
  this.svg = d3.select(this.hostElement).append('svg');
  this.svg.style('width', this.width+this.margin.left+this.margin.right)
          .style('height', this.height+this.margin.top+this.margin.bottom);
  this.mainContainer = this.svg.append('g')
         .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
  this.gy = this.mainContainer.append('g').attr('class', 'axis axis--y');
  this.gx = this.mainContainer.append('g').attr('class', 'axis axis--x');
  }
  
private drawLineAndPath() {
   // var parseDate = d3.timeParse("%Y-%m-%d");
var formatTime = d3.timeFormat("%e %B"); 
this.area = this.mainContainer.selectAll("area")
                              .remove().exit()
this.area = d3Shape.area()
    .x( (d: any) => this.x(d.date) )
    .y0(this.y(0))
    .y1( (d: any) => this.y(d.expense) );
// Configuring line path sales
this.mainContainer.append('path')
    .datum(this.data)
    .attr('class', 'area')
    .attr('d', this.area)
    .attr('fill',this.color1)
    .style('stroke', 'black')
    .style('stroke-width', '2px');
this.area = d3Shape.area()
    .x( (d: any) => this.x(d.date) )
    .y0(this.y(0))
    .y1( (d: any) => this.y(d.sales) );
// Configuring line path expenses
this.mainContainer.append('path')
    .datum(this.data)
    .attr('class', 'area')
    .attr('d', this.area)
    .attr('opacity',0.5)
    .attr('fill',this.color2)
    .style('stroke','green')
    .style('stroke-width', '2px');   
 

// draw legend and text
this.mainContainer.append("rect")
  .attr("x",this.width - 18)
  .attr("width", 18)
  .attr("height", 18)
  .style("fill", this.color1);
 
 this.mainContainer .append("text")
  .style("font", "10px")
  .attr("x", this.width - 28)
  .attr("y", 9)
  .attr("dy", ".35em")
  .style("text-anchor", "end")
  .style('fill', 'black')
  .text("Sales"); 
  
  this.mainContainer.append("rect")
  .attr("x",this.width - 18)
  .attr('y',36)
  .attr("width", 18)
  .attr("height", 18)
  .style("fill", this.color2); 
  this.mainContainer .append("text")
  .style("font", "10px")
  .attr("x", this.width - 28)
  .attr("y", 45)
  .attr("dy", ".35em")
  .style("text-anchor", "end")
  .style('fill', 'black')
  .text("Expense");
               
  }
  private drawAxis() {
   
  this.gy.attr('transform', `translate(0, 0)`).call(this.yAxis);
  this.gx.append('g')
            .attr('transform', 'translate(0,' + (this.height -this.margin.bottom-this.margin.top)+ ')')
            .call(d3Axis.axisBottom(this.x).tickFormat(d3.timeFormat("%B")));
  }
 
 
 
   private setAxisScales() {
   
    this.x = d3Scale.scaleBand().rangeRound([0, this.width-this.margin.left-this.margin.right])
                                .domain(this.data.map((d) => d.date));  
                            
                                  
    this.y = d3Scale.scaleLinear().range([this.height-this.margin.top-this.margin.bottom, 0])
                                  .domain([0, this.maxY]);
    this.xAxis = d3.axisBottom(this.x);
    this.yAxis = d3.axisLeft(this.y);
   }
  //resizing as the window changes
  private resize() {
    this.buildSvg();
    this.setAxisScales();
    this.drawAxis();
    this.drawLineAndPath();
   }
 
  
}

