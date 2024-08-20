import { Component, Inject, OnInit, Output } from '@angular/core';
import { BaseDialog } from '../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FileUploadOptions } from '../../services/common/fileupload/fileupload.component';
import { ProductService } from '../../services/common/models/product.service';
import { List_Product_Image } from '../../contracts/list_product_image';
import { MatCard } from '@angular/material/card';
import { BaseUrl } from '../../contracts/base_url';
import { FileService } from '../../services/common/models/file.service';

declare var $:any;

@Component({
  selector: 'app-select-product-image-dialog',
  templateUrl: './select-product-image-dialog.component.html',
  styleUrl: './select-product-image-dialog.component.scss'
})
export class SelectProductImageDialogComponent extends BaseDialog<SelectProductImageDialogComponent> implements OnInit {


baseUrl:BaseUrl;
/**
 *
 */
constructor(private fileService:FileService,private productService:ProductService, dialogRef :MatDialogRef<SelectProductImageDialogComponent>,
  @Inject(MAT_DIALOG_DATA) public data: SelectProductImageState | string
) {
  super(dialogRef);
  
}

images:List_Product_Image[];

async ngOnInit() {
  this.baseUrl= await this.fileService.getBaseStorageUrl();
  this.images= await this.productService.readImages(this.data as string);
}

@Output() options:Partial<FileUploadOptions>={
  accept:".png, .jpg, .jpeg, .gif",
  action:"upload",
  controller:"products",
  explanation:"Ürün resmini seçin veya sürükleyin",
  isAdminPage:true,
  queryString:`id=${this.data}`
}

async deleteImage(imageId:string, event:any){
   await this.productService.deleteImage(this.data as string, imageId)
}

showCase(imageId:string){
  this.productService.changeShowcaseImage(imageId,this.data as string, ()=>{})
}
}



export enum SelectProductImageState{
  Close
}