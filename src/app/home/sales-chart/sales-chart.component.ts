import { Component, OnInit, Input, ViewEncapsulation, ElementRef } from '@angular/core';
import * as d3 from 'd3';
import { SalesInterface } from '../../shared/sales-interface';


@Component({
  selector: 'app-sales-chart',
  templateUrl: './sales-chart.component.html',
  styleUrls: ['./sales-chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SalesChartComponent implements OnInit {
  @Input()  data:SalesInterface[];
 //Initial dimentions
 hostElement; // Native element hosting the SVG container
 private height=300;
 private width=600;
 private margin = { top: 20, right: 20, bottom: 30, left: 60 };
 private barWidth=this.width-this.margin.left-this.margin.right;
 private barHeight=this.height-40;
 // group containers (X axis, Y axis and bars)
 private gx: any; private gy: any; private bars: any; private bars1:any;
 // Scales and Axis
 private xAxis: any;  private xScale: any;  private yAxis: any;  private yScale: any;
 // Drawing containers
 private svg: any;  private mainContainer: any;
 private color: any; private color1:any;
 private maxY: number; private maxY1: number; private maxY2: number;

 // Show/Hide switch
 isVisible = false;
    changeVisibility() {
        this.isVisible = !this.isVisible;
    }
    
  //constructor() {} 
  constructor(private elRef: ElementRef) {
    // this.hostElement = this.elRef.nativeElement;
    this.hostElement='#chart';
  }
  ngOnInit(): void {
   
   this.maxY1=this.data.reduce(function(max, x) { return (x.sales > max) ? x.sales : max; }, 0);
   this.maxY2=this.data.reduce(function(max, x) { return (x.expense > max) ? x.expense : max; }, 0);
   this.maxY=this.maxY2;
   if (this.maxY1>this.maxY2) {this.maxY=this.maxY1}
    this.svg = d3.select(this.hostElement).append('svg');
    this.xScale = d3.scaleBand().range ([0, this.width]).padding(0.1);
                                 
    this.yScale = d3.scaleLinear()
    .domain([0,this.maxY])
    .range ([0, this.height-this.margin.top]);
    this.setSVGDimensions();
    this.color =d3.scaleLinear().domain([0,this.data.length]).range(<any[]>['#00b300', '#4dff4d']); //colours range
    this.color1 =d3.scaleLinear().domain([0,this.data.length]).range(<any[]>['#0000A0', '#ADD8E6']); //colours range
    //this.color = d3.scaleOrdinal(d3.schemeCategory10);
    this.mainContainer = this.svg.append('g').attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
    this.gy = this.mainContainer.append('g').attr('class', 'axis axis--y');
    this.gx = this.mainContainer.append('g').attr('class', 'axis axis--x');  
    this.draw(); 
   
    //Listening to the window size
   window.addEventListener('resize', this.resize.bind(this));
  }
  private drawBars() {
  
    this.bars = this.mainContainer.selectAll("bar")
    .remove().exit()
    .data(this.data).enter().append('rect')
        
   this.bars
      .attr('x',d => this.xScale(d.date)+this.xScale.bandwidth()/2)
      .attr('y', d => this.yScale(d.sales))
      .attr('width', this.xScale.bandwidth()/2)
      .attr('height', d => -this.yScale(d.sales) + this.yScale(0))// Keep this
      .attr('fill',(d, i) => this.color(i))
      .on('mouseenter', function (actual, i) {
        d3.select(this).attr('opacity', 0.5)
       })
      .on('mouseleave', function (actual, i) {
        d3.select(this).attr('opacity', 1)
       });

   this.bars1 = this.mainContainer.selectAll("bar1")
      .remove().exit()
      .data(this.data).enter().append('rect')  

      this.bars1
      .attr('x',d => this.xScale(d.date))
      .attr('y', d => this.yScale(d.expense))
      .attr('width', this.xScale.bandwidth()/2)
      .attr('height', d => -this.yScale(d.expense) + this.yScale(0))// Keep this
      .attr('fill',(d, i) => this.color1(i))   
 
      .on('mouseenter', function (actual, i) {
        d3.select(this).attr('opacity', 0.5)
       })
      .on('mouseleave', function (actual, i) {
        d3.select(this).attr('opacity', 1)
       });

    // draw legend nad text
      this.mainContainer.append("rect")
      .attr("x",this.barWidth - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", this.color(0));

      this.mainContainer .append("text")
      .style("font", "10px")
      .attr("x", this.barWidth - 28)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .style('fill', 'black')
      .text("Sales"); 

      this.mainContainer.append("rect")
      .attr("x",this.barWidth - 18)
      .attr('y',36)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", this.color1(0)); 
      this.mainContainer .append("text")
      .style("font", "10px")
      .attr("x", this.barWidth - 28)
      .attr("y", 45)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .style('fill', 'black')
      .text("Expense");   
  }

  private drawAxis() {
   this.gy.attr('transform', `translate(0, 0)`).call(this.yAxis);
   this.gx.attr('transform', `translate(0, ${this.yScale(0)})`).call(this.xAxis);
   }

  private setSVGDimensions() {
    this.svg.style('width', this.width).style('height', this.height);
   
  }

  private setAxisScales() {
    this.xScale = d3.scaleBand();
    this.yScale = d3.scaleLinear();
    this.xScale
      .rangeRound([0, this.barWidth]).padding(.1)
      .domain(this.data.map(d => d.date));
    this.yScale
      .range([this.barHeight, 0])
      .domain([0, this.maxY]);
    this.xAxis = d3.axisBottom(this.xScale);
    this.yAxis = d3.axisLeft(this.yScale);
  }

  private draw() {
    this.setAxisScales();
    this.drawAxis();
    this.drawBars();
   
  }
  //resizing as the window changes
  private resize() {
   this.setSVGDimensions();
   this.setAxisScales();
   this.repaint();
   this.draw();
  }

  private repaint() {
    this.drawAxis();
    this.drawBars();
  }
}


