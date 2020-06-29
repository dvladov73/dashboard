import { Component, OnInit, Input,ViewEncapsulation, OnChanges } from '@angular/core';
import * as d3 from 'd3';

import { SalesInterface } from '../../shared/sales-interface';

@Component({
  selector: 'app-kpi-chart',
  templateUrl: './kpi-chart.component.html',
  styleUrls: ['./kpi-chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class KpiChartComponent implements OnInit, OnChanges {
  @Input() data:SalesInterface[];
  

   hostElement='#kpichart'; // Native element hosting the SVG container
 
   private height:number;
   private width:number;
   private barWidth:number;
   private barHeight:number;
   private margin = { top: 5, right: 100, bottom: 55, left: 60 };

 // group containers (X axis, Y axis and bars)
   private gx: any; private gy: any; private bars: any; private bars1:any;private bars2:any;
 // Scales and Axis
   private xAxis: any;  private xScale: any;  private yAxis: any;  private yScale: any;
 // Drawing containers
   private svg: any;  private mainContainer: any;
   private color: any; private color1:any;private color2:any;
   maxY: number; private maxY1: number; private maxY2: number; private maxY3:number;
 

constructor() { }
  ngOnInit(): void {}

  ngOnChanges(): void {

    this.maxY=0;
    
    this.maxY1=this.data.reduce(function(max, x) { return ((x.sales1-x.expense1) > max) ? (x.sales1-x.expense1): max; }, 0);
    this.maxY2=this.data.reduce(function(max, x) { return ((x.sales2-x.expense2) > max) ? (x.sales2-x.expense2) : max; }, 0);
    this.maxY3=this.data.reduce(function(max, x) { return ((x.sales3-x.expense3) > max) ? (x.sales3-x.expense3) : max; }, 0);
    this.maxY=this.maxY2;
    if (this.maxY1>this.maxY2) {this.maxY=this.maxY1}
    if(this.maxY3>this.maxY1){this.maxY=this.maxY3}
    this.svg = d3.select(this.hostElement).append('svg');
    this.width=parseInt(d3.select(this.hostElement).style('width'), 10);
    this.height=parseInt(d3.select(this.hostElement).style('height'), 10);
    this.barWidth=this.width-this.margin.left-this.margin.right;
    this.barHeight=this.height-this.margin.bottom-this.margin.top;
    this.xScale = d3.scaleBand().range ([0, this.width]).padding(0.1);                   
    this.yScale = d3.scaleLinear()
    .domain([0,this.maxY])
    .range ([0, this.height-this.margin.top-this.margin.bottom]);
    this.setSVGDimensions();
       
    this.color =d3.scaleLinear().domain([0,this.data.length]).range(<any[]>['#008080', '#008080']); //colours range
    this.color1 =d3.scaleLinear().domain([0,this.data.length]).range(<any[]>['#8ef5f5', '#8ef5f5']); //colours range
    this.color2 =d3.scaleLinear().domain([0,this.data.length]).range(<any[]>['#ffffff', '#ffffff']); //colours range
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
      .attr('x',d => this.xScale(d.month)+this.xScale.bandwidth()/1.5)
    //  .attr('x',d => this.xScale(d.month)
      .attr('y', d => this.yScale(d.sales1-d.expense1))
      .attr('width', this.xScale.bandwidth()/3)
     // .attr('width', this.xScale.bandwidth())
     // .attr('y', d => this.yScale(d.sales1))
      .attr('height', d => -this.yScale(d.sales1-d.expense1) + this.yScale(0))// Keep this
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
      .attr('x',d => this.xScale(d.month))
      .attr('y', d => this.yScale(d.sales2-d.expense2))
      .attr('width', this.xScale.bandwidth()/3)
      .attr('height', d => -this.yScale(d.sales2-d.expense2) + this.yScale(0))// Keep this
      .attr('fill',(d, i) => this.color1(i))   
 
      .on('mouseenter', function (actual, i) {
        d3.select(this).attr('opacity', 0.5)
       })
      .on('mouseleave', function (actual, i) {
        d3.select(this).attr('opacity', 1)
       });
   this.bars2 = this.mainContainer.selectAll("bar1")
       .remove().exit()
       .data(this.data).enter().append('rect')     
   this.bars2
      .attr('x',d => this.xScale(d.month)+this.xScale.bandwidth()/3)
      .attr('y', d => this.yScale(d.sales3-d.expense3))
      .attr('width', this.xScale.bandwidth()/3)
      .attr('height', d => -this.yScale(d.sales3-d.expense3) + this.yScale(0))// Keep this
      .attr('fill',(d, i) => this.color2(i))   
 
      .on('mouseenter', function (actual, i) {
        d3.select(this).attr('opacity', 0.5)
       })
      .on('mouseleave', function (actual, i) {
        d3.select(this).attr('opacity', 1)
       });
       
    // draw legend and text
      this.mainContainer.append("rect")
      .attr("x",this.width-this.margin.right-5)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", this.color(0));

      this.mainContainer .append("text")
      .style("font", "10px")
      .attr("x", this.width-this.margin.right - 15)
      .attr("y", 9)
      .attr("dy", ".20em")
      .style("text-anchor", "end")
      .style('fill', 'black')
      .text('Retail'); 

      this.mainContainer.append("rect")
      .attr("x",this.width-this.margin.right - 5)
      .attr('y',26)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", this.color1(0)); 
      this.mainContainer .append("text")
      .style("font", "10px")
      .attr("x", this.width-this.margin.right - 15)
      .attr("y", 34)
      .attr("dy", ".20em")
      .style("text-anchor", "end")
      .style('fill', 'black')
      .text("Online");   
      this.mainContainer.append("rect")
      .attr("x",this.width-this.margin.right - 5)
      .attr('y',54)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", this.color2(0)); 
      this.mainContainer .append("text")
      .style("font", "10px")
      .attr("x", this.width-this.margin.right - 15)
      .attr("y", 60)
      .attr("dy", ".20em")
      .style("text-anchor", "end")
      .style('fill', 'black')
      .text("Wholesale");   
       }

  private drawAxis() {
   this.gy.attr('transform', `translate(0, 0)`).call(this.yAxis);
   this.gx.attr('transform', `translate(0, ${this.yScale(0)})`).call(this.xAxis)
                                                               .selectAll("text") 
                                                               .style("text-anchor", "end")
                                                               .attr("dx", "-.8em")
                                                               .attr("dy", ".15em")
                                                               .attr("transform", "rotate(-65)");
   }

  private setSVGDimensions() {
    this.svg.style('width', this.width).style('height', this.height);
   }

  private setAxisScales() {
    this.xScale = d3.scaleBand();
    this.yScale = d3.scaleLinear();
    this.xScale
      .rangeRound([0, this.barWidth]).padding(.1)
      .domain(this.data.map(d => d.month));
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


