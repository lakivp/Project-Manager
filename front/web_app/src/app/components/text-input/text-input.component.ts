import { Component, Input, Output } from '@angular/core';
import { EventEmitter } from 'node:stream';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.css'
})
export class TextInputComponent {
  @Input("title") title: string;
  inputValue: string = "";

  onInputChange(value: string): void {
    this.inputValue = value;
  }
}
