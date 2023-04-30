import {
  Component,
  Input,
  Output,
  TemplateRef,
  ViewChild,
  EventEmitter,
  ChangeDetectionStrategy,
  AfterViewInit,
} from '@angular/core';
import { HDict, HGrid } from 'haystack-core';
import { GridTableGenerator } from './grid-table-generator';
@Component({
  selector: 'app-grid-table',
  templateUrl: './grid-table.component.html',
  styleUrls: ['./grid-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridTableComponent implements AfterViewInit {
  @Input() set data(value: HGrid | undefined | null) {
    this.isLoading = !value;
    if (!!value) this.loadedData = value;
    this.TableGenerator.updateConfig(value, this.display);
  }

  @Input() rollup: string = '1day';
  @Output() onDownload = new EventEmitter();
  @ViewChild('edit') display: TemplateRef<any> | undefined;

  private loadedData: HGrid | undefined;

  TableGenerator: GridTableGenerator = new GridTableGenerator(
    this.data,
    undefined
  );
  constructor() {}

  ngAfterViewInit(): void {
    this.TableGenerator.updateConfig(this.loadedData, this.display);
  }

  title: string = this.data?.meta.get('title')?.toString() ?? 'Raport';
  isLoading: boolean = true;

  download() {
    this.onDownload.emit('');
  }

  onParameterChange(event: any, row: HDict, column: any, value: any) {
    console.log(event, row, column, value);
  }
}
