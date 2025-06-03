import PptxGenJS from 'pptxgenjs';

export interface SlideElement {
    id: string;
    x: number;
    y: number;
    w?: number;
    h?: number;
    type: 'text' | 'shape' | 'image';
    content: string;
    fontSize: number;
    color?: string;
    fontWeight: 'normal' | 'bold';
}

export type Background = {
    type: 'color' | 'image';
    value: string;
};

const pxToInch = (px: number) => Number((px / 96).toFixed(2));

const exportToPptx = async (
    elements: SlideElement[],
    background?: Background
): Promise<Buffer> => {
    const pptx = new PptxGenJS();
    const slide = pptx.addSlide();

    if (background) {
        slide.background = { fill: background.value }
        ///   background.type === 'color'
        ///       ? { fill: background.value }
        ///       : { path: background.value };
    }

    slide.addText(
        [
            { text: 'Main Point', options: { bullet: true, fontSize: 20, bold: true } },
            { text: 'Sub Point A', options: { bullet: true, indentLevel: 1 } },
            { text: 'Sub Point B', options: { bullet: true, indentLevel: 1 } },
            { text: 'Final Point', options: { bullet: true } }
        ],
        { x: 0.5, y: 0.5, w: 9, h: 5, color: '000000' }
    );

    elements.forEach((el) => {
        const x = pxToInch(el.x);
        const y = pxToInch(el.y);
        const w = el.w ? pxToInch(el.w) : 2;
        const h = el.h ? pxToInch(el.h) : 1;

        if (el.type === 'text') {
            slide.addText(el.content, {
                x, y, w, h,
                fontSize: el.fontSize,
                bold: el.fontWeight === 'bold',
                align: 'center',
                valign: 'middle',
                color: el?.color ?? '000000',

            });
        } else if (el.type === 'shape') {
            let shapeType;
            switch (el.content) {
                case 'rect':
                    shapeType = pptx.ShapeType.rect;
                    break;
                case 'roundRect':
                    shapeType = pptx.ShapeType.roundRect;
                    break;
                case 'ellipse':
                    shapeType = pptx.ShapeType.ellipse;
                    break;
                case 'triangle':
                    shapeType = pptx.ShapeType.triangle;
                    break;
                case 'diamond':
                    shapeType = pptx.ShapeType.diamond;
                    break;
                case 'parallelogram':
                    shapeType = pptx.ShapeType.parallelogram;
                    break;
                case 'trapezoid':
                    shapeType = pptx.ShapeType.trapezoid;
                    break;
                case 'pentagon':
                    shapeType = pptx.ShapeType.pentagon;
                    break;
                case 'hexagon':
                    shapeType = pptx.ShapeType.hexagon;
                    break;
                case 'heptagon':
                    shapeType = pptx.ShapeType.heptagon;
                    break;
                case 'octagon':
                    shapeType = pptx.ShapeType.octagon;
                    break;
                case 'plus':
                    shapeType = pptx.ShapeType.plus;
                    break;
                case 'heart':
                    shapeType = pptx.ShapeType.heart;
                    break;
                case 'cube':
                    shapeType = pptx.ShapeType.cube;
                    break;
                case 'can':
                    shapeType = pptx.ShapeType.can;
                    break;
                case 'frame':
                    shapeType = pptx.ShapeType.frame;
                    break;
                case 'chord':
                    shapeType = pptx.ShapeType.chord;
                    break;
                case 'arc':
                    shapeType = pptx.ShapeType.arc;
                    break;
                default:
                    shapeType = pptx.ShapeType.rect;
            }
            slide.addShape(shapeType, {

                x, y, w, h,
                fill: { color: el.color ?? 'FFD700',  },
                line: { color: '000000' }, // optional border
            });
        } else if (el.type === 'image') {
            slide.addImage({
                data: el.content,
                x, y, w, h,
            });
        }
    });
    const buffer:any = await pptx.write({ outputType: 'nodebuffer' }); // 👈 Dành cho server
    return Buffer.from(buffer);
};

export default exportToPptx;

