import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent{

  firstname: string | null= sessionStorage.getItem('firstname')
  lastname: string | null= sessionStorage.getItem('lastname')
  role: string | null= sessionStorage.getItem('role')

}
