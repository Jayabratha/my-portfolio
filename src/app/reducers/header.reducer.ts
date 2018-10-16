import { Action } from '@ngrx/store';
import { Header } from '../models/header.model';
import { HeaderState } from '../models/header-state.enum';
import * as HeaderActions from '../actions/header.actions';

const initialHeader: Header = {
    state: HeaderState.Initial,
    showMenu: false,
    showSearch: false
}

export function headerReducer(headerState: Header = initialHeader, action: HeaderActions.Actions) {
    console.log("Action Received", headerState, action);
    switch (action.type) {
        case HeaderActions.UPDATE_STATE:
            return { ...headerState, state: action.payload };

        case HeaderActions.TOGGLE_MENU:
            return { ...headerState, showMenu: action.payload };

        case HeaderActions.TOGGLE_SEARCH:
            return { ...headerState, showSearch: action.payload };

        default:
            return headerState;
    }

}

