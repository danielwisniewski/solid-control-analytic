import { Component, OnInit } from '@angular/core';
import { Meter, MetersDataGeneratorService } from './meters-data-generator.service';


@Component({
  templateUrl: './meters-layout.component.html',
  styleUrls: ['./meters-layout.component.scss'],
})
export class MetersLayoutComponent implements OnInit {
  meterList: Meter[] = [];
  constructor(private mdg: MetersDataGeneratorService) { }

  ngOnInit(): void {
    this.meterList = this.mdg.getMetersData();
  }

}
