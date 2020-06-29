import { Component, OnInit, Input, ViewEncapsulation, ElementRef, OnChanges } from '@angular/core';
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
export class AreaChartComponent  implements OnInit, OnChanges {
    @Input()  data:SalesInterface[];
   //Initial dimentions
   hostElement='#area'; // Native element hosting the SVG container
  
   private margin = { top: 10, right: 10, bottom:30, left: 60 };
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
   // Show/Hide switch
  isAreaVisible = false;
  changeAreaVisibility() {
     this.isAreaVisible = !this.isAreaVisible;
 }
 
 constructor() { }
 ngOnInit():void {}
 ngOnChanges():void {
   // configure margins and width/height of the graph
  this.maxY1=this.data.reduce(function(max, x) { return ((x.sales1+x.sales2+x.sales3) > max) ? (x.sales1+x.sales2+x.sales3): max; }, 0);
  this.maxY2=this.data.reduce(function(max, x) { return ((x.expense1+x.expense2+x.expense3) > max) ? (x.expense1+x.expense2+x.expense3) : max; }, 0);
  this.maxY=0;
  if (this.maxY1<this.maxY2) {this.maxY=this.maxY2;} else {this.maxY=this.maxY1;}
  this.color1='#ffffff';
  this.color2='#8ef5f5'; 
  this.svg = d3.select(this.hostElement).append('svg');
  this.width =500 - this.margin.left - this.margin.right;
// this.width=parseInt(d3.select(this.hostElement).style('width'), 10)- this.margin.left - this.margin.right;
  this.height = 250 - this.margin.top - this.margin.bottom;
// this.height=parseInt(d3.select(this.hostElement).style('height'), 10)- this.margin.top - this.margin.bottom;

  this.setSvgDimentions();
  this.mainContainer = this.svg.append('g')
  .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
  this.gy = this.mainContainer.append('g').attr('class', 'axis axis--y');
  this.gx = this.mainContainer.append('g').attr('class', 'axis axis--x');
  this.setAxisScales();
  this.drawAxis();
  this.drawLineAndPath();
   //Listening to the window size
  window.addEventListener('resize', this.resize.bind(this));
 }

  private setSvgDimentions() {
   
   this.svg.style('width', this.width+this.margin.left+this.margin.right)
            .style('height', this.height+this.margin.top+this.margin.bottom);
  
  }
  
private drawLineAndPath() {
  this.area = this.mainContainer.selectAll('path').remove().exit() 
//this.area = this.mainContainer.selectAll('path')
.data(this.data).enter().append('path')
this.area = d3Shape.area()
    .x( (d: any) => this.x(d.month) )
    .y0(this.y(0))
    .y1( (d: any) => this.y(d.expense1+d.expense2+d.expense3) );
// Configuring line path sales
this.mainContainer.append('path')
    .datum(this.data)
    .attr('class', 'area')
    .attr('d', this.area)
    .attr('fill',this.color1)
   // .style('stroke', 'black')
  //  .style('stroke-width', '2px');
this.area = d3Shape.area()
    .x( (d: any) => this.x(d.month) )
    .y0(this.y(0))
    .y1( (d: any) => this.y(d.sales1+d.sales2+d.sales3) );
// Configuring line path expenses
this.mainContainer.append('path')
    .datum(this.data)
    .attr('class', 'area')
    .attr('d', this.area)
    .attr('opacity',0.5)
    .attr('fill',this.color2)
   // .style('stroke','green')
   // .style('stroke-width', '2px');   
 

// draw legend and text
this.mainContainer.append("rect")
  .attr("x",this.width - 18)
  .attr("width", 18)
  .attr("height", 18)
  .style("fill", this.color2);
 
 this.mainContainer .append("text")
  .style("font", "10px")
  .attr("x", this.width - 28)
  .attr("y", 9)
  .attr("dy", ".35em")
  .style("text-anchor", "end")
 // .style('fill', 'black')
  .text("Sales"); 
  
  this.mainContainer.append("rect")
  .attr("x",this.width - 18)
  .attr('y',36)
  .attr("width", 18)
  .attr("height", 18)
  .style("fill", this.color1); 
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
            .attr('transform', 'translate(0,' + (this.height-this.margin.top-this.margin.bottom)+ ')')
            .call(d3Axis.axisBottom(this.x));
  this.gx.selectAll("text") 
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");
  }
 
 
 
   private setAxisScales() {
   
    this.x = d3Scale.scaleBand().rangeRound([0, this.width-this.margin.right-this.margin.left])
                                .domain(this.data.map((d) => d.month));  
                            
                                  
    this.y = d3Scale.scaleLinear().range([this.height-this.margin.top-this.margin.bottom, 0])
                                  .domain([0, this.maxY]);
    this.xAxis = d3.axisBottom(this.x);
    this.yAxis = d3.axisLeft(this.y);
   }
  //resizing as the window changes
  private resize() {
    this.setSvgDimentions();
    this.setAxisScales();
    this.drawAxis();
    this.drawLineAndPath();
   }
 
  
}

