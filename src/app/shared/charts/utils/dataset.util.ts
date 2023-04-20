import { ChartDataset, ChartType } from 'chart.js';
import { HGrid, HNum, HRef } from 'haystack-core';
import { CHART_COLOR } from './chart-utils';
import { chartjsType, getChartType } from './type.utils';
import { generateTitle } from './chart-title.utils';

export function generateDatasetsArray(
  reqResponse: HGrid,
  colors: string[]
): ChartDataset[] {
  if (reqResponse.isEmpty()) return [];
  if (getChartType(reqResponse) === 'ranking')
    return generatePieDataset(reqResponse, colors);
  if (
    getChartType(reqResponse) === 'bar' ||
    getChartType(reqResponse) === 'line'
  )
    return generateTimeseriesDataset(reqResponse, colors);
  else return generatePieDataset(reqResponse, colors);
}

function generateTimeseriesDataset(
  reqResponse: HGrid,
  colors: string[]
): ChartDataset[] {
  const CHART_DATASETS: ChartDataset[] = [];
  let colorCounter = 0;

  for (let i = 0; i < reqResponse.getColumnsLength(); i++) {
    if (reqResponse.getColumn(i)?.name === 'ts') continue;

    const label: string = generateLabelName(reqResponse, i);

    const generatedColors = generateColors(colorCounter, colors);

    const TYPE: ChartType = reqResponse.getColumn(i)?.meta.has('chartType')
      ? (reqResponse
          .getColumn(i)
          ?.meta.get('chartType')
          ?.toString() as ChartType)
      : chartjsType(reqResponse);

    colorCounter++;

    const CHART_DATASET: ChartDataset = {
      data: generateDataByColumnIndex(reqResponse, i),
      label: label,
      type: TYPE ?? 'bar',
      pointRadius: 0,
      borderWidth: 2,
      animation: {
        duration: 900,
      },
      pointBackgroundColor: generatedColors.solidColor,
      backgroundColor: generatedColors.transparentColor,
      borderColor: generatedColors.solidColor,
      hoverBackgroundColor: generatedColors.hoverColors,
      hoverBorderColor: generatedColors.hoverColors,
    };
    CHART_DATASETS.push(CHART_DATASET);
  }
  return CHART_DATASETS;
}

function generatePieDataset(
  reqResponse: HGrid,
  colors: string[]
): ChartDataset[] {
  const CHART_DATASET: ChartDataset = {
    label: generateTitle(reqResponse).plugins?.title?.text?.toString() || '',
    data: [],
    pointRadius: 0,
    borderWidth: 1,
    animation: {
      duration: 900,
    },
  };

  const colorsArray = {
    pointBackgroundColor: [] as string[],
    backgroundColor: [] as string[],
    borderColor: [] as string[],
    hoverBackgroundColor: [] as string[],
    hoverBorderColor: [] as string[],
  };

  reqResponse.reorderColumns(sortValuesDescOrder(reqResponse));

  for (let i = 0; i < reqResponse.getColumnsLength(); i++) {
    const columnName = reqResponse.getColumnNames()[i];
    if (
      typeof reqResponse.getRows()[0].get(columnName)?.toString() ===
      'undefined'
    )
      continue;

    const generatedColors = generateColors(i, colors);

    CHART_DATASET.data.push(generateDataByColumnIndex(reqResponse, i)[0]);
    colorsArray.pointBackgroundColor.push(generatedColors.solidColor);
    colorsArray.backgroundColor.push(generatedColors.transparentColor);
    colorsArray.borderColor.push(generatedColors.solidColor);
    colorsArray.hoverBackgroundColor.push(generatedColors.hoverColors);
    colorsArray.hoverBorderColor.push(generatedColors.hoverColors);
  }

  return [
    {
      ...CHART_DATASET,
      pointBackgroundColor: colorsArray.pointBackgroundColor,
      backgroundColor: colorsArray.backgroundColor,
      borderColor: colorsArray.borderColor,
      hoverBackgroundColor: colorsArray.hoverBackgroundColor,
      hoverBorderColor: colorsArray.hoverBorderColor,
    },
  ];
}

function generateDataByColumnIndex(grid: HGrid, index: number): number[] {
  const COLUMN_NAME = grid.getColumn(index)?.name;
  const COLUMN_TYPE = grid.getColumn(index)?.meta.get('kind')?.toString();
  if (COLUMN_TYPE === 'Number' && COLUMN_NAME) {
    return grid
      .listBy<HNum>(COLUMN_NAME)
      .map((value) => calculatePrecision(value));
  } else return [0];
}

function sortValuesDescOrder(reqResponse: HGrid): string[] {
  const columnNames = reqResponse.getColumnNames();
  const columnValues = reqResponse.getRows()[0].values;

  let valuesObject = columnNames.map(function (value: string, index: number) {
    const formattedValue = columnValues[index] as HNum;
    return {
      name: value,
      value: formattedValue?.value || 0,
    };
  });
  const sortedColumns: string[] = [];
  valuesObject
    .sort((a, b) => b.value - a.value)
    .forEach((el) => sortedColumns.push(el.name));

  return sortedColumns;
}

function calculatePrecision(val: HNum): number {
  if (val.value < 1) return +Number(val.value).toFixed(3);
  else if (val.value < 10) return +Number(val.value).toFixed(2);
  else return +Number(val.value).toFixed(1);
}

function generateColors(index: number, colors: string[]) {
  const SOLID_COLOR =
    typeof colors[index] !== 'undefined' ? colors[index] : CHART_COLOR[index];

  const TRANSPARENT_COLOR = SOLID_COLOR.replace('rgb', 'rgba').replace(
    ')',
    ', 0.7)'
  );
  const HOVER_COLOR = SOLID_COLOR.replace('rgb', 'rgba').replace(')', ', 0.7)');
  const AREA_COLOR = SOLID_COLOR.replace('rgb', 'rgba').replace(')', ', 0.1)');

  return {
    solidColor: SOLID_COLOR,
    transparentColor: TRANSPARENT_COLOR,
    hoverColors: HOVER_COLOR,
    areaColor: AREA_COLOR,
  };
}

export function generateLabelName(reqResponse: HGrid, i: number): string {
  let label: string = '';
  const column = reqResponse.getColumn(i);
  label = column?.meta?.toDis() ?? label;
  if (column?.name.startsWith('v'))
    label = column.meta?.get<HRef>('equipRef')?.dis ?? column.name;

  return label;
}
