import { Component } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar-component/navbar-component';
import { SidebarComponent } from '../../sidebar/sidebar-component/sidebar-component';


@Component({
  imports: [RouterOutlet, NavbarComponent, SidebarComponent, RouterLinkWithHref],
  selector: 'app-layout-component',
  styleUrl: './layout-component.css',
  templateUrl: './layout-component.html',
})
export class LayoutComponent {}
