import * as api from "../helpers/api";
import store from "../stores";
import { createShortcut, deleteShortcut, patchShortcut, setShortcuts } from "../stores/modules/shortcut";

const convertResponseModelShortcut = (shortcut: Shortcut): Shortcut => {
  return {
    ...shortcut,
    createdTs: shortcut.createdTs * 1000,
    updatedTs: shortcut.updatedTs * 1000,
  };
};

const shortcutService = {
  getState: () => {
    return store.getState().shortcut;
  },

  fetchWorkspaceShortcuts: async () => {
    const data = (await api.getShortcutList({})).data;
    const shortcuts = data.map((s) => convertResponseModelShortcut(s));
    store.dispatch(setShortcuts(shortcuts));
    return shortcuts;
  },

  getMyAllShortcuts: async () => {
    const data = (await api.getShortcutList()).data;
    const shortcuts = data.map((s) => convertResponseModelShortcut(s));
    store.dispatch(setShortcuts(shortcuts));
  },

  getShortcutById: (id: ShortcutId) => {
    for (const shortcut of shortcutService.getState().shortcutList) {
      if (shortcut.id === id) {
        return shortcut;
      }
    }
    return null;
  },

  getOrFetchShortcutById: async (id: ShortcutId) => {
    for (const shortcut of shortcutService.getState().shortcutList) {
      if (shortcut.id === id) {
        return shortcut;
      }
    }

    const data = (await api.getShortcutById(id)).data;
    const shortcut = convertResponseModelShortcut(data);
    store.dispatch(createShortcut(shortcut));
    return shortcut;
  },

  createShortcut: async (shortcutCreate: ShortcutCreate) => {
    const data = (await api.createShortcut(shortcutCreate)).data;
    const shortcut = convertResponseModelShortcut(data);
    store.dispatch(createShortcut(shortcut));
  },

  patchShortcut: async (shortcutPatch: ShortcutPatch) => {
    const data = (await api.patchShortcut(shortcutPatch)).data;
    const shortcut = convertResponseModelShortcut(data);
    store.dispatch(patchShortcut(shortcut));
  },

  deleteShortcutById: async (shortcutId: ShortcutId) => {
    await api.deleteShortcutById(shortcutId);
    store.dispatch(deleteShortcut(shortcutId));
  },
};

export default shortcutService;
