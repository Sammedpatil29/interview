import { Component, OnInit, AfterViewInit, ElementRef, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../../public-components/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-candidate-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './candidate-layout.component.html',
  styleUrl: './candidate-layout.component.css'
})
export class CandidateLayoutComponent implements OnInit, AfterViewInit {

  private readonly mobileBreakpoint = 992;
  role:any;
  value:any;

  readonly dialog = inject(MatDialog);

  constructor(private elementRef: ElementRef, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.role$.subscribe((res:any)=>{
      this.role = res
      this.value = this.role?.name[0]
    })
  }

  ngAfterViewInit(): void {
    const wrapper = this.elementRef.nativeElement.querySelector('#wrapper');
    const sidebarToggle = this.elementRef.nativeElement.querySelector('#sidebarToggle');
    const sidebarToggleMobile = this.elementRef.nativeElement.querySelector('#sidebarToggleMobile');
    const backdrop = this.elementRef.nativeElement.querySelector('#sidebarBackdrop');
    const sidebarLinks = this.elementRef.nativeElement.querySelectorAll('.sidebar-link');

    const toggleSidebar = () => {
      wrapper.classList.toggle('toggled');
    };

    const closeSidebar = () => {
      wrapper.classList.remove('toggled');
    };

    if (sidebarToggle) {
      sidebarToggle.addEventListener('click', (event: Event) => {
        event.preventDefault();
        toggleSidebar();
      });
    }

    if (sidebarToggleMobile) {
      sidebarToggleMobile.addEventListener('click', (event: Event) => {
        event.preventDefault();
        toggleSidebar();
      });
    }

    if (backdrop) {
      backdrop.addEventListener('click', () => closeSidebar());
    }

    sidebarLinks.forEach((link: HTMLElement) => {
      link.addEventListener('click', () => {
        if (window.innerWidth < this.mobileBreakpoint) {
          closeSidebar();
        }
      });
    });
  }

  logout(){
    this.dialog.open(AlertDialogComponent, {
      data: {
        title: 'success',
        body: 'Sure you want to logout?',
        type: 'warning'
      }
    }).afterClosed().subscribe((res:any)=>{
      if(res){
        sessionStorage.removeItem('token')
    this.router.navigate(['/home'])
      }
    })
  }
}