import { Component, Inject, OnInit } from '@angular/core';
import { BaseDialog } from '../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OrderService } from '../../services/common/models/order.service';
import { SingleOrder } from '../../contracts/order/single_order';
import { DialogService } from '../../services/common/dialog.service';
import { CompleteOrderDialogComponent, CompleteOrderState } from '../complete-order-dialog/complete-order-dialog.component';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../services/ui/custom-toastr.service';

@Component({
  selector: 'app-order-detail-dialog',
  templateUrl: './order-detail-dialog.component.html',
  styleUrl: './order-detail-dialog.component.scss'
})
export class OrderDetailDialogComponent extends BaseDialog<OrderDetailDialogComponent> implements OnInit{
  constructor(private toastrService:CustomToastrService, private dialogService:DialogService, private orderService : OrderService,
    dialogRef: MatDialogRef<OrderDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrderDetailDialogState | string,
  ) {
    super(dialogRef);
  }

  singleOrder:SingleOrder;

  async ngOnInit(): Promise<void> {
  this.singleOrder = await this.orderService.getOrderById(this.data as string);
  this.dataSource = this.singleOrder.basketItems;
  this.totalPrice=this.singleOrder.basketItems.map((basketItem,index)=> basketItem.price * basketItem.quantity).reduce((price,current)=>price+current);
  }

  displayedColumns: string[] = ['name', 'price', 'quantity', 'totalPrice'];
  dataSource = [];
  clickedRows = new Set<any>();
  totalPrice:number;

  completeOrder(){
    this.dialogService.openDialog({
      componentType:CompleteOrderDialogComponent,
      data:CompleteOrderState.Yes,
      afterClosed:async ()=>{
        await this.orderService.completeOrder(this.data as string);
        this.toastrService.message("Sipariş başarıyla tamamlanmıştır!, Müşteriye bilgi verilmiştir.", "Sipariş tamamlandı!", {
          position:ToastrPosition.TopRight,
          messageType:ToastrMessageType.Success
        })
      }
    })
  }
}


export enum OrderDetailDialogState {
  Close,
  OrderCompleted
}
