import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "app";
  treemap1: any[];
  treemap2: any[];
  treemap3: any[];
  view = [700, 300];

  constructor(private http: HttpClient) {}
  // -----------------------------------------------
  ngOnInit() {
    this.getTreemapData1().subscribe(
      response => {
        this.treemap1 = response;
      },
      error => {
        console.log(error.message);
      }
    );

    this.getTreemapData2().subscribe(
      response => {
        this.treemap2 = response;
      },
      error => {
        console.log(error.message);
      }
    );

    this.getTreemapData3().subscribe(
      response => {
        this.treemap3 = response;
      },
      error => {
        console.log(error.message);
      }
    );
  }
  getTreemapData1(): Observable<any> {
    return this.http
      .get("./assets/mockup/treemapData.json")
      .pipe(map(data => data));
  }

  getTreemapData2(): Observable<any> {
    return this.http
      .get("./assets/mockup/treemapDataBalanced1level.json")
      .pipe(map(data => data));
  }

  getTreemapData3(): Observable<any> {
    return this.http
      .get("./assets/mockup/treemapDataBalanced2level.json")
      .pipe(map(data => data));
  }
}
