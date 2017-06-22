import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component'; 
import { SearchComponent } from './components/youtube-search.component'; 
import { SettingsComponent } from './components/youtube-settings.component'; 
import { AboutComponent } from './components/youtube-about.component';

export const router: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: SearchComponent },
    { path: 'about', component: AboutComponent },
    { path: 'settings', component: SettingsComponent }
]

export const routes: ModuleWithProviders = RouterModule.forRoot(router);