import {
  Component,
  ChangeDetectionStrategy,
  Input,
  ElementRef,
  Renderer2,
  ViewChild,
} from '@angular/core';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { PanelConfigDialogComponent } from 'src/app/features/creator/components/panel-config-dialog/panel-config-dialog.component';
import { Panel } from '../../interfaces/panel.interface';
import { AppState } from 'src/app/state';
import { Store } from '@ngrx/store';
import {
  changeActivePanelId,
  downloadPanelReport,
  fetchPanelData,
} from 'src/app/core/store/pages/panels.actions';
import { Subscription, tap } from 'rxjs';

@Component({
  selector: 'app-page-panel',
  templateUrl: './page-panel.component.html',
  styleUrls: ['./page-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PagePanelComponent {
  constructor(
    private modal: MatDialog,
    private store: Store<AppState>,
    private renderer: Renderer2
  ) {}

  @Input() panel: Panel | undefined;
  @Input() height: number = 30;
  @Input() isCreatorMode: boolean = false;

  @ViewChild('heading', { static: false }) headingRef: ElementRef | undefined;

  configDialogSub: Subscription | undefined;

  onDownload() {
    if (!!this.panel && !!this.panel.panelId)
      this.store.dispatch(downloadPanelReport({ id: this.panel.panelId }));
  }

  ngOnInit() {
    if (
      !!this.panel &&
      !!this.panel.panelId &&
      !!this.panel.meta?.skipUpdateOnTimerangeChange
    )
      this.store.dispatch(fetchPanelData({ id: this.panel.panelId }));
  }

  ngAfterViewChecked() {
    this.adjustFontSizeIfNeeded();
  }

  adjustFontSizeIfNeeded() {
    if (!!this.headingRef) {
      const headingElement = this.headingRef.nativeElement;
      if (headingElement.offsetWidth < headingElement.scrollWidth) {
        const scaleFactor =
          headingElement.offsetWidth / headingElement.scrollWidth;
        const originalFontSize = parseFloat(
          window.getComputedStyle(headingElement).fontSize
        );
        let newFontSize = originalFontSize * scaleFactor;
        if (newFontSize < 16) newFontSize = 16;
        if (newFontSize > 20) newFontSize = 20;
        this.renderer.setStyle(headingElement, 'fontSize', `${newFontSize}px`);
      }
    }
  }

  openDialog(): void {
    if (!this.panel) return;
    this.store.dispatch(changeActivePanelId({ id: this.panel.panelId }));
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.hasBackdrop = true;
    dialogConfig.position = {
      top: '5vh',
      left: '40vw',
    };
    dialogConfig.width = '600px';
    dialogConfig.height = '800px';
    dialogConfig.data = {
      tile: { ...this.panel },
    };
    dialogConfig.panelClass = 'config-dialog';
    const dialogRef = this.modal.open(PanelConfigDialogComponent, dialogConfig);

    this.configDialogSub = dialogRef
      .afterClosed()
      .pipe(
        tap(() => this.store.dispatch(changeActivePanelId({ id: undefined })))
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.configDialogSub?.unsubscribe();
  }
}
