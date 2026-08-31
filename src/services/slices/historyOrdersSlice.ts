import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrdersApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';

type THistoryOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

const initialState: THistoryOrdersState = {
  orders: [],
  isLoading: false,
  error: null
};

export const fetchHistoryOrders = createAsyncThunk(
  'historyOrders/fetchHistoryOrders',
  async () => {
    const orders = await getOrdersApi();
    return orders;
  }
);

export const historyOrdersSlice = createSlice({
  name: 'historyOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistoryOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHistoryOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchHistoryOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки заказов';
      });
  }
});

export default historyOrdersSlice.reducer;