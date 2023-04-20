import { Component, OnInit } from '@angular/core';
import { RequestReadService } from './core/services/requests/read/request-read.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private ping: RequestReadService) {
    this.ping.ping();
  }
  ngOnInit(): void {}
}
