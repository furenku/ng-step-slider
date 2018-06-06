import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  selectedValue : number = -1;

  selectValue( $event : number ) {
    this.selectedValue = $event;
  }

}
