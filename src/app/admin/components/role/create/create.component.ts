import { Component, EventEmitter, Output } from '@angular/core';
import { AlertifyService, MessageType, Position } from '../../../../services/admin/alertify.service';
import { RoleService } from '../../../../services/common/models/role.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {
  constructor(private roleService:RoleService, private alertify:AlertifyService){}

@Output() createdRole : EventEmitter<string> = new EventEmitter();



  create(name:HTMLInputElement){
    this.roleService.create(name.value, ()=>{
      this.alertify.message("Rol başarıyla eklenmiştir.", {
        dismissOthers:true,
        messageType:MessageType.Success,
        position:Position.BottomRight
      });
      this.createdRole.emit(name.value);
    }, errorMessage => {
      this.alertify.message(errorMessage, {
        dismissOthers:true,
        messageType:MessageType.Error,
        position: Position.TopRight

      })
    });
  }

}



