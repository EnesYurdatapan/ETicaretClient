import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../../services/common/models/product.service';
import { List_Product } from '../../../../contracts/list_product';
import { ActivatedRoute } from '@angular/router';
import { FileService } from '../../../../services/common/models/file.service';
import { BaseUrl } from '../../../../contracts/base_url';
import { BasketService } from '../../../../services/common/models/basket.service';
import { Create_Basket_Item } from '../../../../contracts/basket/create_basket_item';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../../../services/ui/custom-toastr.service';
import { Position } from '../../../../services/admin/alertify.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {

/**
 *
 */
constructor(private toastrService:CustomToastrService,private basketService:BasketService,private productService:ProductService, private activatedRoute:ActivatedRoute,private fileService:FileService) {}
currentPageNo:number;
totalProductCount:number;
totalPageCount:number;
pageSize:number=12;
pageList: number[]=[];
products : List_Product[];
baseUrl:BaseUrl;

async ngOnInit() {

  this.baseUrl=await this.fileService.getBaseStorageUrl();

  this.activatedRoute.params.subscribe(async params=>{
    this.currentPageNo = parseInt(params["pageNo"] ?? 1);
    const data:{count:number, products : List_Product[]} = await this.productService.read(this.currentPageNo-1,this.pageSize, ()=>{

    }, errorMesage => {
  
    });
    this.products = data.products;
     for (let index = 0; index < this.products.length; index++) {
       console.log(this.products[index].productImageFiles)      
     }
    this.products = this.products.map<List_Product>(p => {
      const listProduct: List_Product = {
        id: p.id,
        createdDate: p.createdDate,
        imagePath: p.productImageFiles.length? p.productImageFiles.find(p => p.showCase).fileName : "",
        name: p.name,
        price: p.price,
        stock: p.stock,
        updatedDate: p.updatedDate,
        productImageFiles: p.productImageFiles
      };

      return listProduct;
    });

    this.totalProductCount=data.count;
    this.totalPageCount = Math.ceil(this.totalProductCount / this.pageSize);
    this.pageList = [];

    if (this.currentPageNo-3<=0)
      for (let i =1; i <=7; i++)
        this.pageList.push(i);

    else if(this.currentPageNo+3>=this.totalPageCount)
      for(let i=this.totalPageCount-6;i<=this.totalPageCount;i++)
        this.pageList.push(i);

    else
      for(let i=this.currentPageNo-3;i<=this.currentPageNo+3;i++)
        this.pageList.push(i);
  });
 
}

async addToBasket(product:List_Product){
let _basketItem:Create_Basket_Item = new Create_Basket_Item();
_basketItem.productId=product.id;
_basketItem.quantity=1;
await this.basketService.add(_basketItem);
this.toastrService.message("Ürün sepete eklenmiştir","Sepete Eklendi", {
  position:ToastrPosition.TopRight,
  messageType:ToastrMessageType.Success
})
};


}
