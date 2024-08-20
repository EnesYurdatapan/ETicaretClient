import { Component, Inject, OnInit } from '@angular/core';
import { BaseDialog } from '../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogService } from '../../services/common/dialog.service';
import { QrCodeService } from '../../services/common/qr-code.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-qrcode-dialog',
  templateUrl: './qrcode-dialog.component.html',
  styleUrl: './qrcode-dialog.component.scss'
})
export class QrcodeDialogComponent extends BaseDialog<QrcodeDialogComponent> implements OnInit {

  constructor(private dialogService:DialogService, private qrCodeService : QrCodeService, private domSanitizer:DomSanitizer,
    dialogRef: MatDialogRef<QrcodeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
  ) {
    super(dialogRef);
  }


  qrCodeSafeUrl:SafeHtml;
  async ngOnInit() {
  const qrCodeBlob:Blob = await this.qrCodeService.generateQrCode(this.data);
  const url :string= URL.createObjectURL(qrCodeBlob);
 this.qrCodeSafeUrl = this.domSanitizer.bypassSecurityTrustUrl(url);
}
}
