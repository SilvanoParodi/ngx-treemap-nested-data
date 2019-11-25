import {
  Component,
  OnChanges,
  Input,
  Output,
  SimpleChanges,
  EventEmitter,
  ChangeDetectionStrategy,
  TemplateRef
} from "@angular/core";
import { getColorScheme } from "./treemapml-colorscheme";

@Component({
  selector: "g[rs-charts-tree-map-cell-series-ml]",
  template: `
    <svg:g
      *ngIf="!childrenTrees || !childrenTrees || childrenTrees.length == 0"
      fill="blue"
    >
      <svg:g
        rs-charts-tree-map-cell-ml
        *ngFor="let c of cells; trackBy: trackBy"
        [data]="c.data"
        [x]="c.x"
        [y]="c.y"
        [width]="c.width"
        [height]="c.height"
        [fill]="c.fill"
        [label]="c.label"
        [value]="c.value"
        [valueType]="c.valueType"
        [valueFormatting]="valueFormatting"
        [labelFormatting]="labelFormatting"
        [gradient]="gradient"
        [animations]="animations"
        (select)="onClick($event)"
        ngx-tooltip
        [tooltipDisabled]="tooltipDisabled"
        [tooltipPlacement]="'top'"
        [tooltipType]="'tooltip'"
        [tooltipTitle]="tooltipTemplate ? undefined : getTooltipText(c)"
        [tooltipTemplate]="tooltipTemplate"
        [tooltipContext]="c.data"
      ></svg:g>
    </svg:g>

    <svg:g *ngIf="childrenTrees && childrenTrees.length">
      <svg:g *ngFor="let childTree of childrenTrees; index as i">
        <svg:g *ngIf="childTree.children">
          <svg:foreignObject
            [attr.x]="getX(i)"
            [attr.y]="getY(i)"
            [attr.width]="getW(i)"
            [attr.height]="getH(i)"
          >
            <xhtml:rs-charts-tree-map-ml
              [results]="childTree.children"
              [view]="getSubView(i)"
              [subtreeCounter]="getSubtreeCounter(i)"
            />
          </svg:foreignObject>
        </svg:g>

        <svg:g *ngIf="childTree.children == undefined">
          <svg:g
            rs-charts-tree-map-cell-ml
            [data]="cells[i].data"
            [x]="cells[i].x + 5"
            [y]="cells[i].y + 5"
            [width]="cells[i].width - 5"
            [height]="cells[i].height - 10"
            [fill]="getCellColor(i)"
            [label]="cells[i].label"
            [value]="cells[i].value"
            [valueType]="cells[i].valueType"
          ></svg:g>
        </svg:g>
      </svg:g>
    </svg:g>
  `,

  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RsTreeMapCellSeriesComponentMultilevel implements OnChanges {
  @Input() data;
  @Input() childrenTrees;
  @Input() dims;
  @Input() colors;
  @Input() valueFormatting: any;
  @Input() labelFormatting: any;
  @Input() gradient: boolean = false;
  @Input() tooltipDisabled: boolean = false;
  @Input() tooltipTemplate: TemplateRef<any>;
  @Input() animations: boolean = true;
  @Input() subtreeCounter: number;

  @Output() select = new EventEmitter();

  cells: any[];

  ngOnChanges(changes: SimpleChanges): void {
    this.cells = this.getCells();
  }

  getCells(): any[] {
    if (!this.data || !this.data.children) return [];

    return this.data.children
      .filter(d => {
        return d.depth === 1;
      })
      .map((d, index) => {
        const label = d.id;

        return {
          data: d.data,
          x: d.x0,
          y: d.y0,
          width: d.x1 - d.x0,
          height: d.y1 - d.y0,
          fill: this.colors.getColor(label),
          label,
          value: d.value,
          valueType: d.valueType
        };
      });
  }

  getTooltipText({ label, value }): string {
    //<span class="tooltip-label">${escapeLabel(label)}</span>
    return `
      <span class="tooltip-label">${label}</span>
      <span class="tooltip-val">${value.toLocaleString()}</span>
    `;
  }

  onClick(data): void {
    this.select.emit(data);
  }

  trackBy(index: number, item): string {
    return item.label;
  }

  getSubView(index: number): any {
    let cell = this.cells[index];
    return [cell.width, cell.height];
  }
  getX(index: number): any {
    let cell = this.cells[index];
    return cell.x;
  }
  getY(index: number): any {
    let cell = this.cells[index];
    return cell.y;
  }
  getW(index: number): number {
    let cell = this.cells[index];
    return cell.width;
  }
  getH(index: number): number {
    let cell = this.cells[index];
    return cell.height;
  }

  getSubtreeCounter(index: number) {
    return this.subtreeCounter + index;
  }

  getCellColor(index: number) {
    return getColorScheme(this.getSubtreeCounter(index));
  }
}
