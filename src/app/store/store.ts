import { Instance, types } from 'mobx-state-tree';
import { v4 as uuidv4 } from 'uuid';
import { faker as faker } from '@faker-js/faker';
import { Injectable } from '@angular/core';
import makeInspectable from 'mobx-devtools-mst';

declare global {
  interface Window {
    store: any;
  }
}

const typesEnum = ['work', 'personal', 'shared'];

export const Favorite = types
  .model('Favourite', {
    id: types.identifier,
    name: types.string,
    link: types.string,
    type: types.enumeration([...typesEnum]),
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
    get firstFavoriteName() {
      return self.favorites.length ? self.favorites[0].name : '';
    },
  }))
  .actions((self) => ({
    removeFavorite(favorite: Favorite) {
      self.favorites.remove(favorite);
    },
    addFavorite(
      favorite: Omit<Favorite, 'id'> = {
        name: faker.company.name(),
        link: faker.internet.url(),
        type: faker.helpers.arrayElement(typesEnum),
      }
    ) {
      self.favorites.push({ ...favorite, id: uuidv4() });
    },
    setFilter(selectedValue: string) {
      self.selectedFilter = selectedValue;
    },
  }));

const RootStore = types.model('RootStore', {
  favoritesStore: types.optional(FavoritesStore, {}),
});

export interface FavoritesStore extends Instance<typeof FavoritesStore> {}
export interface Favorite extends Instance<typeof Favorite> {}
export interface IRootStore extends Instance<typeof RootStore> {}

@Injectable()
export default class Store {
  constructor() {
    let myStore = (window.store = RootStore.create({}));
    makeInspectable(myStore);
    return myStore;
  }
}
