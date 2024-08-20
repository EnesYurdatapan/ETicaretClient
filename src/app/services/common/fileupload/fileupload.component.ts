import { Component, Input } from '@angular/core';
import { FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';
import { HttpClientService } from '../http-client.service';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AlertifyService, MessageType, Position } from '../../admin/alertify.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../ui/custom-toastr.service';
import { Toast } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { FileUploadDialogComponent, FileUploadDialogState } from '../../../dialogs/file-upload-dialog/file-upload-dialog.component';
import { DialogService } from '../dialog.service';

@Component({
  selector: 'app-fileupload',
  templateUrl: './fileupload.component.html',
  styleUrl: './fileupload.component.scss'
})
export class FileuploadComponent {

  /**
   *
   */
  constructor(private dialogService:DialogService, private dialog:MatDialog,private alertifyService:AlertifyService,private customToastrService:CustomToastrService, private httpClientService:HttpClientService) {
    
  }
  public files: NgxFileDropEntry[];
@Input() options: Partial<FileUploadOptions>;


  public selectedFiles(files: NgxFileDropEntry[]) {
    this.files = files;
    const fileData:FormData=new FormData();
    for (const file of files) {
      (file.fileEntry as FileSystemFileEntry).file((_file:File)=>{
        fileData.append(_file.name,_file,file.relativePath);
      });   
    }
      this.dialogService.openDialog({
        componentType:FileUploadDialogComponent,
        data:FileUploadDialogState.Yes,
        afterClosed: ()=> {
          this.httpClientService.post({
            controller:this.options.controller,
            action:this.options.action,
            queryString:this.options.queryString,
            headers:new HttpHeaders({"responseType":"blob"})
          },fileData).subscribe(data=>{
            const message:string="Dosyalar başarıyla yüklendi.";
            
            if (this.options.isAdminPage) {
              this.alertifyService.message(message,{
                dismissOthers:true,
                messageType:MessageType.Success,
                position:Position.TopRight
              }
          
              )
            }
            else {
                this.customToastrService.message(message,"Başarılı",{
                  messageType:ToastrMessageType.Success,
                  position:ToastrPosition.TopRight
                })
            }
          
          },(errorResponse:HttpErrorResponse)=>{
          
            const message:string="Dosyalar yüklenirken bir hata oluştu.";
            
            if (this.options.isAdminPage) {
              this.alertifyService.message(message,{
                dismissOthers:true,
                messageType:MessageType.Error,
                position:Position.TopRight
              }
          
              )
            }
            else {
                this.customToastrService.message(message,"Başarısız",{
                  messageType:ToastrMessageType.Error,
                  position:ToastrPosition.TopRight
                })
            }
          })
        }
      })




  }
  
}

export class FileUploadOptions{
  controller?:string;
  action?:string;
  queryString?:string;
  explanation?:string;
  accept?:string;
  isAdminPage?:boolean=false;
}