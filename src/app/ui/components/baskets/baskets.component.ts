import { Component, OnInit } from '@angular/core';
import { BasketService } from '../../../services/common/models/basket.service';
import { List_Basket_Item } from '../../../contracts/basket/list_basket_item';
import { Update_Basket_Item } from '../../../contracts/basket/update_basket_item';
import { OrderService } from '../../../services/common/models/order.service';
import { Create_Order } from '../../../contracts/order/create_order';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../../services/ui/custom-toastr.service';
import { Router } from '@angular/router';
import { DialogService } from '../../../services/common/dialog.service';
import { BasketItemDeleteState, BasketItemRemoveDialogComponent } from '../../../dialogs/basket-item-remove-dialog/basket-item-remove-dialog.component';
import { BasketShoppingCompleteDialogComponent, ShoppingCompleteState } from '../../../dialogs/basket-shopping-complete-dialog/basket-shopping-complete-dialog.component';

declare var $:any;

@Component({
  selector: 'app-baskets',
  templateUrl: './baskets.component.html',
  styleUrl: './baskets.component.scss'
})
export class BasketsComponent implements OnInit{

  /**
   *
   */
  constructor(private basketService:BasketService, private orderService:OrderService,private toasterService :CustomToastrService ,private router:Router, private dialogService:DialogService) {
  }

  basketItems: List_Basket_Item[];
  async ngOnInit() {
   this.basketItems= await this.basketService.get();
  }

  async changeQuantity(object:any){
   const basketItemId : string = object.target.attributes["id"].value;
   const quantity: number = object.target.value;
   const basketItem:Update_Basket_Item = new Update_Basket_Item();
   basketItem.basketItemId = basketItemId;
   basketItem.quantity=quantity;
  await this.basketService.updateBasketItem(basketItem);

  }

 removeBasketItem(basketItemId:string){
  $("#basketModal").modal("hide")

    this.dialogService.openDialog({
      componentType:BasketItemRemoveDialogComponent,
      data:BasketItemDeleteState.Yes,
      afterClosed:async() => {
        await this.basketService.remove(basketItemId);
        $("."+basketItemId).fadeOut(2000);
        $("#basketModal").modal("show")

      }
    })
  }

   shoppingComplete(){
    $("#basketModal").modal("hide")
    this.dialogService.openDialog({
      componentType:BasketShoppingCompleteDialogComponent,
      data:ShoppingCompleteState.Yes,
      afterClosed:async()=>{
        const order: Create_Order = new Create_Order();
        order.address ="Bahar mahallesi";
        order.description="Zamazingo"
        await  this.orderService.create(order);
        this.toasterService.message("Sipariş Alınmıştır","Sipariş Oluşturuldu", {
          messageType:ToastrMessageType.Info,
          position:ToastrPosition.TopRight
        })
        this.router.navigate(["/"])

      }
    })

  }



}
