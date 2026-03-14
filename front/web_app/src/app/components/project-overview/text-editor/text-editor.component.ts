import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { Editor, Toolbar, Validators } from 'ngx-editor';
import { NgModel } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrl: './text-editor.component.css',
})
export class TextEditorComponent implements OnInit, OnDestroy {
  editorContent: string = '';
  @Input('editorContentChange') editorContentChange: (args: any) => void;
  @Input('initialValue') initialValue: string = '';
  @Input() changing: Subject<boolean>;
  editor: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  ngOnInit(): void {
    this.editor = new Editor();
    this.editorContent = this.initialValue;
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  onChangesSaved(): void {
    console.log(this.editorContent);
    this.editorContentChange(this.editorContent);
  }
}
