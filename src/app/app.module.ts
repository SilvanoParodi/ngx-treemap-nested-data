import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { RsTreeMapComponentMultilevel } from "./treemapml/treemapml.component";
import { RsTreeMapCellComponentMultilevel } from "./treemapml/treemapml-cell.component";
import { RsTreeMapCellSeriesComponentMultilevel } from "./treemapml/treemapml-cell-series.component";

import { NgxChartsModule } from "@swimlane/ngx-charts";
import { HttpClient, HttpClientModule } from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    RsTreeMapComponentMultilevel,
    RsTreeMapCellComponentMultilevel,
    RsTreeMapCellSeriesComponentMultilevel
  ],
  imports: [
    BrowserModule,
    NgxChartsModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule {}
