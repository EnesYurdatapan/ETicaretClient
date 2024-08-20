import { Component, Inject, OnInit } from '@angular/core';
import { BaseDialog } from '../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RoleService } from '../../services/common/models/role.service';
import { List_Role } from '../../contracts/role/list_role';
import { MatSelectionList } from '@angular/material/list';
import { AuthorizationEndpointService } from '../../services/common/models/authorization-endpoint.service';
declare var $:any;
@Component({
  selector: 'app-authorize-menu-dialog',
  templateUrl: './authorize-menu-dialog.component.html',
  styleUrl: './authorize-menu-dialog.component.scss'
})
export class AuthorizeMenuDialogComponent extends BaseDialog<AuthorizeMenuDialogComponent> implements OnInit {

  constructor(private authorizationEndpointService:AuthorizationEndpointService, private roleService:RoleService, dialogRef:MatDialogRef<AuthorizeMenuDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(dialogRef);
    
  }
  
  roles: { datas : List_Role[], totalRoleCount:number};

  assignedRoles:string[];
  listRoles: {name:string, selected:boolean}[];
 async ngOnInit() {
   this.assignedRoles =await  this.authorizationEndpointService.getRolesToEndpoints(this.data.code,this.data.baseMenuName)
   this.roles = await this.roleService.getRoles(-1,-1);
   this.listRoles= this.roles.datas.map((r:any)=> {
    return {
      name:r.name,
      selected:(this.assignedRoles?.indexOf(r.name)>-1)
    }
    
   })
  }

  assignRoles(rolesComponent:MatSelectionList){
   const roles:string[] = rolesComponent.selectedOptions.selected.map(o=>o._elementRef.nativeElement.innerText);
 
    this.authorizationEndpointService.assignRoleEndpoint(roles,this.data.code,this.data.baseMenuName)
  }
 
}

export enum AuthorizeMenuState{
  Yes,
  No
}