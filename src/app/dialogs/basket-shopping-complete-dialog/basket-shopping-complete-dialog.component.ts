import { Component, Inject, OnDestroy } from '@angular/core';
import { BaseDialog } from '../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

declare var $:any;

@Component({
  selector: 'app-basket-shopping-complete-dialog',
  templateUrl: './basket-shopping-complete-dialog.component.html',
  styleUrl: './basket-shopping-complete-dialog.component.scss'
})
export class BasketShoppingCompleteDialogComponent extends BaseDialog<BasketShoppingCompleteDialogComponent> implements OnDestroy{

  /**
   *
   */
  constructor(dialogRef:MatDialogRef<BasketShoppingCompleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ShoppingCompleteState,
  ) {
    super(dialogRef);
    
  }
  show:boolean = false;
  complete(){
    this.show=true;
  }

  ngOnDestroy(): void {
    if(!this.show)
      $("#basketModal").modal("show");
  }

}

export enum ShoppingCompleteState{
  Yes,
  No
}