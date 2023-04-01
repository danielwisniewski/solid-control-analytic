export const METER_TYPE = {
  elecMeter: ElectricalMeter(),
  waterMeter: WaterMeter(),
  gasMeter: GasMeter(),
  heatMeter: HeatMeter(),
};

function ElectricalMeter() {
  const COLOR: string = 'rgb(255,215,0)';
  const METER_TYPE_TAG = 'elec';
  const USAGE_POINT_TAG: string = 'sensor and energy';
  const COST_POINT_TAG: string = 'elecCost';
  const USAGE_TITLE: string = 'Energia elektryczna';
  const ENERGY_USAGE_POINT: string = `equipRef->${METER_TYPE_TAG} and ${USAGE_POINT_TAG}`;
  const ENERGY_COST_POINT: string = `${COST_POINT_TAG} and equipRef->${METER_TYPE_TAG} and sensor`;

  return {
    color: COLOR,
    meterTypeTag: METER_TYPE_TAG,
    usagePointTag: USAGE_POINT_TAG,
    usageTitle: USAGE_TITLE,
    energyUsagePoint: ENERGY_USAGE_POINT,
    energyCostPoint: ENERGY_COST_POINT,
  };
}

function WaterMeter() {
  const COLOR: string = 'rgb(29, 140, 248)';
  const METER_TYPE_TAG: string = 'water';
  const USAGE_POINT_TAG: string = 'sensor and volume';
  const ENERGY_USAGE_POINT: string = `equipRef->${METER_TYPE_TAG} and ${USAGE_POINT_TAG}`;
  const USAGE_TITLE: string = 'Woda';
  const COST_POINT_TAG: string = 'waterCost';
  const ENERGY_COST_POINT: string = `${COST_POINT_TAG} and equipRef->${METER_TYPE_TAG} and sensor`;

  return {
    color: COLOR,
    meterTypeTag: METER_TYPE_TAG,
    usagePointTag: USAGE_POINT_TAG,
    usageTitle: USAGE_TITLE,
    energyUsagePoint: ENERGY_USAGE_POINT,
    energyCostPoint: ENERGY_COST_POINT,
  };
}

function GasMeter() {
  const COLOR: string = 'rgb(242, 142, 44)';
  const METER_TYPE_TAG: string = 'naturalGas';
  const USAGE_POINT_TAG: string = 'sensor and volume';
  const USAGE_TITLE: string = 'Gaz';
  const ENERGY_USAGE_POINT: string = `equipRef->${METER_TYPE_TAG} and ${USAGE_POINT_TAG}`;
  const COST_POINT_TAG: string = 'naturalGasCost';
  const ENERGY_COST_POINT: string = `${COST_POINT_TAG} and equipRef->${METER_TYPE_TAG} and sensor`;
  return {
    color: COLOR,
    meterTypeTag: METER_TYPE_TAG,
    usagePointTag: USAGE_POINT_TAG,
    usageTitle: USAGE_TITLE,
    energyUsagePoint: ENERGY_USAGE_POINT,
    energyCostPoint: ENERGY_COST_POINT,
  };
}

function HeatMeter() {
  const COLOR: string = 'rgb(236, 37, 13)';
  const METER_TYPE_TAG: string = 'heat';
  const USAGE_POINT_TAG: string = 'sensor and volume';
  const USAGE_TITLE: string = 'Energia cieplna';
  const ENERGY_USAGE_POINT: string = `equipRef->${METER_TYPE_TAG} and ${USAGE_POINT_TAG}`;
  const COST_POINT_TAG: string = 'heatCost';
  const ENERGY_COST_POINT: string = `${COST_POINT_TAG} and equipRef->${METER_TYPE_TAG} and sensor`;

  return {
    color: COLOR,
    meterTypeTag: METER_TYPE_TAG,
    usagePointTag: USAGE_POINT_TAG,
    usageTitle: USAGE_TITLE,
    energyUsagePoint: ENERGY_USAGE_POINT,
    energyCostPoint: ENERGY_COST_POINT,
  };
}
