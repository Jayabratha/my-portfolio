import { Header } from '../models/header.model';
import { Gallery } from '../models/gallery.model';

export interface AppState {
    readonly headerState: Header;
    readonly gallery: Gallery;
}