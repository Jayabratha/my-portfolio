import { HeaderState } from './header-state.enum';

export interface Header {
    state: HeaderState;
    showMenu: boolean;
    showSearch: boolean;
}