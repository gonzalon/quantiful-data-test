import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map'

import {NameValue} from '../models/name-value.model';
import {LineChartData} from '../models/line-chart-data.model';


@Injectable()
export class ElasticsearchService {

    private API_URL: string = 'https://search-test-quantiful-lq7kiwfg6tc42lwauzzes4zcqa.us-west-2.es.amazonaws.com/sales/_search/';

    constructor(private http: HttpClient) { }

    //A line chart showing daily sales by store and region (3 regions each having 3 stores)
    getDailySales(): Observable<LineChartData[]>{
        let query = {
            "size":0,
            "aggs":{
              "regions":{"terms":{"field":"region.keyword"},
                "aggs":{
                    "stores":{"terms":{"field":"store.keyword"},
                    "aggs" : {
                        "sales" : {"date_histogram" : { "field" : "date","interval" : "day"},
                        "aggs":{
                                "sales":{"sum":{ "field": "sales"}}
                            }
                        }
                    }
                }
                }
        }}};
        return this.http.post(this.API_URL, query).map(data => {
            let regions = data["aggregations"].regions.buckets;
            let result: LineChartData[] = [];
            regions.map(r =>{
                return r.stores.buckets.map(s => {
                    let item: LineChartData = new LineChartData();
                    item.name = r.key + " " + s.key;
                    s.sales.buckets.map(sa => {
                        let nv: NameValue = new NameValue(sa.key_as_string, sa.sales.value);
                        item.series.push(nv);
                    });
                    result.push(item);
                });
            });
            return result;
        });
    }

    //A pie chart showing total sales by region
    getTotalSalesByRegion(): Observable<NameValue[]>{
        let query = {"size":0, "aggs":{"regions":{"terms":{"field":"region.keyword"},"aggs":{"sales_region":{"sum":{"field":"sales"}}}}}};
        return this.http.post(this.API_URL, query).map(data => {
            let regions = data["aggregations"].regions.buckets;
            let result = regions.map(r => new NameValue(r.key, r.sales_region.value));
            return result;
        });
    }

    //A bar chart showing total sales by store
    getTotalSalesByStore(): Observable<NameValue[]>{
        let query = {"size":0, "aggs":{"stores":{"terms":{"field":"store.keyword"},"aggs":{"sales_store":{"sum":{"field":"sales"}}}}}};
        return this.http.post(this.API_URL, query).map(data => {
            let stores = data["aggregations"].stores.buckets;
            let result = stores.map(r => new NameValue(r.key, r.sales_store.value));
            return result;
        });
    }

}