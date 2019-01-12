import { ArtImage } from './art-image.model';

export interface Gallery {
    galleryList: Array<ArtImage>,
    currentItem: ArtImage,
    currentItemDimension: DOMRect
}