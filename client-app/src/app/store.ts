import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import appReducer from '../features/app/app-slice';
import maintenanceReducer from '../features/maintenance/maintenance-slice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    maintenance: maintenanceReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
