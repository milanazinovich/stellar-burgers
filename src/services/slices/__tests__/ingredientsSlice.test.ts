import ingredientsReducer, { fetchIngredients } from '../ingredientsSlice';
import { TIngredient } from '@utils-types';

// Моковые данные ингредиента
const mockIngredient: TIngredient = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
};

const mockIngredients: TIngredient[] = [mockIngredient];

describe('Тестирование редьюсера ingredientsSlice', () => {
  const initialState = {
    ingredients: [],
    isLoading: false,
    error: null
  };

  it('должен вернуть начальное состояние при передаче undefined и неизвестного экшена', () => {
    const unknownAction = { type: 'UNKNOWN' };
    const result = ingredientsReducer(undefined, unknownAction as any);
    expect(result).toEqual(initialState);
  });

  it('должен установить isLoading в true при fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const result = ingredientsReducer(initialState, action);
    expect(result.isLoading).toBe(true);
    expect(result.error).toBeNull();
  });

  it('должен сохранить ингредиенты и установить isLoading в false при fetchIngredients.fulfilled', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const result = ingredientsReducer(initialState, action);
    expect(result.isLoading).toBe(false);
    expect(result.ingredients).toEqual(mockIngredients);
  });

  it('должен установить ошибку и isLoading в false при fetchIngredients.rejected', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: 'Ошибка загрузки' }
    };
    const result = ingredientsReducer(initialState, action);
    expect(result.isLoading).toBe(false);
    expect(result.error).toBe('Ошибка загрузки');
  });

  it('должен корректно обрабатывать последовательность экшенов: pending -> fulfilled', () => {
    let state = ingredientsReducer(initialState, {
      type: fetchIngredients.pending.type
    });
    expect(state.isLoading).toBe(true);

    state = ingredientsReducer(state, {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    });
    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0].name).toBe('Краторная булка N-200i');
  });

  it('должен корректно обрабатывать последовательность экшенов: pending -> rejected', () => {
    let state = ingredientsReducer(initialState, {
      type: fetchIngredients.pending.type
    });
    expect(state.isLoading).toBe(true);

    state = ingredientsReducer(state, {
      type: fetchIngredients.rejected.type,
      error: { message: 'Network Error' }
    });
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Network Error');
    expect(state.ingredients).toHaveLength(0);
  });
});
