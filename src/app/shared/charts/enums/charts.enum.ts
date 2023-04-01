export enum DaysOptions {
  all = 'all',
  weekdays = 'weekdays',
  weekend = 'weekend',
}

export enum DailyProfileModeOptions {
  dailyAverage = 'dailyAverage',
  dailyAverageByWeekday = 'dailyAverageByWeekday',
}

export enum EnergyUsageModeOptions {
  barChart = 'barChart',
  deltaBaseline = 'deltaBaseline',
  donut = 'donut',
}

export enum NormalizationOptions {
  energyNormByArea = 'energyNormByArea',
  energyNormByDegreeDay = 'energyNormByDegreeDay',
  none = 'none',
}

export enum BaselineOptions {
  energyBaselinePrevMonth = 'energyBaselinePrevMonth',
  energyBaselinePrevYear = 'energyBaselinePrevYear',
  none = 'none',
}

export interface DailyProfileOptions {
  days: DaysOptions;
  mode: DailyProfileModeOptions;
  norms: NormalizationOptions[];
  point: string;
  includeSubmeters: boolean;
  rollup: {
    fold: string;
    interval: string;
  };
  baseline: BaselineOptions | string;
}

export interface EnergyUsageOptions {
  mode: EnergyUsageModeOptions;
  norms: NormalizationOptions[];
  point: string;
  rollup: {
    fold: string;
    interval: string;
  };
  baseline: BaselineOptions | string;
}
