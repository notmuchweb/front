import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

// NG Translate


import { AppComponent } from './app.component';
import { ConfirmationService, MessageService } from 'primeng/api';



// NG Translate
import {MenubarModule} from 'primeng/menubar';


import {DialogModule} from 'primeng/dialog';

import {AccordionModule} from 'primeng/accordion';     // accordion and accordion tab
import {TreeModule} from 'primeng/tree';
import {ButtonModule} from 'primeng/button';
import {PanelModule} from 'primeng/panel';
import {TabViewModule} from 'primeng/tabview';
import {SplitButtonModule} from 'primeng/splitbutton';

import {SidebarModule} from 'primeng/sidebar';
import {ToastModule} from 'primeng/toast';
import {DataViewModule} from 'primeng/dataview';
import {DropdownModule} from 'primeng/dropdown';
import {CheckboxModule} from 'primeng/checkbox';
import {RatingModule} from 'primeng/rating';
import {AutoCompleteModule} from 'primeng/autocomplete';

import { ClipboardModule } from 'ngx-clipboard';
import {EditorModule} from 'primeng/editor';
import {InputTextModule} from 'primeng/inputtext';
import {FileUploadModule} from 'primeng/fileupload';
import {InputSwitchModule} from 'primeng/inputswitch';

import { TagfilterPipe } from './tagfilter.pipe';
import {TooltipModule} from 'primeng/tooltip';
import {CalendarModule} from 'primeng/calendar';
import {SliderModule} from 'primeng/slider';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import { MaileditionComponent } from './mailedition/mailedition.component';
import { ReadthreadComponent } from './readthread/readthread.component';


import {ContextMenuModule} from 'primeng/contextmenu';
import {HotkeyModule} from 'angular2-hotkeys';
import { HomeComponent } from './components/home/home.component';




@NgModule({
  declarations: [
    TagfilterPipe,
    MaileditionComponent,
    ReadthreadComponent,
    HomeComponent,
    AppComponent  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    ButtonModule,
    PanelModule,
    TabViewModule,
    MenubarModule,
    SidebarModule,
    TreeModule,
    DropdownModule,
    ToastModule,
    DataViewModule,
    RatingModule,
    CheckboxModule,
    AccordionModule,
    ClipboardModule,
    DialogModule,
    SplitButtonModule,
    AutoCompleteModule,
    EditorModule,
    InputTextModule,
    FileUploadModule,
    InputSwitchModule,
    TooltipModule,
    CalendarModule,
    SliderModule,
    ConfirmDialogModule,
    ContextMenuModule,
    HotkeyModule.forRoot(),
    AppRoutingModule,
  ],
  providers: [MessageService, ConfirmationService ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
