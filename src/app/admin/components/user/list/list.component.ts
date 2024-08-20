import { Component, ViewChild } from '@angular/core';
import { UserService } from '../../../../services/common/models/user.service';
import { MatTableDataSource } from '@angular/material/table';
import { List_User } from '../../../../contracts/users/list_user';
import { MatPaginator } from '@angular/material/paginator';
import { AlertifyService, MessageType, Position } from '../../../../services/admin/alertify.service';
import { DialogService } from '../../../../services/common/dialog.service';
import { AuthorizeUserDialogComponent } from '../../../../dialogs/authorize-user-dialog/authorize-user-dialog.component';
declare var $:any;
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {

  constructor(private userService:UserService ,private dialogService:DialogService, private alertifyService : AlertifyService){}

  displayedColumns: string[] = ['userName', 'nameSurname', 'email', 'twoFactorEnabled','role', 'delete'];
  dataSource:MatTableDataSource<List_User>=null;
  @ViewChild(MatPaginator) paginator: MatPaginator;

async getUsers(){
  const allUsers:{ totalUsersCount:number; users :List_User[]}= await  this.userService.getAllUsers(this.paginator? this.paginator.pageIndex : 0,this.paginator ? this.paginator.pageSize : 5 ,()=>{},errorMessage=> 
    this.alertifyService.message(errorMessage, {
      dismissOthers:true,
      messageType:MessageType.Error,
      position:Position.BottomRight
    }))
        this.dataSource= new MatTableDataSource<List_User>(allUsers.users)
        this.paginator.length=allUsers.totalUsersCount;
}

assignRole(id:string){
  this.dialogService.openDialog({
    componentType: AuthorizeUserDialogComponent,
    data:id,
    options:{
      width:"750px"
    },
    afterClosed:()=>{
      this.alertifyService.message("Rol ataması başarıyla gerçekleştirildi!",{
        messageType:MessageType.Success,
        position:Position.TopRight
      })
    }
  })
}

 async ngOnInit() {
    await this.getUsers();
  }



  async pageChanged(){
   await this.getUsers();
  }

  

  delete(id,event){
    const img: HTMLImageElement = event.srcElement;
    $(img.parentElement.parentElement).fadeOut(2000);
  }


}
