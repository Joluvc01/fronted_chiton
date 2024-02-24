import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { filterNavDataByRole } from './shared/components/navbar/nav-data';
import { AuthService } from './shared/services/auth.service';

interface SideNavToggle {
  collapsed: boolean
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  
  title = 'Confecciones Chiton';
  isSideNavCollapsed = false;

  onToggleSideNav(data: SideNavToggle): void {
    this.isSideNavCollapsed = data.collapsed;
  }
}
