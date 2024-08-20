import { Component, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from './services/ui/custom-toastr.service';
import { AuthService } from './services/common/auth.service';
import { Router } from '@angular/router';
import { HttpClientService } from './services/common/http-client.service';
import { ComponentType, DynamicLoadComponentService } from './services/common/dynamic-load-component.service';
import { DynamicLoadComponentDirective } from './directives/common/dynamic-load-component.directive';

declare var $:any

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  @ViewChild(DynamicLoadComponentDirective, {static :true})
  dynamicLoadComponentDirective : DynamicLoadComponentDirective;

  constructor(private dynamicLoadComponentService:DynamicLoadComponentService, private httpClientService:HttpClientService,public authService:AuthService, private toastrService:CustomToastrService, private router:Router){
    authService.identityCheck();
  }

  signOut(){
    localStorage.removeItem("accessToken");
    this.authService.identityCheck();
    this.router.navigate([""]);
    this.toastrService.message("Çıkış yapıldı !", "Oturum Kapatıldı", {
      messageType:ToastrMessageType.Info,
      position:ToastrPosition.TopRight
    })
  }

  loadComponent(){
    this.dynamicLoadComponentService.loadComponent(ComponentType.BasketsComponent,this.dynamicLoadComponentDirective.viewContainerRef);
  }
}

// $.get("https://localhost:7196/api/products",data=>{
//   console.log(data)
// } 

// )


