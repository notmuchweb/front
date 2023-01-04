/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/quotes */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NotMuchService } from '../inot-much-service';
import { MailEdition } from '../mailedition/mail-edition';
import { Mail, MailVM, Thread } from '../model';
import esPath from 'espath';



@Component({
  selector: 'app-readthread',
  templateUrl: './readthread.component.html',
  styleUrls: ['./readthread.component.css']
})
export class ReadthreadComponent implements OnInit {

  enCalendar: any = {
    firstDayOfWeek: 1,
    // tslint:disable-next-line:quotemark
    dayNames: ['Sunday', "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    // tslint:disable-next-line:quotemark
    dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    // tslint:disable-next-line:quotemark
    dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    // tslint:disable-next-line:quotemark
    monthNames: ["January", "February", "March", "April", "May",
      // tslint:disable-next-line:quotemark
      "June", "July", "August", "September", "October", "November", "December"],
    // tslint:disable-next-line:quotemark
    monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    // tslint:disable-next-line:quotemark
    today: 'Today',
    clear: 'Clear',
    dateFormat: 'mm/dd/yy'
  };

  @Input()
  selectedThread?: Thread;

  @Input()
  showAllThread:boolean = false

  @Output()
  initMailView = new EventEmitter<MailEdition>();

  messages: Mail[]  =[];
  chronological = false;

  // Send ICS
  ics = false;
  icstitre = '';
  icsdate?: Date;
  icstime?: Date;
  icsduraction = 90;
  icsallday = false;
  icsmessage:any;

  // Task
  task = false;
  tasktitre?: string;
  taskdate?: Date;
  taskmessage:any;
  froms? :string[];

  constructor(  private messageService: MessageService,  private sanitizer: DomSanitizer,
    private notmuchService: NotMuchService,
    private confirmationService: ConfirmationService,
    ) { }

  ngOnInit() {
    console.error(esPath(['one', 2, {three: 3}], '//object')) // {three: 3}

    this.notmuchService.getFroms().subscribe(e=> {
           this.froms = e;
           this.notmuchService.getMails(this.selectedThread!.query[0],this.showAllThread).subscribe(messages => {
            if (!this.chronological) {
              this.messages = messages.reverse();
            } else {
              this.messages = messages;
            }
            if (this.messages.length > 0) {
              this.messages[0].tags = this.messages[0].tags.filter(tag => tag !== 'unread');
              this.notmuchService.removeTag(['id:' + this.messages[0].id], 'unread').subscribe(t1 => {

              });
            }
            // this.messages.forEach(m => console.log(m.attachments));
          });

    });


  }

  canBeEditAsNew(message:any) {
    if (message == null || message.headers == null || message.headers.From == null) {
      return false;
    } else {
      return this.froms!.some(e => message.headers.From.toLowerCase().includes(e.toLowerCase()));
    }
  }

  toICS(event:any, m:any) {
    event.stopPropagation();
    event.preventDefault();
    this.ics = true;
    this.icstitre = m.headers.Subject;
    this.icsmessage = m;
  }



  convertTask(event:any, m:any) {
    event.stopPropagation();
    event.preventDefault();
    this.task = true;
    this.tasktitre = m.headers.Subject;
    this.taskmessage = m;
  }
  sendICS() {
    this.ics = false;


    this.notmuchService.createICSMessage(this.icsmessage.id, this.icstitre,
      this.icsdate!, this.icstime!, this.icsduraction, this.icsallday).subscribe(obj => {
        const mailEdition = new MailEdition();
        mailEdition.from = obj.from!;
        mailEdition.subject = obj.subject!.replace('Re:', '');
        mailEdition.tos.push(obj.defaultto!);
        mailEdition.mailbody = ''; // obj.body;
        obj.attachments!.forEach((e:any) => {
          const byteArray = new Uint8Array(e.size);
          for (let x = 0; x < byteArray.length; x++) {
            byteArray[x] = parseInt('0', 16);
          }
          const f = new File([byteArray], e.name, { type: e.ct });

          mailEdition.uploadFilesMap.set(f, {
            messageid: e.messageid,
            icstitre: e.icstitre,
            icsdate: e.icsdate,
            icstime: e.icstime,
            icsduraction: e.icsduraction,
            icsallday: e.icsallday,
            name: e.name,
            size: e.size,
            ct: e.ct
          });
          mailEdition.uploadedFiles.push(f);
        });
        this.icstitre = '';
        this.icsdate = new Date(Date.now());
        this.icstime = new Date(Date.now());
        this.icsduraction = 90;
        this.icsallday = false;
        this.icsmessage = null;
        this.initMailView.emit(mailEdition);
      });
  }


  reply(event:any, m:any) {
    event.stopPropagation();
    event.preventDefault();
    this.notmuchService.reply(m.id).subscribe((obj:MailVM) => {
      const mailEdition = new MailEdition();
      mailEdition.from = obj.from!;
      if (obj.to != null) {
        const tos = obj.to.split(',');
        mailEdition.tos = [];
        let mailadress = '';
        let mailadresswithcomma = false;
        tos.forEach((mailadrr:any) => {
          let count = 0;
          const matches = mailadrr.match(new RegExp('"', 'gi'));
          if (matches != null) {
            count = matches.length;
          }
          if (count === 0 || count > 1) {
            if (mailadresswithcomma) {
              mailadress = mailadress + mailadrr;
            } else {
              mailEdition.tos.push(mailadrr);
              console.log('ok');
            }
          } else {
            if (mailadresswithcomma) {
              mailadresswithcomma = !mailadresswithcomma;
              mailadress = mailadress + mailadrr;
              mailEdition.tos.push(mailadress);
              mailadress = '';
            } else {
              mailadresswithcomma = !mailadresswithcomma;
              mailadress = mailadress + mailadrr;
            }
          }
        });
      }
      mailEdition.subject = obj.subject!;
      mailEdition.mailbody = obj.body!;
//      (window as any).spellCheckHandler.provideHintText(obj.text);
      mailEdition.mailinReplyTo = obj.inReplyTo;
      mailEdition.mailreference = obj.references;
      this.initMailView.emit(mailEdition);


    });

  }

  replyAll(event:any, m:any) {
    event.stopPropagation();
    event.preventDefault();
    this.notmuchService.replyAll(m.id).subscribe((obj:MailVM) => {
      const mailEdition = new MailEdition();
      mailEdition.from = obj.from!;
      if (obj.to != null) {
        const tos = obj.to.split(',');
        mailEdition.tos = [];
        let mailadress = '';
        let mailadresswithcomma = false;
        tos.forEach((mailadrr:any) => {
          let count = 0;
          const matches = mailadrr.match(new RegExp('"', 'gi'));
          if (matches != null) {
            count = matches.length;
          }
          if (count === 0 || count > 1) {
            if (mailadresswithcomma) {
              mailadress = mailadress + mailadrr;
            } else {
              mailEdition.tos.push(mailadrr);
              console.log('ok');
            }
          } else {
            if (mailadresswithcomma) {
              mailadresswithcomma = !mailadresswithcomma;
              mailadress = mailadress + mailadrr;
              mailEdition.tos.push(mailadress);
              mailadress = '';
            } else {
              mailadresswithcomma = !mailadresswithcomma;
              mailadress = mailadress + mailadrr;
            }
          }
        });
      }
      if (obj.cc != null) {
        const ccs = obj.cc.split(',');
        mailEdition.ccs = [];
        let mailadress = '';
        let mailadresswithcomma = false;
        ccs.forEach((mailadrr:any) => {
          let count = 0;
          const matches = mailadrr.match(new RegExp('"', 'gi'));
          if (matches != null) {
            count = matches.length;
          }
          if (count === 0 || count > 1) {
            if (mailadresswithcomma) {
              mailadress = mailadress + mailadrr + ', ';
            } else {
              mailEdition.ccs.push(mailadrr);
              console.log('ok');
            }
          } else {
            if (mailadresswithcomma) {
              mailadresswithcomma = !mailadresswithcomma;
              mailadress = mailadress + mailadrr;
              mailEdition.ccs.push(mailadress);
              mailadress = '';
            } else {
              mailadresswithcomma = !mailadresswithcomma;
              mailadress = mailadress + mailadrr + ', ';
            }
          }
        });
      }
      mailEdition.subject = obj.subject!;
      mailEdition.mailbody = obj.body!;
      mailEdition.mailinReplyTo = obj.inReplyTo;
      mailEdition.mailreference = obj.references;
      this.initMailView.emit(mailEdition);


    });
  }
  forward(event:any, m:any) {
    event.stopPropagation();
    event.preventDefault();
    this.notmuchService.forward(m.id).subscribe((obj:MailVM) => {
      const mailEdition = new MailEdition();
      mailEdition.from = obj.from!;
      mailEdition.subject = obj.subject!.replace('Re:', 'Fwd:');
      mailEdition.mailbody = obj.body!;
      mailEdition.mailreference = obj.references;

      obj.attachments!.forEach((e:any) => {
        const byteArray = new Uint8Array(e.size);
        for (let x = 0; x < byteArray.length; x++) {
          byteArray[x] = parseInt('0', 16);
        }
        const f = new File([byteArray], e.name, { type: e.ct });

        mailEdition.uploadFilesMap.set(f, {
          messageid: e.messageid,
          partid: e.partid,
          name: e.name,
          size: e.size,
          ct: e.ct
        });
        mailEdition.uploadedFiles.push(f);
      });
      this.initMailView.emit(mailEdition);



    });

  }

  editAsNew(event:any, m:any) {
    event.stopPropagation();
    event.preventDefault();
    this.notmuchService.editAsNew(m.id).subscribe((obj:MailVM|null) => {
      const mailEdition = new MailEdition();

      mailEdition.from = 'barais@irisa.fr';
      if (obj != null){
        if (obj.to != null) {
          mailEdition.tos = obj.to.split(',');
        }
        if (obj.cc != null) {
          mailEdition.ccs = obj.cc.split(',');
        }
        if (obj.bcc != null) {
          mailEdition.bccs = obj.bcc.split(',');
        }
        mailEdition.subject = obj.subject!;
        mailEdition.mailbody = obj.body!;
        obj.attachments!.forEach((e:any) => {
          const byteArray = new Uint8Array(e.size);
          for (let x = 0; x < byteArray.length; x++) {
            byteArray[x] = parseInt('0', 16);
          }
          const f = new File([byteArray], e.name, { type: e.ct });

          mailEdition.uploadFilesMap.set(f, {
            messageid: e.messageid,
            partid: e.partid,
            name: e.name,
            size: e.size,
            ct: e.ct
          });
          mailEdition.uploadedFiles.push(f);
        });

      }

      this.initMailView.emit(mailEdition);


    });

  }

    // TODO manage initRememberTheMilk

  /* initRememberTheMilk(event:any) {
    event.stopPropagation();
    event.preventDefault();
    this.rtmservice.getURLApi().then((e:any) => {
      // shell.openExternal(e);
    });
    this.confirmationService.confirm({
      message: 'Did you accept the RTM rights for your app',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.rtmservice.getAndSaveAuthToken().then().catch((e:any) => {
          this.messageService.add({ severity: 'info', summary: 'Rejected', detail: 'Cannot connect to RTM' });
        });
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You can now use RTM' });
      },
      reject: () => {
        //        this.messageService.add({severity: 'info', summary: 'Rejected', detail: 'You have rejected'});
      }
    });
  } */

  markthreadAsRead(t: Thread) {

    this.notmuchService.removeTag(['thread:' + t.thread], 'unread').subscribe(t1 => {
      const index = t.tags.indexOf('unread');
      if (index > -1) {
        t.tags.splice(index, 1);
      }
      this.messages.forEach(m => {
        const index1 = m.tags.indexOf('unread');
        if (index1 > -1) {
          m.tags.splice(index1, 1);
        }
      });

    });
  }

  isHtml(message: Mail): boolean {

   return esPath(message,'//key[. = "content-type"]/following-sibling::value[. ="text/html"]').length > 0
  }
  getHtml(message: Mail) {
    const html = this.sanitizer.bypassSecurityTrustHtml(message.content);


    return html;
  }


  getTextPlain(message: Mail): string {
    const res = esPath(message,'//key[. = "content-type"]/following-sibling::value[. ="text/plain"]/../..')
    if (res.length>0) {
      return res[0].content // {three: 3}
    }
    else return "";


  }

  showSaveDialog(event:any, name:any, messageid:any, partid:any) {
    event.stopPropagation();
    event.preventDefault();
    this.notmuchService.download(messageid, partid).subscribe(e=> {
      const src = `data:application/octet-stream;base64,${e.content}`;
      const link = document.createElement("a")
      link.href = src
      link.download = name
      link.click()
      link.remove()

      });
  }



  onTabOpen(e:any) {
    const index = e.index;
    if ((this.messages[index].tags != null) && (this.messages[index].tags.includes('unread'))) {
      this.notmuchService.removeTag(['id:' + this.messages[index].id], 'unread').subscribe(t1 => {

        this.messages[index].tags = this.messages[index].tags.filter(tag => tag !== 'unread');
      });

    }
  }

  handleChangeChronological($event:any) {
    this.messages = this.messages.reverse();
    if (this.messages.length > 0) {
      this.messages[0].tags = this.messages[0].tags.filter(tag => tag !== 'unread');
      this.notmuchService.removeTag(['id:' + this.messages[0].id], 'unread').subscribe(t1 => {

              })        ;
    }

  }

  // TODO create task
/*
  createTask() {
    this.task = false;

    this.rtmservice.addTask(this.tasktitre, this.taskdate, 'id:' + this.taskmessage.id).then((e:any) => {
      this.messageService.add({ severity: 'info', summary: 'task added', detail: '' });
      this.taskdate = undefined;
      this.taskmessage = null;
      this.tasktitre = undefined;
    }).catch((e:any) => {
      this.messageService.add({ severity: 'warning', summary: 'cannot add task', detail: '' });
      this.taskdate = undefined;
      this.taskmessage = null;
      this.tasktitre = undefined;
    });

  }*/

  onIcsHide() {
    this.ics = false;
    this.icsallday = false;

  }

  onIcsShow() {

  }

  onTaskHide() {
    this.task = false;
  }

  onTaskShow() {

  }

}
