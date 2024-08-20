import { Component, ViewChild } from '@angular/core';
import { DialogService } from '../../../../services/common/dialog.service';
import { RoleService } from '../../../../services/common/models/role.service';
import { AlertifyService, MessageType, Position } from '../../../../services/admin/alertify.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { List_Role } from '../../../../contracts/role/list_role';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {

  constructor(private dialogService:DialogService, private roleService:RoleService, private alertifyService : AlertifyService){}

  displayedColumns: string[] = ['name','edit','delete'];
  dataSource:MatTableDataSource<List_Role>=null;
  @ViewChild(MatPaginator) paginator: MatPaginator;

async getRoles(){
  const allRoles:{ datas:List_Role[], totalRoleCount:number}= await  this.roleService.getRoles(this.paginator? this.paginator.pageIndex : 0,this.paginator ? this.paginator.pageSize : 5 ,()=>{},errorMessage=> 
    this.alertifyService.message(errorMessage, {
      dismissOthers:true,
      messageType:MessageType.Error,
      position:Position.BottomRight
    }))
        this.dataSource= new MatTableDataSource<List_Role>(allRoles.datas);
        this.paginator.length=allRoles.totalRoleCount;
}

 async ngOnInit() {
    await this.getRoles();
  }



  async pageChanged(){
   await this.getRoles();
  }



}
