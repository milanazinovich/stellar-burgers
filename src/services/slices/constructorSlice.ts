import { createSlice, createAction, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { TIngredient, TConstructorIngredient } from '@utils-types';

type TConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

export const addIngredient = createAction(
  'constructor/addIngredient',
  (ingredient: TIngredient) => ({
    payload: {
      ...ingredient,
      id: uuidv4()
    }
  })
);

export const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    removeIngredient: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload.id
      );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ index: number; direction: 'up' | 'down' }>
    ) => {
      const { index, direction } = action.payload;
      const newIngredients = [...state.ingredients];

      if (direction === 'up' && index > 0) {
        const temp = newIngredients[index - 1];
        newIngredients[index - 1] = newIngredients[index];
        newIngredients[index] = temp;
      } else if (direction === 'down' && index < newIngredients.length - 1) {
        const temp = newIngredients[index + 1];
        newIngredients[index + 1] = newIngredients[index];
        newIngredients[index] = temp;
      }

      state.ingredients = newIngredients;
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(
      addIngredient,
      (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      }
    );
  }
});

export const { removeIngredient, moveIngredient, clearConstructor } =
  constructorSlice.actions;
export default constructorSlice.reducer;
