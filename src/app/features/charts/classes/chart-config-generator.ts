import { ChartConfiguration, ChartOptions } from 'chart.js';
import { HGrid } from 'haystack-core';

export class ChartConfigGenerator {
  private originalGrid: HGrid;
  constructor(grid: HGrid) {
    this.originalGrid = grid;
  }

  public readonly chartConfig: ChartConfiguration = {
    data: {
      labels: [],
      datasets: [],
    },
    options: {},
    type: 'bar',
  };

  private chartOptions: ChartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    animation: {
      duration: 900,
    },
  };

  private dataset() {
    this.originalGrid.toList();
  }
}
