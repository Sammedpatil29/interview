import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-docs',
  imports: [],
  templateUrl: './docs.component.html',
  styleUrl: './docs.component.css'
})
export class DocsComponent implements OnInit {
  email = 'mayihelpyoufoundationjmd@gmail.com'
  contact = '+91 9999999999'
  type = 'terms'

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.type = params['type'] || 'policy'; // Default to 'rr' if not provided
    });
  }

  home(){
    this.router.navigate(['/home']);
  }
}
