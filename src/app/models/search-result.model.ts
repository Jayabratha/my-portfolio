export class SearchResult {
    title: string;
    type: string;
    thumbLink: string;
    desc: string;
    src: any;

    constructor(title, type, thumbLink, desc, src) {
        this.title = title;
        this.type = type;
        this.thumbLink = thumbLink;
        this.desc = desc;
        this.src = src;
    }
}