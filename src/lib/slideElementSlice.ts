import { arrayMove } from '@dnd-kit/sortable';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


const initialState: SlideElement[] = [];

const slideElementSlice = createSlice({
    name: 'sliceElements',
    initialState,
    reducers: {
        setElements: (state, action: PayloadAction<SlideElement[]>) => {
            return action.payload;
        },
        addElement: (state, action: PayloadAction<SlideElement>) => {
            state.push(action.payload);
        },
        updateElement: (state, action: PayloadAction<SlideElement>) => {
            const index = state.findIndex(el => el.id === action.payload.id);
            if (index !== -1) {
                state[index] = action.payload;
            }
        },
        removeElement: (state, action: PayloadAction<string>) => {
            return state.filter(el => el.id !== action.payload);
        },
        clearElements: () => {
            return [];
        },
        deleteElement: (state, action: PayloadAction<string>) => {
            // Remove the element with the specified ID
            const filtered = state.filter(el => el.id !== action.payload);
            // Reassign IDs from 1 to n as strings
            return filtered.map((el, index) => ({
                ...el,
                id: (index + 1).toString(),
            }));
        },
        reorderElements: (
            state,
            action: PayloadAction<{ oldIndex: number; newIndex: number }>
        ) => {
            return arrayMove(state, action.payload.oldIndex, action.payload.newIndex);
        },
    },
});

export const {
    setElements,
    updateElement,
    removeElement,
    clearElements,
    addElement,
    deleteElement,
    reorderElements
} = slideElementSlice.actions;

const slideElementReducer = slideElementSlice.reducer
export default slideElementReducer
