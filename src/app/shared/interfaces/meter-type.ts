export interface MeterType {
  color: string;
  meterTypeTag: string;
  usagePointTag: string;
  usageTitle: string;
  energyUsagePoint: string;
  energyCostPoint: string;
}

export interface MeterTypes {
  elecMeter: MeterType;
  waterMeter: MeterType;
  gasMeter: MeterType;
  heatMeter: MeterType;
}
