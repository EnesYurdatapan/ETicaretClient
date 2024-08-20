import { ComponentFactoryResolver, Injectable, ViewContainerRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DynamicLoadComponentService {

  //ViewContainerRef : Dinamik olarak yüklenecek componenti içerisinde barındıran container.(Her dinamik yükleme sürecinde önceki view'ları clear etmemiz gerekir.)
  // ComponentFactory : Component'lerin instancelarını oluşturmak için kullanılan nesnedir.
  //ComponentFactoryResolver : Belirli bir component için ComponentFactory'i resolve eden sınıftır.
  constructor() { }

  async loadComponent(component:ComponentType,viewContainerRef:ViewContainerRef){
    let _component:any = null;
    switch (component) {
      case ComponentType.BasketsComponent:
        _component = (await import("../../ui/components/baskets/baskets.component")).BasketsComponent;
        break;
    }
    viewContainerRef.clear();
    return viewContainerRef.createComponent(_component)
  }
}


export enum ComponentType{
  BasketsComponent
}