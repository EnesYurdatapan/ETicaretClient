import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../ui/custom-toastr.service';
import { UserAuthService } from './models/user-auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { state } from '@angular/animations';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorHandlerInterceptorService implements HttpInterceptor {

  constructor(private router:Router,private toastrService:CustomToastrService,private userAuthService:UserAuthService) { }

  //req parametresi manipüle edeceğimiz isteği temsil eder. İşini bitirdikten sonra next parametresiyle isteğin devamını sağlar. next bir delegate
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
return next.handle(req).pipe(catchError(error=>{
  switch(error.status){
    case HttpStatusCode.Unauthorized:
      this.userAuthService.refreshTokenLogin(localStorage.getItem("refreshToken"),(state) =>{
        if(!state){
          const url = this.router.url;
          if (url=="/products")
            this.toastrService.message("Sepete ürün eklemek için oturum açmanız gerekli","Oturum Açınız",{
              messageType:ToastrMessageType.Warning,
              position:ToastrPosition.TopRight
          });
          else
            this.toastrService.message("Bu işlemi yapmaya yetkiniz yok","Yetkisiz İşlem!", {
            messageType:ToastrMessageType.Warning,
            position:ToastrPosition.BottomFullWidth
          });

        }
      }).then(data=>{
        this.toastrService.message("Bu işlemi yapmaya yetkiniz yok","Yetkisiz İşlem!", {
          messageType:ToastrMessageType.Warning,
          position:ToastrPosition.BottomFullWidth
        });
      });
        
      break;
    case HttpStatusCode.InternalServerError:
      this.toastrService.message("Sunucuya erişilemiyor !","Sunucu Hatası!", {
        messageType:ToastrMessageType.Warning,
        position:ToastrPosition.BottomFullWidth
      })
      break;

    case HttpStatusCode.BadRequest:
      this.toastrService.message("Geçersiz İstek Yapıldı","Geçersiz İstek!", {
        messageType:ToastrMessageType.Warning,
        position:ToastrPosition.BottomFullWidth
      })
      break;

    case HttpStatusCode.NotFound:
      this.toastrService.message("Sayfa Bulunamadı","Sayfa Bulunamadı!", {
        messageType:ToastrMessageType.Warning,
        position:ToastrPosition.BottomFullWidth
      })
      break;
    default:
      this.toastrService.message("Beklenmeyen bir hata gerçekleşti","Hata!", {
        messageType:ToastrMessageType.Warning,
        position:ToastrPosition.BottomFullWidth
      })
      break;
  }
  return of(error);
}));  // yapılan istekte hata meydana gelirse yakala ve kontrolü bana bırak
}
}
