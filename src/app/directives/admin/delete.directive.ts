import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';
import { HttpClientService } from '../../services/common/http-client.service';
import { ProductService } from '../../services/common/models/product.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent, DeleteState } from '../../dialogs/delete-dialog/delete-dialog.component';
import { AlertifyService, MessageType, Position } from '../../services/admin/alertify.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { DialogService } from '../../services/common/dialog.service';
declare var $:any


@Directive({
  selector: '[appDelete]'
})
export class DeleteDirective {

  constructor(private dialogService:DialogService,private alertifyService : AlertifyService,public dialog: MatDialog,private element:ElementRef, private _renderer:Renderer2, private httpClientService:HttpClientService) { 
    const img = _renderer.createElement("img");
    img.setAttribute("src","../../../../assets/delete.png");
    img.setAttribute("style","cursor:pointer;");
    img.width=25;
    img.height=25;
    _renderer.appendChild(element.nativeElement,img);
  }

@Input() id:string;
@Input() controller:string;
@Output() callback:EventEmitter<any> = new EventEmitter();

  @HostListener("click")
  async onclick(){
    this.dialogService.openDialog({
      componentType:DeleteDialogComponent,
      data:DeleteState.Yes,
      afterClosed:async ()=> {
        const td:HTMLTableCellElement=this.element.nativeElement;
        this.httpClientService.delete({
          controller:this.controller
        },this.id).subscribe(data=>{
          $(td.parentElement).fadeOut(2000, ()=> {
            this.callback.emit();
            this.alertifyService.message("Başarıyla silindi",{
              dismissOthers:true,
              messageType:MessageType.Success,
              position:Position.TopRight
            })
          });
        }, (errorResponse:HttpErrorResponse)=>{
          this.alertifyService.message("Silinirken bir hata oluştu !",{
            dismissOthers:true,
            messageType:MessageType.Error,
            position:Position.TopRight
        })
      });
      }
    });
      
  }

}


