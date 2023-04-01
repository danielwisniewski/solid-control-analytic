import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
} from '@angular/core';

@Component({
  selector: 'app-card-stats',
  templateUrl: './card-stats.component.html',
  styleUrls: ['./card-stats.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardStatsComponent implements OnInit {
  @Input() title: string = '';
  @Input() value: string = '';
  @Input() description: string = '';
  @Input() icon: string = 'icon-chat-33';
  @Input() iconColor: string = 'icon-info';

  constructor() {}

  ngOnInit(): void {}
}
