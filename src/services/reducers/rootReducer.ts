import { combineReducers } from 'redux';
import ingredientsReducer from '../slices/ingredientsSlice';
import constructorReducer from '../slices/constructorSlice';
import userReducer from '../slices/userSlice';
import orderReducer from '../slices/orderSlice';
import feedReducer from '../slices/feedSlice';
import historyOrdersReducer from '../slices/historyOrdersSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  constructorBurger: constructorReducer,
  user: userReducer,
  order: orderReducer,
  feed: feedReducer,
  historyOrders: historyOrdersReducer
});