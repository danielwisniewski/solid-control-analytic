import { TableColumn } from '@swimlane/ngx-datatable';
import { GridColumn, HDict, HGrid } from 'haystack-core';
import { generateLabelName } from '../../charts/utils/dataset.util';
import { GridTablePipe } from './grid-table.pipe';
import { TemplateRef } from '@angular/core';

export class GridTableGenerator {
  constructor(
    grid: HGrid | undefined | null,
    ref: TemplateRef<any> | undefined
  ) {
    this.updateConfig(grid, ref);
  }
  private grid: HGrid | undefined;
  private rowsNumber: number = 0;
  private columnsNumber: number = 0;
  private pivotRequired: boolean = false;
  private gridColumns: HDict[] | GridColumn[] = [];
  private ref: TemplateRef<any> | undefined;

  public columns: TableColumn[] = [];
  public rows: HDict[] = [];
  public messages = {
    emptyMessage: `
      <div class="row">
        <div class="col-12">
          <h2 class="text-center">Nie znaleziono danych</h2>
          <p class="text-center">Spróbuj wybrać inne urządzenie lub zmień czasookres</p>
        </div>
      </div>
    `,
  };

  public updateConfig(
    grid: HGrid | undefined | null,
    ref: TemplateRef<any> | undefined
  ): void {
    if (!grid) return;
    if (typeof ref === 'undefined') return;
    this.ref = ref;
    this.grid = grid;
    this.rowsNumber = grid.getRows().length;
    this.columnsNumber = grid.getColumnsLength();
    this.pivotRequired =
      this.rowsNumber === 1 &&
      this.columnsNumber > 2 &&
      this.grid.getColumnNames()[0] !== 'ts';

    this.gridColumns = this.pivotRequired
      ? this.pivotColumnsNames
      : this.grid.getColumns();

    this.generateColumnsConfig(grid);
    this.generateRows(grid);
  }

  private pivotColumnsNames = [
    HDict.make({ name: 'Nazwa', prop: 'dis' }),
    HDict.make({ name: 'Wartość', prop: 'val' }),
  ];

  private generateColumnsConfig(grid: HGrid): void {
    const columns: TableColumn[] = [];
    for (let index = 0; index < this.gridColumns?.length; index++) {
      const name = this.pivotRequired
        ? this.pivotColumnsNames[index].get('name')?.toString()
        : generateLabelName(grid, index);
      const prop = this.pivotRequired
        ? this.pivotColumnsNames[index].get('prop')?.toString()
        : grid.getColumnNames()[index];

      const column: TableColumn = {
        name: name as string,
        prop: prop as string,
        sortable: false,
        resizeable: true,
        draggable: false,
        headerClass: 'text-center text-wrap',
        cellClass: 'text-center',
        pipe: new GridTablePipe(),
        cellTemplate: undefined,
      };

      columns.push(column);
    }

    this.columns = columns;
  }

  private generateRows(grid: HGrid): void {
    if (!this.pivotRequired) this.rows = grid.getRows();
    else {
      this.rows = grid.getColumns().map((row, i) => {
        const columnName = grid.getColumnNames()[i];
        return HDict.make({
          dis: generateLabelName(grid, i),
          val: grid.first?.get(columnName ?? 'v0')?.toString() ?? '',
        });
      });
    }
  }
}
