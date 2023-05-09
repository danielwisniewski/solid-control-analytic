import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import packageJson from '../../../../../package.json';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent implements OnInit {
  test: Date = new Date();
  constructor() {}
  version: string = packageJson.version;
  ngOnInit(): void {}
}
