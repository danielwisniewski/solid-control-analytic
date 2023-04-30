import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-dashboard-top-bar',
  templateUrl: './dashboard-top-bar.component.html',
  styleUrls: ['./dashboard-top-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardTopBarComponent implements OnInit {
  @Input() hasSiteSelector: boolean = true;
  @Input() hasTimerangeSelector: boolean = true;

  constructor() {}

  ngOnInit(): void {}
}
