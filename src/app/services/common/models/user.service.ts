import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { User } from '../../../entities/user';
import { Create_User } from '../../../contracts/users/create_user';
import { Observable, first, firstValueFrom } from 'rxjs';
import { Token } from '../../../contracts/token/token';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../ui/custom-toastr.service';
import { Toast } from 'ngx-toastr';
import { TokenResponse } from '../../../contracts/token/tokenResponse';
import { SocialUser } from '@abacritt/angularx-social-login';
import { List_User } from '../../../contracts/users/list_user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClientService:HttpClientService, private toastrService: CustomToastrService) { }

 async create(user:User):Promise<Create_User>{
   const observable:Observable<Create_User | User>= this.httpClientService.post<Create_User | User>({
      controller:"users"
    },user);
   return await firstValueFrom(observable) as Create_User;
  }

  async updatePassword(userId:string,resetToken:string,password:string,passwordConfirm:string, successCallback?:()=>void, errorCallBack?:(error)=>void)
{
    const observable:Observable<any> = await this.httpClientService.post({
      action:"update-password",
      controller:"users"
    },{
      userId:userId,
      resetToken:resetToken,
      password:password,
      passwordConfirm:passwordConfirm
    })

    const promiseData:Promise<any> = firstValueFrom(observable);
    promiseData.then(value=>successCallback()).catch(error=>errorCallBack(error))
    await promiseData;
  }

  async getAllUsers(page: number = 0, size: number = 5, successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void):Promise<{totalUsersCount: number; users: List_User[]}>{
    const observable:Observable<{totalUsersCount: number; users: List_User[]}> = await this.httpClientService.get({
        controller:"users",
        queryString: `page=${page}&size=${size}`
      })
      const promiseData =firstValueFrom(observable);
      promiseData.then(value=> successCallBack())
      .catch(error=>errorCallBack(error))
      
      
      return await promiseData;
    }

    async assignRoleToUser(id:string, roles:string[],successCallBack?:()=>void,errorCallBack?:(error)=>void){
      const observable:Observable<any> = await this.httpClientService.post({
        controller:"users",
        action:"assign-role-to-user"
      },{userId:id,
        roles:roles
      })

      const promiseData= firstValueFrom(observable);
      promiseData.then(()=> successCallBack())
      .catch(error=>errorCallBack(error));

      await promiseData;
    }

    async getRolesToUser(userId:string,successCallBack?:()=>void,errorCallBack?:(error)=>void):Promise<string[]>{
        const observable:Observable<{userRoles:string[]}> = await this.httpClientService.get({
          controller:"users",
          action:"get-roles-to-user"
        },userId);

        const promiseData = firstValueFrom(observable);
        promiseData.then(()=>successCallBack())
        .catch(error=> errorCallBack(error));

        return (await promiseData).userRoles;
    }

}
