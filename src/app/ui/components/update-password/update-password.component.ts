import { Component, OnInit } from '@angular/core';
import { UserAuthService } from '../../../services/common/models/user-auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../../services/ui/custom-toastr.service';
import { UserService } from '../../../services/common/models/user.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrl: './update-password.component.scss'
})
export class UpdatePasswordComponent implements OnInit {

  /**
   *
   */
  constructor(private router:Router,private userService:UserService, private userAuthService:UserAuthService,private activatedRoute:ActivatedRoute,private toastrService:CustomToastrService) {
    
  }
  state:any;
  ngOnInit(): void {
    this.activatedRoute.params.subscribe({
      next:async params=>{
        const userId:string = params["userId"];
        const resetToken:string = params["resetToken"];
       this.state = await this.userAuthService.verifyResetToken(resetToken,userId,()=>{
          this.state=true;
        })
      }
    })
  }

  updatePassword(password:string,passwordConfirm:string){
    if (password!=passwordConfirm) {
      this.toastrService.message("Şifreleri doğrulayınız!","Şifreler aynı değil", {
        messageType:ToastrMessageType.Error,
        position:ToastrPosition.TopRight
      });
      return;
    }

    this.activatedRoute.params.subscribe({
      next:async params=>{
        const userId:string = params["userId"];
        const resetToken:string = params["resetToken"];
        await this.userService.updatePassword(userId,resetToken,password,passwordConfirm,()=>{
          this.toastrService.message("Şifre başarıyla güncellenmiştir.","Şifre güncellendi!", {
            messageType:ToastrMessageType.Success,
            position:ToastrPosition.TopRight
          })
          this.router.navigate(["/login"])
        },
      error=>{
        console.log(error)
        
      });
      }  
    })

  }

}
