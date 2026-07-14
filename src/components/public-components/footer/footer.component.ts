import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit{
today = new Date()
year = this.today.getFullYear()

constructor(){}

ngOnInit(): void {
  console.log(this.year)
}

 openDocs(type: string) {
    const currentDomain = window.location.origin;
    let url = '';
    switch(type) {
      case 'terms': 
        url = `${currentDomain}/docs?type=terms`;
        break;
      case 'policy':
        url = `${currentDomain}/docs?type=privacy-policy`;
        break;
      case 'contact':
        url = `${currentDomain}/docs?type=cancellation`;
        break;
      default:
        url = `${currentDomain}/docs?type=terms`;
        return;
    }
    window.open(url, '_blank');
    
  }
}
