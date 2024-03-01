import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent {

  @Input() collapsed = false;

  getBodyClass():string {
    let styleClass = '';
    
    if(this.collapsed) {
      styleClass = 'body-trimmed';
    } else {
      styleClass = 'body-md-screen'
    }
    return styleClass;
  }
}
