import { Instance, types } from 'mobx-state-tree';
import { v4 as uuidv4 } from 'uuid';

declare global {
  interface Window {
    store: any;
  }
}
import { Injectable } from '@angular/core';
import makeInspectable from 'mobx-devtools-mst';

export const Favorite = types
  .model('Favourite', {
    id: types.identifier,
    name: types.string,
    link: types.string,
    type: types.enumeration(['work', 'personal', 'shared']),
  })
  .actions((self) => ({}))
  .views((self) => ({}));

const FavoritesStore = types
  .model('FavoriteStore', {
    favorites: types.optional(types.array(Favorite), []),
    selectedFilter: types.optional(types.string, 'ALL'),
  })
  .views((self) => ({
    get filteredFavorites() {
      if (self.selectedFilter === 'ALL') {
        return self.favorites;
      }
      return self.favorites.filter(
        (favorite) => favorite.type === self.selectedFilter
      );
    },
    getABC() {
      return 'ABC';
    },
  }))
  .actions((self) => ({
    removeFavorite(favorite: Favorite) {
      self.favorites.remove(favorite);
    },
    addFavorite(favorite: Omit<Favorite, 'id'>) {
      self.favorites.push({ ...favorite, id: uuidv4() });
    },
    setFilter(selectedValue: string) {
      self.selectedFilter = selectedValue;
    },
  }));

export interface IRootStore extends Instance<typeof FavoritesStore> {}
export interface Favorite extends Instance<typeof Favorite> {}

@Injectable()
export default class Store {
  constructor() {
    let myStore = (window.store = FavoritesStore.create({}));
    makeInspectable(myStore);
    return myStore;
  }
}
