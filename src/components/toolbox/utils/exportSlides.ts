// utils/exportSlides.ts
export const exportSlidesToJson = (slides: SlidesState[]) => {
    const json = JSON.stringify(slides, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'slides.json';
    a.click();

    URL.revokeObjectURL(url);
};

