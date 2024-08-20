import { Component } from '@angular/core';
import { UserService } from '../../../services/common/models/user.service';
import { AuthService } from '../../../services/common/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FacebookLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { HttpClientService } from '../../../services/common/http-client.service';
import { TokenResponse } from '../../../contracts/token/tokenResponse';
import { UserAuthService } from '../../../services/common/models/user-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  
  constructor(private socialAuthService: SocialAuthService,private userAuthService:UserAuthService,private authService:AuthService, private activatedRoute:ActivatedRoute,private router:Router, private httpClientService:HttpClientService) {
    socialAuthService.authState.subscribe(async (user:SocialUser)=>{
      switch (user.provider) {
        case "GOOGLE":
          await userAuthService.googleLogin(user,()=>{
    this.authService.identityCheck()
           })
          break;
       case "FACEBOOK":
        userAuthService.facebookLogin(user,()=>{
    this.authService.identityCheck()

           })
           break;
      }
    });
  }

async login(usernameOrEmail:string,password:string){
 await this.userAuthService.login(usernameOrEmail,password, ()=> {
  this.authService.identityCheck();
  this.activatedRoute.queryParams.subscribe(params=>{
    const returnUrl:string = params["returnUrl"];
    if (returnUrl) {
      this.router.navigate([returnUrl]);
    }
  })
 });
}

facebookLogin(){
  this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
}

}
