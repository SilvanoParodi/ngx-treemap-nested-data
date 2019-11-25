import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ContentChild,
  TemplateRef
} from "@angular/core";
import { treemap, stratify } from "d3-hierarchy";

import {
  BaseChartComponent,
  ColorHelper,
  calculateViewDimensions
} from "@swimlane/ngx-charts";
import { getColorScheme } from "./treemapml-colorscheme";

@Component({
  selector: "rs-charts-tree-map-ml",
  template: `
    <ngx-charts-chart
      [view]="[width, height]"
      [showLegend]="false"
      [animations]="animations"
    >
      <svg:g [attr.transform]="transform" class="tree-map chart" fill="green">
        <svg:g
          rs-charts-tree-map-cell-series-ml
          [colors]="colors"
          [data]="data"
          [childrenTrees]="childrenTrees"
          [dims]="dims"
          [tooltipDisabled]="tooltipDisabled"
          [tooltipTemplate]="tooltipTemplate"
          [valueFormatting]="valueFormatting"
          [labelFormatting]="labelFormatting"
          [gradient]="gradient"
          [animations]="animations"
          [subtreeCounter]="this.subtreeCounter"
          (select)="onClick($event)"
        />
      </svg:g>
    </ngx-charts-chart>
  `,
  styleUrls: ["./treemapml.component.scss"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RsTreeMapComponentMultilevel extends BaseChartComponent {
  @Input() results;
  @Input() tooltipDisabled: boolean = false;
  @Input() valueFormatting: any;
  @Input() labelFormatting: any;
  @Input() gradient: boolean = false;
  @Input() subtreeCounter: number = 0;
  childrenTrees: any;
  colorSchemeIndex: number;

  @Output() select = new EventEmitter();

  @ContentChild("tooltipTemplate", { static: false })
  tooltipTemplate: TemplateRef<any>;

  dims: any;
  domain: any;
  transform: any;
  colors: ColorHelper;
  treemap: any;
  data: any;
  margin = [5, 5, 5, 5];

  update(): void {
    // tiene i children

    if (this.results && this.results.length > 0) {
      this.results.forEach(element => {
        if (element.children) {
          this.childrenTrees = this.results;
        }
      });
    }
    super.update();

    this.dims = calculateViewDimensions({
      width: this.width,
      height: this.height,
      margins: this.margin
    });

    this.domain = this.getDomain();

    this.treemap = treemap<any>().size([this.dims.width, this.dims.height]);

    const rootNode = {
      name: "root",
      value: 0,
      isRoot: true
    };

    const root = stratify<any>()
      .id(d => {
        let label = d.name;

        if (label.constructor.name === "Date") {
          label = label.toLocaleDateString();
        } else {
          label = label.toLocaleString();
        }
        return label;
      })
      .parentId(d => (d.isRoot ? null : "root"))([rootNode, ...this.results])
      .sum(d => d.value);

    this.data = this.treemap(root);

    this.setColors();

    this.transform = `translate(${this.dims.xOffset} , ${this.margin[0]})`;
  }

  getDomain(): any[] {
    return this.results.map(d => d.name);
  }

  onClick(data): void {
    this.select.emit(data);
  }

  setColors(): void {
    if (this.subtreeCounter) {
      this.colorSchemeIndex = this.subtreeCounter;
    } else {
      this.colorSchemeIndex = 0;
    }

    this.colors = new ColorHelper(
      getColorScheme(this.colorSchemeIndex),
      "ordinal",
      this.domain,
      this.customColors
    );
  }
}
