import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from '../constructorSlice';
import { TIngredient, TConstructorIngredient } from '@utils-types';

// Моковые данные (без поля __v!)
const mockBun: TIngredient = {
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

const mockIngredient: TIngredient = {
  _id: '643d69a5c3f7b9001cfa093d',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
};

const mockSauce: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0942',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
};

describe('Тестирование редьюсера constructorSlice', () => {
  // ✅ Правильно типизированное начальное состояние
  const initialState = {
    bun: null as TIngredient | null,
    ingredients: [] as TConstructorIngredient[]
  };

  it('должен вернуть начальное состояние при передаче undefined и неизвестного экшена', () => {
    const unknownAction = { type: 'UNKNOWN' };
    const result = constructorReducer(undefined, unknownAction as any);
    expect(result).toEqual(initialState);
  });

  describe('addIngredient', () => {
    it('должен добавить булку при добавлении ингредиента типа bun', () => {
      const action = addIngredient(mockBun);
      const result = constructorReducer(initialState, action);
      expect(result.bun).toEqual(action.payload);
      expect(result.bun?.type).toBe('bun');
      expect(result.ingredients).toHaveLength(0);
    });

    it('должен добавить начинку в массив ingredients', () => {
      const action = addIngredient(mockIngredient);
      const result = constructorReducer(initialState, action);
      expect(result.bun).toBeNull();
      expect(result.ingredients).toHaveLength(1);
      expect(result.ingredients[0].name).toBe(
        'Биокотлета из марсианской Магнолии'
      );
    });

    it('должен сгенерировать уникальный id при добавлении ингредиента', () => {
      const action1 = addIngredient(mockIngredient);
      const action2 = addIngredient(mockIngredient);
      expect(action1.payload.id).toBeDefined();
      expect(action2.payload.id).toBeDefined();
      expect(action1.payload.id).not.toBe(action2.payload.id);
    });

    it('должен заменить булку при добавлении новой булки', () => {
      const stateWithBun = constructorReducer(
        initialState,
        addIngredient(mockBun)
      );
      const newBun: TIngredient = {
        ...mockBun,
        _id: 'new-bun-id',
        name: 'Новая булка'
      };
      const result = constructorReducer(stateWithBun, addIngredient(newBun));
      expect(result.bun?.name).toBe('Новая булка');
      expect(result.bun?._id).toBe('new-bun-id');
    });
  });

  describe('removeIngredient', () => {
    it('должен удалить ингредиент по id', () => {
      const stateWithIngredients = constructorReducer(
        constructorReducer(initialState, addIngredient(mockIngredient)),
        addIngredient(mockSauce)
      );

      const ingredientToRemove = stateWithIngredients.ingredients[0];
      const action = removeIngredient(ingredientToRemove);
      const result = constructorReducer(stateWithIngredients, action);

      expect(result.ingredients).toHaveLength(1);
      expect(result.ingredients[0].name).toBe('Соус Spicy-X');
    });

    it('не должен удалять булку через removeIngredient', () => {
      const stateWithBun = constructorReducer(
        initialState,
        addIngredient(mockBun)
      );
      const fakeIngredient: TConstructorIngredient = {
        ...mockIngredient,
        id: 'fake-id'
      };
      const result = constructorReducer(
        stateWithBun,
        removeIngredient(fakeIngredient)
      );
      expect(result.bun).toBeDefined();
    });
  });

  describe('moveIngredient', () => {
    it('должен переместить ингредиент вверх', () => {
      let state = constructorReducer(
        initialState,
        addIngredient(mockIngredient)
      );
      state = constructorReducer(state, addIngredient(mockSauce));

      const action = moveIngredient({ index: 1, direction: 'up' });
      const result = constructorReducer(state, action);

      expect(result.ingredients[0].name).toBe('Соус Spicy-X');
      expect(result.ingredients[1].name).toBe(
        'Биокотлета из марсианской Магнолии'
      );
    });

    it('должен переместить ингредиент вниз', () => {
      let state = constructorReducer(
        initialState,
        addIngredient(mockIngredient)
      );
      state = constructorReducer(state, addIngredient(mockSauce));

      const action = moveIngredient({ index: 0, direction: 'down' });
      const result = constructorReducer(state, action);

      expect(result.ingredients[0].name).toBe('Соус Spicy-X');
      expect(result.ingredients[1].name).toBe(
        'Биокотлета из марсианской Магнолии'
      );
    });

    it('не должен перемещать первый элемент вверх', () => {
      let state = constructorReducer(
        initialState,
        addIngredient(mockIngredient)
      );
      state = constructorReducer(state, addIngredient(mockSauce));

      const action = moveIngredient({ index: 0, direction: 'up' });
      const result = constructorReducer(state, action);

      expect(result.ingredients[0].name).toBe(
        'Биокотлета из марсианской Магнолии'
      );
    });

    it('не должен перемещать последний элемент вниз', () => {
      let state = constructorReducer(
        initialState,
        addIngredient(mockIngredient)
      );
      state = constructorReducer(state, addIngredient(mockSauce));

      const action = moveIngredient({ index: 1, direction: 'down' });
      const result = constructorReducer(state, action);

      expect(result.ingredients[1].name).toBe('Соус Spicy-X');
    });
  });

  describe('clearConstructor', () => {
    it('должен очистить конструктор', () => {
      let state = constructorReducer(initialState, addIngredient(mockBun));
      state = constructorReducer(state, addIngredient(mockIngredient));
      state = constructorReducer(state, addIngredient(mockSauce));

      const action = clearConstructor();
      const result = constructorReducer(state, action);

      expect(result.bun).toBeNull();
      expect(result.ingredients).toHaveLength(0);
    });
  });

  describe('Комплексный сценарий', () => {
    it('должен корректно работать при сборке полного бургера', () => {
      let state = initialState;

      // Добавляем булку
      state = constructorReducer(state, addIngredient(mockBun));
      expect(state.bun?.name).toBe('Краторная булка N-200i');

      // Добавляем начинки
      state = constructorReducer(state, addIngredient(mockIngredient));
      state = constructorReducer(state, addIngredient(mockSauce));
      expect(state.ingredients).toHaveLength(2);

      // Перемещаем начинки
      state = constructorReducer(
        state,
        moveIngredient({ index: 1, direction: 'up' })
      );
      expect(state.ingredients[0].name).toBe('Соус Spicy-X');

      // Удаляем одну начинку
      const toRemove = state.ingredients[0];
      state = constructorReducer(state, removeIngredient(toRemove));
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0].name).toBe(
        'Биокотлета из марсианской Магнолии'
      );

      // Очищаем конструктор
      state = constructorReducer(state, clearConstructor());
      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(0);
    });
  });
});
