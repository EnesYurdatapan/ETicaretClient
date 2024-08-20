import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { HttpClientService } from '../../../services/common/http-client.service';
import { Create_Product } from '../../../contracts/create_product';
import { ListComponent } from './list/list.component';
import { DialogService } from '../../../services/common/dialog.service';
import { QrcodeReadingDialogComponent } from '../../../dialogs/qrcode-reading-dialog/qrcode-reading-dialog.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit{

   constructor(private dialogService:DialogService, private httpClientService: HttpClientService) {
    console.log("x");

   }

  ngOnInit(): void {
       
  }

  @ViewChild(ListComponent) listComponents : ListComponent;

  createdProduct(createdProduct : Create_Product){
    this.listComponents.getProducts();
  }

  showProductQrCodeReading(){
    this.dialogService.openDialog({
      componentType:QrcodeReadingDialogComponent,
      data:null,
      options:{
        width:"1000px"
      },
      afterClosed:()=> {
        
      },
    })
  }

}

