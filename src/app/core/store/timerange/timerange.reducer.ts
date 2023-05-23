import { createReducer, on } from '@ngrx/store';
import { setActiveTimerange } from './timerange.actions';
import { DateTime } from 'luxon';

export interface TimerangeState {
  activeTimerange: string;
}

export const initialState: TimerangeState = {
  activeTimerange: ``,
};

export const timerangeReducer = createReducer(
  initialState,
  on(setActiveTimerange, (state, { dates }) => {
    if (!!localStorage.getItem('activeTimerange') && dates === '') {
      return {
        ...state,
        activeTimerange: localStorage.getItem('activeTimerange') as string,
      };
    } else if (dates === '') {
      return {
        ...state,
        activeTimerange: `toSpan(${DateTime.local()
          .toFormat('yyyy-MM-dd')
          .toString()})`,
      };
    }

    return {
      ...state,
      activeTimerange: dates,
    };
  })
);
