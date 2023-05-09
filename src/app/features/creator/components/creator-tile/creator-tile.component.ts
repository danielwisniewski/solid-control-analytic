import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import {
  PageConfig,
  Tile,
} from '../../../dashboard/interfaces/dashboard.interface';
import { DashboardStore } from '../../../dashboard/store/dashboard.store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-creator-tile',
  templateUrl: './creator-tile.component.html',
  styleUrls: ['./creator-tile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreatorTileComponent implements OnInit {
  @Input() tile: Tile | undefined;
  @Input() height: number = 30;
  sub: Subscription;
  constructor(private store: DashboardStore, private cdr: ChangeDetectorRef) {
    this.sub = this.store.activeDashboard$.subscribe((res) => {
      this.pageConfig = res;
      this.cdr.detectChanges();
    });
  }

  pageConfig: PageConfig | undefined;

  change() {
    if (!!this.pageConfig && !!this.tile) {
      const tileIndex = this.pageConfig?.layout.tiles.findIndex(
        (r) => r.tile == this.tile?.tile
      );
      this.pageConfig.layout.tiles[tileIndex] = this.tile;
      this.store.activeDashboard$.next({ ...this.pageConfig });
    }
  }

  onRemovePanel() {
    if (!!this.pageConfig && !!this.tile) {
      const tileIndex = this.pageConfig?.layout.tiles.findIndex(
        (r) => r.tile == this.tile?.tile
      );
      this.pageConfig.layout.tiles.splice(tileIndex, 1);
      this.store.activeDashboard$.next(this.pageConfig);
    }
  }

  ngOnInit(): void {}
}
