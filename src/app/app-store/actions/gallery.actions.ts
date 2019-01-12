import { Action } from '@ngrx/store';
import { ArtImage } from '../../models/art-image.model';


export const UPDATE_GALLERY_LIST = '[GALLERY] Update Gallery List';
export const UPDATE_CURRENT_ITEM = '[GALLERY] Update Current Item';
export const UPDATE_CURRENT_ITEM_DIMESNION = '[GALLERY] Update Current Item Dimension';

export class UpdateGalleryList implements Action {
    readonly type = UPDATE_GALLERY_LIST;
    constructor(public payload: Array<ArtImage>) {}
}

export class UpdateCurrentItem implements Action {
    readonly type = UPDATE_CURRENT_ITEM;
    constructor(public payload: ArtImage) {}
}

export class UpdateCurrentItemDimension implements Action {
    readonly type = UPDATE_CURRENT_ITEM_DIMESNION;
    constructor(public payload: DOMRect) {}
}

export type Actions = UpdateGalleryList | UpdateCurrentItem | UpdateCurrentItemDimension;