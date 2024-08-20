import { Component } from '@angular/core';
import { UserAuthService } from '../../../services/common/models/user-auth.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../../services/ui/custom-toastr.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.scss'
})
export class PasswordResetComponent {

  /**
   *
   */
  constructor(private userAuthService:UserAuthService,private toastrService:CustomToastrService) {
  }

  passwordReset(email:string){
    this.userAuthService.passwordReset(email, ()=>{
      this.toastrService.message("Mail başarıyla gönderilmiştir.","Mail Gönderildi", {
        messageType:ToastrMessageType.Success,
        position:ToastrPosition.TopRight
      })
    });
  }

}
