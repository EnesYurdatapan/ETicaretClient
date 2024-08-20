import { CanActivateFn, Router } from '@angular/router';
import {inject} from "@angular/core";
import { JwtHelperService } from '@auth0/angular-jwt';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../services/ui/custom-toastr.service';
import { _isAuthenticated, AuthService } from '../../services/common/auth.service';



export const authGuard: CanActivateFn = (route, state) => {
  
  // const jwtHelperService = inject(JwtHelperService);
   const router = inject(Router);
   const toastr = inject(CustomToastrService)
  // const token:string = localStorage.getItem("accessToken");
  // // const expirationDate:Date=jwtHelperService.getTokenExpirationDate(token);
  // let expired:boolean;
  // try {
  //   expired = jwtHelperService.isTokenExpired(token);
  // } catch {
  //   expired=true;
  // }

  if (!_isAuthenticated) {
    router.navigate(["login"],{queryParams:{returnUrl:state.url}});
    toastr.message("Giriş yapmanız gerekiyor!","Yetkisiz Erişim!",{
      messageType:ToastrMessageType.Warning,
      position:ToastrPosition.TopRight
    })
  }

  return true;
};

