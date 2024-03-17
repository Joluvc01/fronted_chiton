import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent{

  firstname: string | null= localStorage.getItem('firstname')
  lastname: string | null= localStorage.getItem('lastname')
  role: string | null= localStorage.getItem('role')

}
