import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { MobxAngularModule } from 'mobx-angular';
import RootStore, { IRootStore } from './store/store';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MobxAngularModule, CommonModule],
  providers: [RootStore],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'mobx-test1';
  store = inject(RootStore) as IRootStore;

  initialFavorites = {
    name: 'Google',
    link: 'https://www.google.com',
    type: 'work',
  };
}
