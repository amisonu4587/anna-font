import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';



export interface MenuChild {
  label: string;
  link: string;
  icon?: string;
}

export interface MenuItem {
  label: string;
  icon: string;
  link?: string;          // set for leaf items (no children)
  children?: MenuChild[]; // set for treeview items
  open?: boolean;
}
@Component({
  imports: [RouterLink],
  selector: 'app-sidebar-component',
  styleUrl: './sidebar-component.css',
  templateUrl: './sidebar-component.html',
})
export class SidebarComponent {

accordion = false;

  menu: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'fas fa-tachometer-alt',
      link: '/dashboard',
    },
    {
      label: 'Associate Data',
      icon: 'far fa-plus-square',
      children: [
        { label: 'Areas', link: '/associate-data/areas' },
        { label: 'Roles', link: '/associate-data/roles' },
        { label: 'Users', link: '/associate-data/users' },
        { label: 'Permission', link: '/associate-data/permissions', icon: 'fas fa-circle-notch' },
      ],
    },
    {
      label: 'Reports',
      icon: 'fas fa-book',
      children: [
        { label: 'Violation Report', link: '/reports/violation' },
        { label: 'Payment Report', link: '/reports/payment' },
        { label: 'Money Report By Description', link: '/reports/money-by-description' },
      ],
    },
    {
      label: 'Permits',
      icon: 'fas fa-book',
      children: [
        { label: 'Restaurant / Retail Food', link: '/permits/food' },
        { label: 'Mobile Food', link: '/permits/mobile-food' },
        { label: 'Cosmetology/Body Care', link: '/permits/cosmetology' },
        { label: 'Temporary Food', link: '/permits/temp-food' },
        { label: 'Pool', link: '/permits/pool' },
        { label: 'Farmers Market', link: '/permits/farmers-market' },
        { label: 'Hotel/Motel', link: '/permits/hotel-motel' },
        { label: 'Day-Care', link: '/permits/day-care' },
      ],
    },
    {
      label: 'Complaint',
      icon: 'fas fa-file-contract',
      link: '/complaint',
    },
    {
      label: 'Schedule',
      icon: 'fas fa-book',
      children: [
        { label: 'Food', link: '/schedule/food' },
        { label: 'Mobile', link: '/schedule/mobile' },
        { label: 'Cosmetology', link: '/schedule/cosmetology' },
        { label: 'Temporary Food', link: '/schedule/temp-food' },
        { label: 'Pool', link: '/schedule/pool' },
        { label: 'Farmers Market', link: '/schedule/farmers-market' },
      ],
    },
    {
      label: 'Inspections',
      icon: 'fas fa-book',
      children: [
        { label: 'Food', link: '/inspections/food' },
        { label: 'Mobile Food', link: '/inspections/mobile-food' },
        { label: 'Cosmetology', link: '/inspections/cosmetology' },
        { label: 'Temporary Food', link: '/inspections/temp-food' },
        { label: 'Pool', link: '/inspections/pool' },
        { label: 'Hotel Motel', link: '/inspections/hotel-motel' },
        { label: 'Farmers Market', link: '/inspections/farmers-market' },
      ],
    },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.openActiveMenu();

    // Keep the correct menu expanded after every navigation
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.openActiveMenu());
  }

  /** Toggle - opens if closed, closes if open. */
  toggle(item: MenuItem, event: Event): void {
    event.preventDefault();

    const willOpen = !item.open;

    if (this.accordion && willOpen) {
      this.menu.forEach(m => (m.open = false));
    }

    item.open = willOpen;
  }

  /** Expand whichever menu contains the current route. */
  private openActiveMenu(): void {
    const url = this.router.url;

    this.menu.forEach(item => {
      if (item.children?.some(child => url.startsWith(child.link))) {
        item.open = true;
      }
    });
  }

  trackByLabel(_: number, item: { label: string }): string {
    return item.label;
  }



}
