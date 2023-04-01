import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { GridColumn, HGrid } from 'haystack-core';
import { map, Observable } from 'rxjs';
import { RequestReadService } from 'src/app/core/services/requests/read/request-read.service';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableComponent implements OnChanges, OnInit {
  constructor(private req: RequestReadService) {}

  @Input() dataGrid: HGrid | undefined;

  rows: Observable<any[]> = this.req
    .readExpr('scDashboardPortfolioTable()')
    .pipe(
      map((data) => HGrid.make(data)),
      map((grid) => {
        this.columnNames = grid.getColumns();
        const arr: any[] = [];
        grid.getRows().forEach((row) => {
          let r = {};
          grid.getColumnNames().forEach((name) => {
            r = {
              ...r,
              [name]: row.get(name)?.toString(),
            };
          });
          arr.push(r);
        });

        return arr;
      })
    );

  columnNames: GridColumn[] = [];

  ngOnChanges(change: SimpleChanges) {
    // if (change['dataGrid'].currentValue) this.convertedGrid();
  }

  ngOnInit(): void {}

  rows2: any[] | undefined;

  convertedGrid(): any[] {
    console.log(this.dataGrid?.inspect());
    const arr: any[] = [];
    this.dataGrid?.getRows().forEach((row) => {
      let r = {};
      this.dataGrid?.getColumnNames().forEach((name) => {
        r = {
          ...r,
          [name]: row.get(name)?.toZinc(),
        };
      });
      arr.push(r);
    });
    this.rows2 = arr;
    return arr;
  }
}
