/* eslint-disable max-len */
/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit, ViewChild, ElementRef, Input, Output,
   EventEmitter, AfterViewInit, AfterViewChecked, AfterContentChecked } from '@angular/core';
import { MailEdition } from './mail-edition';
// import { NotMuchService } from '../not-much.service';
import { MessageService, SelectItem } from 'primeng/api';
import { NotMuchService } from '../inot-much-service';
import { NotMuchConfig } from '../model';


const Keys = {
  TAB: 9,
  ENTER: 13,
  ESCAPE: 27,
  SPACE: 33,
  UP: 38,
  DOWN: 40,
};


@Component({
  selector: 'app-mailedition',
  templateUrl: './mailedition.component.html',
  styleUrls: ['./mailedition.component.css']
})
export class MaileditionComponent implements OnInit, AfterViewInit, AfterViewChecked, AfterContentChecked {

  @ViewChild('editor') editorel: ElementRef |undefined;
  @ViewChild('to', { read: ElementRef }) private autoCompleteTo: ElementRef|undefined;
  @ViewChild('cc', { read: ElementRef }) private autoCompleteCc: ElementRef|undefined;
  @ViewChild('bcc', { read: ElementRef }) private autoCompleteBcc: ElementRef|undefined;
  @ViewChild('mailcontent', { read: ElementRef }) private mailContent: ElementRef|undefined;
  froms: SelectItem[] = [];

  @Input()
  mailEdition: MailEdition = new MailEdition();

  @Input()
  config?: NotMuchConfig ;

  @Output()
  cancelMailView = new EventEmitter<MailEdition>();

  constructor(private messageService: MessageService,
    private notmuchService: NotMuchService) {


  }

  ngOnInit() {
    this.notmuchService.getFroms().subscribe(e=>{
      this.mailEdition!.from = e[0];
    });
    this.froms = [];
    this.notmuchService.getFroms().subscribe(e=> e.forEach(e1 => {
      this.froms!.push({ label: e1, value: e1 });
    })
    );


  }

  ngAfterContentChecked(): void {
    //  this.autoCompleteTo.


  }

  ngAfterViewChecked(): void {

  }
  ngAfterViewInit(): void {
    window.setTimeout(() => {
      this.autoCompleteTo!.nativeElement.children[0].children[0].children[0].children[0].focus();
    });
    this.onMailShow();
    // this.autoCompleteTo.nativeElement.children[0].children[0].children[0].children[0].focus();

  }

  onEditorInit(event: any) {
    event.editor.root.focus();
  }



  myUploader(event: any, upload: any) {
    for (const file of event.files) {
      if (!this.mailEdition!.uploadedFiles.includes(file)) {
        this.mailEdition!.uploadedFiles.push(file);
        const reader = new FileReader();
        (reader as any).name = file.name;
        reader.onload = (() => {
          return (e) => {
            this.mailEdition!.uploadFilesMap.set(file.name, e.target!.result);
          };
        })();
        reader.readAsDataURL(file);
      }
    }
    // this.mailEdition.uploadFilesMap.clear();
     upload.clear();

    this.messageService.add({ severity: 'info', summary: 'File Uploaded', detail: '' });
  }


  deleteAttachement(file: any) {
    this.mailEdition!.uploadedFiles = this.mailEdition!.uploadedFiles.filter(item => item !== file);
    this.mailEdition!.uploadFilesMap.delete(file.name);
  }

  searchto(event: any) {
    this.notmuchService.getMailAddress(event.query).subscribe((res:any) => {
      // tslint:disable-next-line:max-line-length
      const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      let validadress = true;
      let emailcheck = event.query.trim();
      if (event.query.includes('<')) {
        emailcheck = event.query.slice(event.query.indexOf('<') + 1, event.query.indexOf('>')).trim();
      }
      validadress = validadress && re.test(emailcheck);
      if (validadress) {
        res.push(event.query.trim());
      }
      this.mailEdition!.resultsto = res;
    });
  }

  searchcc(event: any) {
    this.notmuchService.getMailAddress(event.query).subscribe((res:any) => {
      // tslint:disable-next-line:max-line-length
      const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      let validadress = true;
      let emailcheck = event.query.trim();
      if (event.query.includes('<')) {
        emailcheck = event.query.slice(event.query.indexOf('<') + 1, event.query.indexOf('>')).trim();
      }
      validadress = validadress && re.test(emailcheck);
      if (validadress) {
        res.push(event.query.trim());
      }
      this.mailEdition!.resultscc = res;
    });
  }
  searchbcc(event: any) {
    this.notmuchService.getMailAddress(event.query).subscribe((res:any) => {
      // tslint:disable-next-line:max-line-length
      const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      let validadress = true;
      let emailcheck = event.query.trim();
      if (event.query.includes('<')) {
        emailcheck = event.query.slice(event.query.indexOf('<') + 1, event.query.indexOf('>')).trim();
      }
      validadress = validadress && re.test(emailcheck);
      if (validadress) {
        res.push(event.query.trim());
      }
      this.mailEdition!.resultsbcc = res;
    });
  }

  onMailShow() {
    // this.elem.nativeElement.focus();
    const editor = this.editorel as any;
    editor.quill.keyboard.addBinding({
      key: Keys.UP,
      shortKey: true
    }, (range:any, context:any) => {
      let text = '';
      if (range > 20) {
        text = editor.quill.getText(range.index - 20, 20);
      } else {
        text = editor.quill.getText(0, range.index);
      }



      const words = text.split(/,| |\n|;/);
      const word = words.pop();

      if (this.config && this.config.shortcutmailtyping){

       const match = this.config!.shortcutmailtyping!.find((e :any) => e.shortcut === word);
      if (match !== undefined) {
        const deletesize = word!.length;
        const formula = '' + match.formula;
        let d2 = {};
        if (range.index - word!.length > 0) {
          d2 = {
            ops: [
              { retain: range.index - word!.length },
              { delete: deletesize },
              { insert: formula }
            ]
          };
        } else {
          d2 = {
            ops: [
              { delete: deletesize },
              { insert: formula }
            ]
          };
        }
        editor.quill.updateContents(d2, 'user');
      }
    }

    });

    editor.quill.keyboard.addBinding({
      key: Keys.TAB,
      shortKey: true
    }, (range:any, context:any) => {
      let text = '';
      text = editor.quill.getText(0, range.index);
    });


    //    editor.quill.enable(false);
    // this.autoCompleteObject.focusInput();
    //    console.log(this.toel);
    //
    //    this.toel.nativeElement.focus();
    // .domHandler.findSingle(this.toel.el.nativeElement, 'input').focus();

  }


  cancelMail() {
    this.mailEdition!.tos = [];
    this.mailEdition!.ccs = [];
    this.mailEdition!.bccs = [];
    this.mailEdition!.mailbody = '';
    this.mailEdition!.subject = '';
    this.mailEdition!.mailreference = '';
    this.mailEdition!.mailinReplyTo = '';

    this.autoCompleteTo!.nativeElement.children[0].
      children[0].children[this.autoCompleteTo!.nativeElement.children[0].
        children[0].children.length - 1].children[0].value = '';
    this.autoCompleteCc!.nativeElement.children[0].
      children[0].children[this.autoCompleteCc!.nativeElement.children[0].
        children[0].children.length - 1].children[0].value = '';
    this.autoCompleteBcc!.nativeElement.children[0].
      children[0].children[this.autoCompleteBcc!.nativeElement.children[0].
        children[0].children.length - 1].children[0].value = '';


    this.mailEdition!.resultsto = [];
    this.mailEdition!.resultscc = [];
    this.mailEdition!.resultsbcc = [];
    this.mailEdition!.uploadedFiles = [];
    this.mailEdition!.uploadFilesMap = new Map();
    this.cancelMailView.emit(this.mailEdition);




  }
  saveAsDraft() {
    this.notmuchService.sendMail(this.mailEdition!.from,
      this.mailEdition!.tos.join(', '), this.mailEdition!.ccs.join(', '), this.mailEdition!.bccs.join(', '), this.mailEdition!.subject,
      this.mailEdition!.mailbody, this.mailEdition!.uploadFilesMap, true,
      this.mailEdition!.mailreference!, this.mailEdition!.mailinReplyTo!).subscribe(res => {
        if (res) {
          this.messageService.add({ severity: 'info', summary: 'Draft saved in Drafts folder', detail: '' });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Cannot saved Draft in Drafts folder', detail: '' });
        }
      });
    this.cancelMail();
  }
  sendMail() {
    // tslint:disable-next-line:max-line-length
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let validadress = true;
    if (this.mailEdition!.tos.length > 0) {
      this.mailEdition!.tos.forEach((email: string) => {
        let emailcheck = email.trim();
        if (email.includes('<')) {
          emailcheck = email.slice(email.indexOf('<') + 1, email.indexOf('>')).trim();
        }
        validadress = validadress && re.test(emailcheck);
      });
    }
    if (this.mailEdition!.ccs.length > 0) {

      this.mailEdition!.ccs.forEach((email: string) => {
        let emailcheck = email.trim();
        if (email.includes('<')) {
          emailcheck = email.slice(email.indexOf('<') + 1, email.indexOf('>')).trim();
        }
        validadress = validadress && re.test(emailcheck);
      });
    }
    if (this.mailEdition!.bccs.length > 0) {

      this.mailEdition!.bccs.forEach((email: string) => {
        let emailcheck = email.trim();
        if (email.includes('<')) {
          emailcheck = email.slice(email.indexOf('<') + 1, email.indexOf('>')).trim();
        }
        validadress = validadress && re.test(emailcheck);
      });
    }
    if (validadress) {

      this.notmuchService.sendMail(this.mailEdition!.from,
        this.mailEdition!.tos.join(', '), this.mailEdition!.ccs.join(', '), this.mailEdition!.bccs.join(', '), this.mailEdition!.subject,
        this.mailEdition!.mailbody, this.mailEdition!.uploadFilesMap, false, this.mailEdition!.mailreference!, this.mailEdition!.mailinReplyTo!).subscribe(res => {
          if (res) {
            this.messageService.add({ severity: 'info', summary: 'Email sent', detail: '' });
          } else {
            this.messageService.add({
              severity: 'warning',
              summary: 'Cannot send message (no connection), message will be sent later (placed in Outbox folder)', detail: ''
            });
          }
        });
      this.cancelMail();
    } else {
      this.messageService.add({ severity: 'error', summary: 'cannot sent email please check email address', detail: '' });
    }

  }

}
