import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogService } from '../../services/common/dialog.service';
import { QrCodeService } from '../../services/common/qr-code.service';
import { BaseDialog } from '../base/base-dialog';
import { NgxScannerQrcodeComponent } from 'ngx-scanner-qrcode';
import { MatButton } from '@angular/material/button';
import { AlertifyService, MessageType, Position } from '../../services/admin/alertify.service';
import { ProductService } from '../../services/common/models/product.service';

declare var $:any

@Component({
  selector: 'app-qrcode-reading-dialog',
  templateUrl: './qrcode-reading-dialog.component.html',
  styleUrl: './qrcode-reading-dialog.component.scss'
})
export class QrcodeReadingDialogComponent<QrcodeReadingDialogComponent> extends BaseDialog<QrcodeReadingDialogComponent>  implements OnInit,OnDestroy {

  constructor(private productService:ProductService, private dialogService:DialogService, private alertifyService : AlertifyService,
    dialogRef: MatDialogRef<QrcodeReadingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
  ) {
    super(dialogRef)
  }

@ViewChild("scanner", {static:true}) scanner:NgxScannerQrcodeComponent;
@ViewChild("txtStock", {static:true}) txtStock:ElementRef;

ngOnInit(): void {
    this.scanner.start();
  }

  ngOnDestroy(): void {
    this.scanner.stop();
  }

  onEvent(e){
    const firstElement = e[0];
    const data = firstElement.value;

 if (data != null && data != "") {
   const jsonData = JSON.parse(data);
   const stockValue = (this.txtStock.nativeElement as HTMLInputElement).value;
   $("#btnClose").click();

    this.productService.updateStockQrCodeToProduct(jsonData.Id,parseInt(stockValue),()=>{

      this.alertifyService.message(`${jsonData.Name} ürünün stok bilgisi güncellendi`, {
        messageType : MessageType.Success,
        position:Position.TopRight
      });
    });
   }
  }
}


