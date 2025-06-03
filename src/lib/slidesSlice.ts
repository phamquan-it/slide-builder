import { createSlice, PayloadAction } from '@reduxjs/toolkit';
enum SlideElementType {
    SHAPE = 'shape',
    IMAGE = 'image',
    TEXT = 'text',
    LIST = 'list'
}


const initialState: SlidesState[] = [
    {
        id: 1,
        name: 'Getting started',
        content: 'something',
        backgroundColor: 'blue',
        data: [
            { id: '1', x: 30, y: 20, w: 900, h: 50, type: SlideElementType.SHAPE, color: '#FFD700', content: 'rect', fontSize: 18, fontWeight: 'normal' },
            { id: '2', x: 300, y: 30, w: 400, h: 50, type: SlideElementType.TEXT, content: 'Getting started', fontSize: 18, fontWeight: 'bold' },
        ],
        selected: true
    },
    {
        id: 2,
        name: 'Test',
        content: 'something',
        data: [
            { id: '1', x: 100, y: 200, w: 100, h: 20, type: SlideElementType.TEXT, content: 'Test Next.js!', fontSize: 18, fontWeight: 'normal' },
            { id: '2', x: 200, y: 200, w: 100, h: 50, type: SlideElementType.SHAPE, content: 'rect', fontSize: 18, fontWeight: 'normal' },
        ],
        selected: false
    }

];

const slidesSlice = createSlice({
    name: 'slides',
    initialState,
    reducers: {
        setSelectedSlide: (state, action: PayloadAction<number>) => {
            state.forEach((slide) => {
                slide.selected = slide.id === action.payload;
            });
        },
        setAllSlides: (state, action: PayloadAction<SlidesState[]>) => {
            return action.payload;
        },

        addSlideDeck: (state, action: PayloadAction<SlidesState>) => {
            state.push(action.payload);
        },

        deleteSlideDeck: (state, action: PayloadAction<number>) => {
            state.splice(action.payload, 1);
        },
        reorderSlides(state, action: PayloadAction<{ oldIndex: number; newIndex: number }>) {
            const { oldIndex, newIndex } = action.payload;
            if (oldIndex !== newIndex) {
                const [moved] = state.splice(oldIndex, 1);
                state.splice(newIndex, 0, moved);
            }
        },
        updateSlideDeck: (
            state,
            action: PayloadAction<{ index: number; deck: SlidesState }>
        ) => {
            const { index, deck } = action.payload;
            if (state[index]) {
                state[index] = deck;
            }
        },

        addSlideToDeck: (
            state,
            action: PayloadAction<{ deckIndex: number; slide: SlideElement }>
        ) => {
            const { deckIndex, slide } = action.payload;
            if (state[deckIndex]) {
                state[deckIndex].data.push(slide);
            }
        },

        updateSlideInDeck: (
            state,
            action: PayloadAction<{
                deckIndex: number;
                slideIndex: number;
                slide: SlideElement;
            }>
        ) => {
            const { deckIndex, slideIndex, slide } = action.payload;
            if (state[deckIndex]?.data[slideIndex]) {
                state[deckIndex].data[slideIndex] = slide;
            }
        },
        updateDeckName: (
            state,
            action: PayloadAction<{ index: number; name: string }>
        ) => {
            if (state[action.payload.index]) {
                state[action.payload.index].name = action.payload.name;
            }
        },
        updateSlideBackground: (
            state,
            action: PayloadAction<{
                backgroundColor?: string;
                backgroundImage?: string;
            }>
        ) => {
            const selected = state.find((s) => s.selected);
            if (selected) {
                if (action.payload.backgroundColor !== undefined) {
                    selected.backgroundColor = action.payload.backgroundColor;
                }
                if (action.payload.backgroundImage !== undefined) {
                    selected.backgroundImage = action.payload.backgroundImage;
                }
            }
        },

    },
});

export const {
    setAllSlides,
    addSlideDeck,
    reorderSlides,
    deleteSlideDeck,
    updateSlideDeck,
    addSlideToDeck,
    updateSlideInDeck,
    updateDeckName,
    setSelectedSlide,
    updateSlideBackground
} = slidesSlice.actions;

export default slidesSlice.reducer;

