import { ElasticsearchService } from './services/elasticsearch.service';
import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Observable } from 'rxjs/Observable';
import { OnInit } from '@angular/core';
import { NameValue } from './models/name-value.model';
import { LineChartData } from './models/line-chart-data.model';
import { ChartConfig } from './models/chart-config.model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private elasticsearch: ElasticsearchService;

  private title = 'Quantiful data test';
  // options
  private autoScale = true;
  private showLegend = true;
  private size: any[] = [700, 400];

  // charts
  private salesByRegionChart: NameValue[] = [];
  private salesByRegionChartConfig: ChartConfig = new ChartConfig("Regions", "Dates", "Sales");

  private salesByStoreChart: NameValue[] = [];
  private salesByStoreChartConfig: ChartConfig = new ChartConfig("Stores", "Stores", "Sales");

  private dailySalesChart: LineChartData[] = [];
  private dailySalesChartLegend = "Region / Store";

  private onError = error => console.error("Error on chart: ", error);

  ngOnInit() {
    this.elasticsearch.getTotalSalesByRegion().subscribe(data => {
      this.salesByRegionChart = data;
    }, this.onError);

    this.elasticsearch.getTotalSalesByStore().subscribe(data => {
      this.salesByStoreChart = data;
    }, this.onError);

    this.elasticsearch.getDailySales().subscribe(data =>{
      this.dailySalesChart = data;
    }, this.onError);
  }

  constructor(private es: ElasticsearchService) {
    this.elasticsearch = es;
  }

}