import { Header } from '../../models/header.model';
import { HeaderState } from '../../models/header-state.enum';
import * as HeaderActions from '../actions/header.actions';

const initialHeader: Header = {
    state: HeaderState.Initial,
    showMenu: false,
    showSearch: false
}

export function headerReducer(header: Header = initialHeader, action: HeaderActions.Actions) {
    switch (action.type) {
        case HeaderActions.UPDATE_STATE:
            return { ...header, state: action.payload };

        case HeaderActions.TOGGLE_MENU:
            return { ...header, showMenu: action.payload };

        case HeaderActions.TOGGLE_SEARCH:
            return { ...header, showSearch: action.payload };

        default:
            return header;
    }

}

