import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DialogService } from '../../../../services/common/dialog.service';
import { ToastrMessageType } from '../../../../services/ui/custom-toastr.service';
import { AlertifyService, MessageType, Position } from '../../../../services/admin/alertify.service';
import { MatPaginator } from '@angular/material/paginator';
import { List_Order } from '../../../../contracts/order/list_order';
import { OrderService } from '../../../../services/common/models/order.service';
import { OrderDetailDialogComponent } from '../../../../dialogs/order-detail-dialog/order-detail-dialog.component';

declare var $:any;

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {

  constructor(private dialogService:DialogService, private orderService:OrderService, private alertifyService : AlertifyService){}

  displayedColumns: string[] = ['orderCode', 'userName', 'totalPrice', 'createdDate', 'completed','viewdetail','delete'];
  dataSource:MatTableDataSource<List_Order>=null;
  @ViewChild(MatPaginator) paginator: MatPaginator;

async getOrders(){
  const allOrders:{ count:number; orders :List_Order[]}= await  this.orderService.getAllOrders(this.paginator? this.paginator.pageIndex : 0,this.paginator ? this.paginator.pageSize : 5 ,()=>{},(errorMessage:any) => 
    this.alertifyService.message(errorMessage, {
      dismissOthers:true,
      messageType:MessageType.Error,
      position:Position.BottomRight
    }))
        this.dataSource= new MatTableDataSource<List_Order>(allOrders.orders)
        this.paginator.length=allOrders.count;
}

 async ngOnInit() {
    await this.getOrders();
  }



  async pageChanged(){
   await this.getOrders();
  }

  showDetail(id:string){
    this.dialogService.openDialog({
      componentType:OrderDetailDialogComponent,
      data:id,
      options:{
        width:"750px"
      }
    })
  }

  delete(id,event){
    const img: HTMLImageElement = event.srcElement;
    $(img.parentElement.parentElement).fadeOut(2000);
  }

  
}
