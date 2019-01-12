import { Gallery } from '../../models/gallery.model';
import * as GalleryActions from '../actions/gallery.actions';

const initialGallery: Gallery = {
    galleryList: [],
    currentItem: null,
    currentItemDimension: null
};

export function galleryReducer (galleryState: Gallery = initialGallery, action: GalleryActions.Actions) {
    switch (action.type) {
        case GalleryActions.UPDATE_GALLERY_LIST: {
            return {...galleryState, galleryList: action.payload}
        }
        case GalleryActions.UPDATE_CURRENT_ITEM: {
            return {...galleryState, currentItem: action.payload}
        }
        case GalleryActions.UPDATE_CURRENT_ITEM_DIMESNION: {
            console.log(action);
            return {...galleryState, currentItemDimension: action.payload}
        }
        default:
            return galleryState;
    }
}

