import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ConfirmarLogoutComponent } from '../confirmar-logout/confirmar-logout.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    public authService: AuthService,
    private dialog: MatDialog
    
  ) { }

  ngOnInit(): void {
  }

  logOut():void{
    const dialog = this.dialog.open(ConfirmarLogoutComponent)
    dialog.afterClosed().subscribe(
      (boolean)=>{
        if (boolean){
        this.authService.signOut()
        }
      }
    )
  }
}
