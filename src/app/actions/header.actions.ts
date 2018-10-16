import { Action } from '@ngrx/store';
import { HeaderState } from '../models/header-state.enum';

export const UPDATE_STATE = '[HEADER] Update State';
export const TOGGLE_MENU = '[HEADER] Toggle Menu';
export const TOGGLE_SEARCH = '[HEADER] Toggle Search';

export class UpdateState implements Action {
    readonly type = UPDATE_STATE;
    constructor(public payload: HeaderState) { }
}

export class ToggleMenu implements Action {
    readonly type = TOGGLE_MENU;
    constructor(public payload: boolean) { }
}

export class ToggleSearch implements Action {
    readonly type = TOGGLE_SEARCH;
    constructor(public payload: boolean) { }
}

export type Actions = UpdateState | ToggleMenu | ToggleSearch;