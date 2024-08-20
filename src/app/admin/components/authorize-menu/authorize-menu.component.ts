import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { ApplicationService } from '../../../services/common/models/application.service';
import { Menu } from '../../../contracts/application-configurations/menu';
import { DialogService } from '../../../services/common/dialog.service';
import { AuthorizeMenuDialogComponent } from '../../../dialogs/authorize-menu-dialog/authorize-menu-dialog.component';

@Component({
  selector: 'app-authorize-menu',
  templateUrl: './authorize-menu.component.html',
  styleUrl: './authorize-menu.component.scss'
})
export class AuthorizeMenuComponent implements OnInit {

  constructor(private dialogService:DialogService, private applicationService:ApplicationService) {
  }

  async ngOnInit() {
    this.dataSource.data = await (await this.applicationService.getAuthorizeDefinitionEndpoints()).map(m=> {
      const treeMenu:ITreeMenu = {
        menuName:m.menuName,
        actions:m.actions.map(a=> {
            const _treeMenu:ITreeMenu = {
              menuName:a.definition,
              code:a.code,
              baseMenuName: m.menuName
            }
            return _treeMenu;
        })
      }
      return treeMenu;
    });

  }

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    (menu: ITreeMenu, level: number) => {
      return {
        expandable: menu.actions?.length>0,
        name: menu.menuName,
        level: level,
        code:menu.code,
        baseMenuName:menu.baseMenuName
      };
    },
    menu => menu.level,
    menu => menu.expandable,
    menu => menu.actions
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);


  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  assignRole(code:string, name:string,baseMenuName:string){
    this.dialogService.openDialog({
      componentType:AuthorizeMenuDialogComponent,
      data: {code,name,baseMenuName},
      options:{
        width:"750px"
      },
      afterClosed:()=>{

      }
    })
  }


}


interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

interface FoodNode {
  name: string;
  children?: FoodNode[];
}
interface ITreeMenu{
  menuName?: string,
    actions?:ITreeMenu[],
    code?:string,
    baseMenuName?:string
  }


