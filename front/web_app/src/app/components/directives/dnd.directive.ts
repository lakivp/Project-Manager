import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appDnd]'
})
export class DndDirective {
  @Output() fileDropped = new EventEmitter();
  @HostBinding('class.fileover') fileover:boolean;
  constructor() { }

// Dragover listener
  @HostListener('dragover', ['$event']) onDragOver (evt:any) {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileover=true;
    console.log('Drag Over');
  }

  // Dragleave listener
  @HostListener('drag leave', ['$event']) public onDragLeave (evt:any) {
    evt.preventDefault();
    evt.stopPropagation();
    console.log('Drag Leave');
  }
  // Drop listener
  @HostListener('drop', ['$event']) public ondrop(evt:any) {
    evt.preventDefault();
    evt.stopPropagation(); this.fileover = false;
    const files = evt.dataTransfer.files;
    if (files.length > 0) {
      this.fileDropped.emit(files);
    }
    // Do Some stuff here
    console.log(`You dropped ${files.length} files.`);
  }
}
