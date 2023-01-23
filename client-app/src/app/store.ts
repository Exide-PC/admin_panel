import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import appReducer from '../features/app/app-slice';
import maintenanceReducer from '../features/maintenance/maintenance-slice';
import nzxtReducer from '../features/nzxt/nzxt-slice';
import noteReducer from '../features/notes/notes-slice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    maintenance: maintenanceReducer,
    nzxt: nzxtReducer,
    note: noteReducer,
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
