import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { List_Product } from '../../../../contracts/list_product';
import { ProductService } from '../../../../services/common/models/product.service';
import { AlertifyService, MessageType, Position } from '../../../../services/admin/alertify.service';
import { MatPaginator } from '@angular/material/paginator';
import { DialogService } from '../../../../services/common/dialog.service';
import { SelectProductImageDialogComponent } from '../../../../dialogs/select-product-image-dialog/select-product-image-dialog.component';
import { QrcodeDialogComponent } from '../../../../dialogs/qrcode-dialog/qrcode-dialog.component';
declare var $:any;

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {
  constructor(private dialogService:DialogService, private productService:ProductService, private alertifyService : AlertifyService){}

  displayedColumns: string[] = ['name', 'stock', 'price', 'createdDate','updatedDate','photos', 'qrcode','edit','delete'];
  dataSource:MatTableDataSource<List_Product>=null;
  @ViewChild(MatPaginator) paginator: MatPaginator;

async getProducts(){
  const allProducts:{ count:number; products :List_Product[]}= await  this.productService.read(this.paginator? this.paginator.pageIndex : 0,this.paginator ? this.paginator.pageSize : 5 ,()=>{},errorMessage=> 
    this.alertifyService.message(errorMessage, {
      dismissOthers:true,
      messageType:MessageType.Error,
      position:Position.BottomRight
    }))
        this.dataSource= new MatTableDataSource<List_Product>(allProducts.products)
        this.paginator.length=allProducts.count;
}

 async ngOnInit() {
    await this.getProducts();
  }

addProductImages(id:string){
this.dialogService.openDialog({
  componentType:SelectProductImageDialogComponent,
  data:id,
  options: {
    width:"1400px"
  }
})
}

  async pageChanged(){
   await this.getProducts();
  }

  delete(id,event){
    const img: HTMLImageElement = event.srcElement;
    $(img.parentElement.parentElement).fadeOut(2000);
  }

  showQrCode(productId:string){
    this.dialogService.openDialog({
      componentType:QrcodeDialogComponent,
      data:productId,
      afterClosed:()=>{},
    })
  }

}

