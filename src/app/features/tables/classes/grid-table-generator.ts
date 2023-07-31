import { TableColumn } from '@swimlane/ngx-datatable';
import {
  GridColumn,
  HBool,
  HDict,
  HGrid,
  HaysonDict,
  HaysonVal,
} from 'haystack-core';
import { generateLabelName } from '../../charts/utils/dataset.util';
import { GridTablePipe } from '../pipes/grid-table.pipe';
import { TemplateRef } from '@angular/core';

export class GridTableGenerator {
  constructor(
    grid: HGrid | undefined | null,
    ref: Record<string, TemplateRef<any> | undefined> | undefined
  ) {
    this.updateConfig(grid, ref);
  }
  private grid: HGrid | undefined;
  private rowsNumber: number = 0;
  private columnsNumber: number = 0;
  private pivotRequired: boolean = false;
  private gridColumns: HDict[] | GridColumn[] = [];
  private ref: Record<string, TemplateRef<any> | undefined> | undefined;

  private expandedRows: string[] = [];

  public filterColumnCounter: number = 0;
  public columns: TableColumn[] = [];
  public rows: HaysonDict[] = [];
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
    ref: Record<string, TemplateRef<any> | undefined> | undefined
  ): void {
    if (!grid) return;
    if (typeof ref === 'undefined') return;
    this.ref = ref;
    this.grid = grid;
    this.generateMessage(grid);
    this.rowsNumber = grid.getRows().length;
    this.columnsNumber = grid.getColumnsLength();

    this.pivotRequired =
      this.rowsNumber === 1 &&
      this.columnsNumber > 2 &&
      this.grid.getColumnNames()[0] !== 'ts' &&
      !!grid.meta.get<HBool>('pivotAllowed')?.value;

    this.gridColumns = this.pivotRequired
      ? this.pivotColumnsNames
      : this.grid.getColumns();

    this.generateColumnsConfig(grid);
    this.generateRows(grid);
  }

  generateMessage(grid: HGrid) {
    const title = !!grid.meta.get('noDataTitle')
      ? grid.meta.get('noDataTitle')?.toString()
      : 'Nie znaleziono danych';
    const subtitle = !!grid.meta.get('noDataSubtitle')
      ? grid.meta.get('noDataSubtitle')?.toString()
      : 'Spróbuj wybrać inne urządzenie lub zmień czasookres';

    this.messages = {
      emptyMessage: `
      <div class="row">
        <div class="col-12">
          <h2 class="text-center">${title}</h2>
          <p class="text-center">${subtitle}</p>
        </div>
      </div>
    `,
    };
  }

  private pivotColumnsNames = [
    HDict.make({ name: 'Nazwa', prop: 'dis' }),
    HDict.make({ name: 'Wartość', prop: 'val' }),
  ];

  private generateColumnsConfig(grid: HGrid): void {
    const columns: TableColumn[] = [];
    this.filterColumnCounter = 0;
    for (let index = 0; index < this.gridColumns?.length; index++) {
      //console.log(grid.getColumn(index));
      if (
        !!grid.meta.get<HBool>('filterColumns')?.value &&
        !grid.getColumn(index)?.meta.get<HBool>('visible')?.value
      )
        continue;

      const name = this.pivotRequired
        ? this.pivotColumnsNames[index].get('name')?.toString()
        : generateLabelName(grid, index);
      let prop = this.pivotRequired
        ? this.pivotColumnsNames[index].get('prop')?.toString()
        : grid.getColumnNames()[index];

      const columnType = grid
        .getColumn(index)
        ?.meta.get('columnType')
        ?.toString();

      const filterHeader = !!grid
        .getColumn(index)
        ?.meta.get<HBool>('filterHeader')?.value;

      if (!!filterHeader) this.filterColumnCounter++;

      const params = grid
        .getColumn(index)
        ?.meta.get('parameters')
        ?.toJSON() as Object;

      const column: TableColumn = {
        name: name as string,
        prop: prop as string,
        sortable: false,
        resizeable: false,
        draggable: false,
        headerClass: 'text-center text-wrap',
        cellClass: 'text-center p-1',
        pipe: new GridTablePipe(),
        headerTemplate:
          !!this.ref && !!filterHeader
            ? this.ref['headerFilterTemplate']
            : undefined,
        cellTemplate:
          !!this.ref && !!columnType ? this.ref[columnType] : undefined,
        ...params,
      };

      columns.push(column);
    }

    this.columns = columns;
  }

  private generateRows(grid: HGrid): void {
    if (!this.pivotRequired) {
      if (!!this.grid?.meta.get<HBool>('isDropdown')?.value) {
        this.rows = grid
          .getRows()
          .map((r) => {
            const index = this.expandedRows.findIndex(
              (row) => row == r.get('id')?.toZinc(true)
            );

            // if (index > -1) r = r.set('treeStatus', 'expanded');
            // else r = r.set('treeStatus', 'collapsed');
            return r;
          })
          .toHayson() as HaysonDict[];
      } else this.rows = this.grid?.getRows().toHayson() as HaysonDict[];
    } else {
      this.rows = grid.getColumns().map((row, i) => {
        const columnName = grid.getColumnNames()[i];
        return HDict.make({
          dis: generateLabelName(grid, i),
          val: grid.first?.get(columnName ?? 'v0')?.toString() ?? '',
        }).toJSON();
      });
    }
    this.originalRows = this.rows;
  }
  private originalRows: HaysonDict[] = [];
  updateExpandedRows(rows: string[]) {
    this.rows = [...this.rows];
    this.expandedRows = rows;
  }

  onFilter(value: string, column: string) {
    const newRows = this.originalRows.filter((r) => {
      const dictRow = HDict.make(r);
      const arrayValue = dictRow.get(column)?.toZinc(false).toLowerCase();
      const search = value.toLowerCase();
      return arrayValue?.includes(search);
    });
    this.rows = [...newRows];
  }
}
