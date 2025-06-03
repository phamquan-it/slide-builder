enum SlideElementType {
    SHAPE = 'shape',
    IMAGE = 'image',
    TEXT = 'text',
    LIST = 'list'
}
interface SlideElement {
    key?: string;
    id: string;
    x: number;
    y: number;
    w?: number;
    h?: number;
    name?: string;
    type: SlideElementType;
    content: string; // For image, base64 string
    fontSize: number;
    fontWeight: 'normal' | 'bold';
    color?: string;
};
interface SlidesState {
    id: number;
    name: string;
    content: string;
    backgroundColor?: string;
    backgroundImage?: string;
    data: SlideElement[];
    selected: boolean
}

