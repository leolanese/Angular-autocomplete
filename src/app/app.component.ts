import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AutocompleteComponent } from './components/autocomplete/autocomplete.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    AutocompleteComponent
  ],
  template: `
    <div class="wrapper">
        <app-autocomplete />
    </div>
   
  `,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'autocomplete-test';
}
