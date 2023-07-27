import { createReducer, on } from '@ngrx/store';
import { setActiveTimerange } from './timerange.actions';
import { DateTime } from 'luxon';

export interface TimerangeState {
  activeTimerange: string;
}

export const initialState: TimerangeState = {
  activeTimerange: '',
};

export const timerangeReducer = createReducer(
  initialState,
  on(setActiveTimerange, (state, { dates }) => {
    if (dates === 'processing...') {
      return {
        ...state,
        activeTimerange: `processing...`,
      };
    } else if (!!localStorage.getItem('activeTimerange') && dates === '') {
      return {
        ...state,
        activeTimerange: localStorage.getItem('activeTimerange') as string,
      };
    } else
      return {
        ...state,
        activeTimerange: dates,
      };
  })
);
