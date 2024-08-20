import { Component, OnInit } from '@angular/core';
import { SignalRService } from '../../../services/common/signalr.service';
import { ReceiveFunctions } from '../../../constants/receivefunctions';
import { HubUrls } from '../../../constants/hub-urls';
import { AlertifyService, MessageType, Position } from '../../../services/admin/alertify.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{

/**
 *
 */
constructor(private signalRService:SignalRService,private alertifyService:AlertifyService) {
}

ngOnInit(): void {
  this.signalRService.on(HubUrls.ProductHub,ReceiveFunctions.ProductAddedMessageReceiveFunction, message=> {
    this.alertifyService.message(message,{
      messageType:MessageType.Notify,
      position:Position.TopRight
    });
  })

  this.signalRService.on(HubUrls.OrderHub,ReceiveFunctions.OrderAddedMessageReceiveFunction, message=> {
    this.alertifyService.message(message,{
      messageType:MessageType.Notify,
      position:Position.TopCenter
    });
  })
}

}
