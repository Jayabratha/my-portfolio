export class NavItem {
    id: string;
    label: string;
    link: string;
    visible: boolean;

    constructor(id, label, link, visible = false) {
        this.id = id;
        this.label = label;
        this.link = link;
        this.visible = visible
    }
}