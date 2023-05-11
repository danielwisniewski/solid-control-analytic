import {
  Component,
  Input,
  Output,
  TemplateRef,
  ViewChild,
  EventEmitter,
  ChangeDetectionStrategy,
  AfterViewInit,
  Renderer2,
  ElementRef,
  AfterContentChecked,
} from '@angular/core';
import { HBool, HGrid } from 'haystack-core';
import { GridTableGenerator } from '../classes/grid-table-generator';
import { TreeStatusService } from '../services/tree-status.service';

@Component({
  selector: 'app-grid-table',
  templateUrl: './grid-table.component.html',
  styleUrls: ['./grid-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridTableComponent implements AfterViewInit, AfterContentChecked {
  @Input() set data(value: HGrid | undefined | null) {
    this.isLoading = !value;
    if (!!value) this.loadedData = value;

    const isExpandable = !!value?.meta.get<HBool>('isDropdown')?.value;

    this.treeFromRelation = isExpandable
      ? value?.meta.get('treeFromRelation')?.toString() ?? ''
      : '';
    this.treeToRelation = isExpandable
      ? value?.meta.get('treeToRelation')?.toString() ?? ''
      : '';

    this.TableGenerator.updateConfig(value, this.templatesObj);
  }
  @Input() height: string = '40';
  @Output() onDownload = new EventEmitter();
  @Output() updateData = new EventEmitter();
  @ViewChild('editString') editString: TemplateRef<any> | undefined;
  @ViewChild('editNumber') editNumber: TemplateRef<any> | undefined;
  @ViewChild('editBoolean') editBoolean: TemplateRef<any> | undefined;
  @ViewChild('buttonAction') buttonAction: TemplateRef<any> | undefined;
  @ViewChild('deleteButton') deleteButton: TemplateRef<any> | undefined;
  @ViewChild('headerFilterTemplate') headerFilterTemplate:
    | TemplateRef<any>
    | undefined;

  @ViewChild('table', { static: false }) table: HTMLElement | undefined;

  private templatesObj:
    | Record<string, TemplateRef<any> | undefined>
    | undefined = undefined;

  loadedData: HGrid | undefined;

  isLoading: boolean = true;

  TableGenerator: GridTableGenerator = new GridTableGenerator(
    this.data,
    undefined
  );
  constructor(
    private renderer: Renderer2,
    private dom: ElementRef,
    private treeStatus: TreeStatusService
  ) {
    this.TableGenerator.updateExpandedRows(this.treeStatus.expandedRows);
  }

  treeFromRelation: string = '';
  treeToRelation: string = '';

  onInput(event: any, column: string) {
    this.TableGenerator.onFilter(event.target.value, column);
  }

  ngAfterViewInit(): void {
    this.templatesObj = {
      editString: this.editString,
      editNumber: this.editNumber,
      editBoolean: this.editBoolean,
      buttonAction: this.buttonAction,
      deleteButton: this.deleteButton,
      headerFilterTemplate: this.headerFilterTemplate,
    };
    this.TableGenerator.updateConfig(this.loadedData, this.templatesObj);
  }

  ngAfterContentChecked(): void {
    if (!this.treeFromRelation || !this.treeToRelation) return;
    const dropdownButtons = this.dom.nativeElement.querySelectorAll(
      '.datatable-tree-button'
    ) as NodeList;
    dropdownButtons.forEach((node) => {
      this.renderer.addClass(node, 'btn');
      this.renderer.addClass(node, 'btn-sm');
      this.renderer.addClass(node, 'mr-2');
    });
  }

  onTreeAction(event: any) {
    const index = event.rowIndex;
    const row = event.row;
    if (row.treeStatus === 'collapsed') {
      row.treeStatus = 'expanded';
      this.treeStatus.onTreeAction(row, 'expand');
    } else {
      row.treeStatus = 'collapsed';
      this.treeStatus.onTreeAction(row, 'collapse');
    }
    this.TableGenerator.updateExpandedRows(this.treeStatus.expandedRows);
  }
}
