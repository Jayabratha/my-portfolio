export class SearchResult {
    name: string;
    type: string;
    thumbLink: string;
    desc: string;
    src: any;

    constructor(name, type, thumbLink, desc, src) {
        this.name = name;
        this.type = type;
        this.thumbLink = thumbLink;
        this.desc = desc;
        this.src = src;
    }
}