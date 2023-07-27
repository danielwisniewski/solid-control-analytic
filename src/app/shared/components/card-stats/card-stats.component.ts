import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { HBool, HGrid, HStr } from 'haystack-core';

@Component({
  selector: 'app-card-stats',
  templateUrl: './card-stats.component.html',
  styleUrls: ['./card-stats.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardStatsComponent implements OnInit {
  title: string | undefined;
  showTitle: boolean = false;
  value: string | undefined;
  description: string = '';
  icon: string = 'icon-chat-33';
  iconColor: string = 'icon-info';

  footerVisible: boolean = false;
  differenceValue: string | undefined;
  arrowDirection: string | undefined;
  arrowColor: string | undefined;

  @Input() set data(value: HGrid | undefined | null) {
    const isError = !!value?.isEmpty() || !!value?.isError();
    this.title = isError
      ? value?.meta.get('noDataTitle')?.toString()
      : value?.meta.get('subtitle')?.toString();
    this.showTitle = isError
      ? true
      : !!value?.meta.get<HBool>('showSubtitle')?.value;

    this.value = value?.first?.get('value')?.toString();

    if (!!this.value) this.value = this.value.replace('_', '');

    this.footerVisible = !!value?.meta.get<HBool>('cardFooterVisible')?.value;

    this.icon = value?.meta.get<HStr>('cardIcon')?.toString() ?? 'icon-coins';
    this.iconColor =
      value?.meta.get<HStr>('cardIconColor')?.toString() ?? 'icon-warning';

    this.differenceValue = value?.first?.get('diff')?.toString();
    this.arrowDirection =
      value?.first?.get('arrowDirection')?.toString() == 'up'
        ? 'tim-icons icon-minimal-up'
        : value?.first?.get('arrowDirection')?.toString() == 'down'
        ? 'tim-icons icon-minimal-down'
        : undefined;

    this.arrowColor =
      value?.first?.get('arrowColor')?.toString() == 'green'
        ? 'text-success'
        : value?.first?.get('arrowColor')?.toString() == 'red'
        ? 'text-danger'
        : 'text-primary';

    this.description = value?.first?.get('desc')?.toString() ?? '';

    this.cdr.detectChanges();
  }
  @Input() height: string = '10';

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {}
}
