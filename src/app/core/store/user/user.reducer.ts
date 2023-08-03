import { createReducer, on } from '@ngrx/store';
import { setUsername } from './user.actions';

export interface UserState {
  username: string;
}

const initialState: UserState = {
  username: 'user',
};

export const userReducer = createReducer(
  initialState,
  on(setUsername, (state, { username }) => {
    return {
      ...state,
      username: username,
    };
  })
);
