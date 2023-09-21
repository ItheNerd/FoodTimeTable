import { atom } from "nanostores";

export const $isDarkTheme = atom<boolean>(true);
export const setDarkTheme = () => {
  $isDarkTheme.set(!$isDarkTheme.get());
};
