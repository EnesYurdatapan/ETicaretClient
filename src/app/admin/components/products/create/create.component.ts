import { Component, EventEmitter, Output } from '@angular/core';
import { ProductService } from '../../../../services/common/models/product.service';
import { Create_Product } from '../../../../contracts/create_product';
import { AlertifyService, MessageType, Position } from '../../../../services/admin/alertify.service';
import { FileUploadOptions } from '../../../../services/common/fileupload/fileupload.component';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {

  constructor(private productService:ProductService,private alertify:AlertifyService){}

@Output() createdProduct : EventEmitter<Create_Product> = new EventEmitter();



  create(name:HTMLInputElement, stock:HTMLInputElement, price:HTMLInputElement){
    const create_product:Create_Product= new Create_Product();
    create_product.name=name.value;
    create_product.stock=parseInt(stock.value);
    create_product.price=parseFloat(price.value);

    this.productService.create(create_product, ()=>{
      this.alertify.message("Ürün başarıyla eklenmiştir.", {
        dismissOthers:true,
        messageType:MessageType.Success,
        position:Position.BottomRight
      });
      this.createdProduct.emit(create_product);
    }, errorMessage => {
      this.alertify.message(errorMessage, {
        dismissOthers:true,
        messageType:MessageType.Error,
        position: Position.TopRight

      })
    });
  }

}
