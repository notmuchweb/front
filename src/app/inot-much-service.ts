import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Mail, TreeNode,Thread, MailVM, AttachmentForward, AttachmentICSForward, FileDTO, FileContentDTO, NotMuchConfig } from './model';


export interface INotMuchService{
  getFroms(): Observable<string[]> ; //done
  getMailFolder(): Observable<TreeNode[]> ; //done
  getMailAddress(query: string): Observable<string[]>;
  getThread(query: string, offset: number, rows: number,includeSpamThread:boolean) : Observable<Thread[]> ;
  addTag(threadIds: string[], tag: string): Observable<void>;
  removeTag(threadIds: string[], tag: string): Observable<void>;
  delete(threadIds: string[]) : Observable<void>;
  spam(threadIds: string[]): Observable<void>;
  archive(threadIds: string[]): Observable<void>;
  getTags(includeSpamThread:boolean): Observable<string[] >;
  countAllThread(query: string): Observable<number >;
  getMails(query: string, allThread:boolean): Observable<Mail[] >;
  sendMail(sender: string, to: string, cc: string, bcc: string, subject: string, html: string, files: Map<FileDTO, string | ArrayBuffer | AttachmentForward | AttachmentICSForward>, isDraft: boolean, mailreference: string, mailinReplyTo: string): Observable<boolean> ;
  reply(messageid: string):Observable<MailVM> ;
  forward(messageid: string):Observable<MailVM>;
  createICSMessage(messageid: string, icstitre: string, icsdate: Date, icstime: Date, icsduraction: number, icsallday: boolean): Observable<MailVM>;
  editAsNew(messageid: string): Observable<MailVM | null>;
  replyAll(messageid: string): Observable<MailVM> ;
  download(messageid: string, partid:number):Observable<FileContentDTO>;
  getConfig():Observable<NotMuchConfig>;
  getDirectories():Observable<string[]>;
}

@Injectable({
  providedIn: 'root'
})
export class NotMuchService implements INotMuchService {

  constructor(private http:HttpClient){};
  getFroms(): Observable<string[]> {
    return this.http.get<string[]>('/api/getFroms');
  }
  getMailFolder(): Observable<TreeNode[]> {
    return this.http.get<TreeNode[]>('/api/getMailFolder');
  }
  getMailAddress(query: string): Observable<string[]> {
    return this.http.get<string[]>('/api/getMailAddress', {
      params: {
        query: query,
      }
    });
  }
  getThread(query: string, offset: number, rows: number, includeSpamThread: boolean): Observable<Thread[]> {
    return this.http.get<Thread[]>('/api/getThread', {
      params: {
        query: query,
        offset: offset,
        rows: rows,
        includeSpamThread:includeSpamThread
      }
    });
  }
  addTag(threadIds: string[], tag: string): Observable<void> {
    return this.http.post<void>('/api/addTag', {
      threadIds: threadIds,
      tag: tag
    });
  }

  removeTag(threadIds: string[], tag: string): Observable<void> {
    return this.http.post<void>('/api/removeTag', {
      threadIds: threadIds,
      tag: tag
    });
  }
  delete(threadIds: string[]): Observable<void> {
    return this.http.delete<void>('/api/delete', {body:{
      threadIds: threadIds
  }}) ;
  }
  spam(threadIds: string[]): Observable<void> {
    return this.http.put<void>('/api/spam', {
      threadIds: threadIds
  }) ;
 }
  archive(threadIds: string[]): Observable<void> {
    return this.http.put<void>('/api/archive', {
      threadIds: threadIds
  }) ;
  }
  getTags(includeSpamThread: boolean): Observable<string[]> {
    return this.http.get<string[]>('/api/getTags',  {
      params: {
        includeSpamThread: includeSpamThread,
      }
    }) ;
  }
  countAllThread(query: string): Observable<number> {
    return this.http.post<number>('/api/countAllThread',  {
        query: query,
    }) ;
  }
  getMails(query: string, allThread: boolean): Observable<Mail[]> {
    return this.http.post<Mail[]>('/api/getMails',  {
        query: query,
        allThread:allThread

    }) ;
  }
  sendMail(sender: string, to: string, cc: string, bcc: string, subject: string, html: string, files: Map<FileDTO, string | ArrayBuffer | AttachmentForward | AttachmentICSForward>, isDraft: boolean, mailreference: string, mailinReplyTo: string): Observable<boolean> {
    let mySerialMap = JSON.stringify(Array.from(files.entries()))
    return this.http.post<boolean>('/api/sendMail',  {
        sender: sender, to: to, cc: cc, bcc: bcc, subject: subject, html: html, files: mySerialMap, isDraft: isDraft, mailreference: mailreference,
        mailinReplyTo: mailinReplyTo
    }) ;
  }
  reply(messageid: string): Observable<MailVM> {
    return this.http.get<MailVM>('/api/reply',  {
      params: {
        id: messageid,
      }
    }) ;
  }
  forward(messageid: string): Observable<MailVM> {
    return this.http.get<MailVM>('/api/forward',  {
      params: {
        id: messageid,
      }
    }) ;
  }
  createICSMessage(messageid: string, icstitre: string, icsdate: Date, icstime: Date, icsduraction: number, icsallday: boolean): Observable<MailVM> {
    return this.http.post<MailVM>('/api/createICSMessage',  {
        messageid: messageid,
        icstitre: icstitre, icsdate: icsdate, icstime: icstime, icsduraction: icsduraction, icsallday: icsallday
    }) ;

  }
  editAsNew(messageid: string): Observable<MailVM | null> {
    return this.http.get<MailVM| null>('/api/editAsNew',  {
      params: {
        id: messageid,
      }
    }) ;
  }

  replyAll(messageid: string): Observable<MailVM> {
    return this.http.get<MailVM>('/api/replyAll',  {
      params: {
        id: messageid,
      }
    }) ;
  }

  download(messageid: string, partid:number):Observable<FileContentDTO>{
    return this.http.get<FileContentDTO>('/api/download',  {
      params: {
        messageid: messageid,
        partid: partid
      }
    }) ;
  }
  getConfig():Observable<NotMuchConfig>{
    return this.http.get<NotMuchConfig>('/api/getConfig') ;
  }
  getDirectories():Observable<string[]>{
    return this.http.get<string[]>('/api/getDirectories') ;
  }
}
