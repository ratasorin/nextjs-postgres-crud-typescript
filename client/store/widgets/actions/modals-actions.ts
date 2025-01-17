import type { supportedModals } from '../widgets-available';
import type { supportedModalActions } from '../widgets-actions';
import { store } from 'store/store';
import { addWidget, removeWidget } from 'components/Widgets/stack-slice';
import { useAppSelector } from 'hooks/redux-hooks';

export const openModal = (
  modal: supportedModals,
  payload?: supportedModalActions
) => {
  store.dispatch(addWidget(modal));
  store.dispatch({
    type: `${modal}/open` as const,
    payload,
  });
};

export const closeModal = (modal: supportedModals) => {
  store.dispatch(removeWidget(modal));
  store.dispatch({
    type: `${modal}/close` as const,
  });
};
type Key<T> = T extends { [key: string]: unknown } ? keyof T : never;

export const selectFrom = <
  T extends { [key in Key<supportedModalActions>]?: unknown }
>(
  modal: supportedModals
) => {
  type correctType = Extract<supportedModalActions, T>;
  const payload = useAppSelector(
    (appState) => appState[modal] as correctType & { visible: boolean }
  );

  return payload;
};
