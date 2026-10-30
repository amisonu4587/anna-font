import { Component } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar-component/navbar-component';
import { SidebarComponent } from '../../sidebar/sidebar-component/sidebar-component';

@Component({
  imports: [RouterOutlet,RouterLinkWithHref],
  selector: 'app-guest-component',
  styleUrl: './guest-component.css',
  templateUrl: './guest-component.html',
})
export class GuestComponent {}
