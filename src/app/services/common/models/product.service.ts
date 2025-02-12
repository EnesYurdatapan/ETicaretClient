import { ErrorHandler, Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { Create_Product } from '../../../contracts/create_product';
import { HttpErrorResponse } from '@angular/common/http';
import { List_Product } from '../../../contracts/list_product';
import { Observable, first, firstValueFrom } from 'rxjs';
import { List_Product_Image } from '../../../contracts/list_product_image';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpClientService:HttpClientService) { }

  create(product:Create_Product, successCallBack?:()=>void, errorCallBack? :(errorMesage:string)=>void){
    this.httpClientService.post({
      controller:"products"},product).subscribe(result=>{
        successCallBack();
      },(errorResponse:HttpErrorResponse)=>{
          const _error:Array<{key:string,value:Array<string>}>= errorResponse.error;
          let message ="";
          _error.forEach((v,index) => {
            v.value.forEach((_v,_index) => {
              message += `${_v}<br>`;
            });
          });
          errorCallBack(message);
      });
    
    
    }

    // async read(page:number=0, size:number=5,successCallBack?:()=>void, errorCallBack?:(errorMessage:string)=>void): Promise<{ count:number; products :List_Product[]}>{
    //   const promiseData:Promise<{ count:number; products :List_Product[]}> = this.httpClientService.get<{ count:number; products :List_Product[]}>({
    //     controller:"products",
    //      queryString:`page=${page}&size=${size}`
    //    }).toPromise();
    //    promiseData.then(d=>successCallBack())
    //    .catch((errorResponse:HttpErrorResponse)=> errorCallBack(errorResponse.message))
    //   return await promiseData;
    //  }


async read(page: number = 0, size: number = 5, successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void): Promise<{ count: number; products: List_Product[] }> {
  try {
    const promiseData = firstValueFrom(
      this.httpClientService.get<{ count: number; products: List_Product[] }>({
        controller: 'products',
        queryString: `page=${page}&size=${size}`
      })
    );

    const data = await promiseData;
    if (successCallBack) {
      successCallBack();
    }
    return data;
  } catch (error) {
    if (errorCallBack && error instanceof HttpErrorResponse) {
      errorCallBack(error.message);
    }
    throw error;
  }
}



   async delete(id:string){
      const deleteObservable : Observable<any>= this.httpClientService.delete<any>({
        controller:"products"
      }, id);

      await firstValueFrom(deleteObservable);
    }

   async readImages(id:string):Promise<List_Product_Image[]>{
     const getObservable:Observable<List_Product_Image[]> = this.httpClientService.get<List_Product_Image[]>({
        action:"getproductimages",
        controller:"products"
      },id);

      return await firstValueFrom(getObservable);
    }

    async deleteImage(id:string, imageId:string){
        const deleteObservable = this.httpClientService.delete({
          action:"deleteproductimage",
          controller:"products",
          queryString:`imageId=${imageId}`
        },id)
        await firstValueFrom(deleteObservable);
    }

    async changeShowcaseImage(imageId:string,productId:string,successCallBack?:()=> void):Promise<void>{
      const changeShowcaseImageObservable = await this.httpClientService.get({
        controller:"products",
        action:"ChangeShowcaseImage",
        queryString:`ImageId=${imageId}&productId=${productId}`
      });
      await firstValueFrom(changeShowcaseImageObservable);
      successCallBack();
    }

    async updateStockQrCodeToProduct(productId:string,stock:number, successCallBack?:()=>void){
        const observable:Observable<any> = this.httpClientService.put({
          action:"qrcode",
          controller:"products"
        },{productId,stock});

        await firstValueFrom(observable);
        successCallBack();
    }
  }

