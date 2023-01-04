export class MailEdition {
  from = '';
  tos: string[] = [];
  ccs: string[] = [];
  bccs: string[] = [];
  subject = '';
  mailbody = '';
  uploadedFiles: any[] = [];
  uploadFilesMap: Map<any, any> = new Map();
  mailreference?: string;
  mailinReplyTo?: string;
  // Code completion
  resultsto: string[]= [];
  resultscc: string[]= [];
  resultsbcc: string[]= [];



}
