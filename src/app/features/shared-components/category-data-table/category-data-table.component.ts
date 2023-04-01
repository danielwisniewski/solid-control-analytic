import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

export interface DataTablePoint {
  name: string,
  value: string,
  isWritable?: boolean,
  isAlarm?: boolean,
  isOverridden?: boolean
}

@Component({
  selector: 'app-category-data-table',
  templateUrl: './category-data-table.component.html',
  styleUrls: ['./category-data-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryDataTableComponent implements OnInit {
  @Input() categoryName: string = "Punkty";
  @Input() points: DataTablePoint[] = [];
  constructor() { }

  ngOnInit(): void { }
}
