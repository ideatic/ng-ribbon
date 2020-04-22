import {Injectable} from '@angular/core';

export enum ReadAs {
  dataUri,
  string,
}

@Injectable({
  providedIn: 'root'
})
export class DomUtilsService {

  constructor() {
  }

  public readFile(file: FileList, readAs: ReadAs): Promise<{ fileName: string, content: string }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => resolve({
        fileName: file[0].name,
        content: reader.result as string
      });
      reader.onerror = (e) => reject(e);
      reader.onabort = (e) => reject(e);

      if (readAs == ReadAs.dataUri) {
        reader.readAsDataURL(file[0]);
      } else {
        reader.readAsText(file[0]);
      }
    });
  }

  public uploadAs(type: ReadAs, acceptTypes?: string): Promise<{ fileName: string, content: string }> {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = "file";
      input.accept = acceptTypes;
      input.click();
      input.addEventListener('change', () => {
        if (input.files) {
          this.readFile(input.files, type).then(resolve, reject);
        } else {
          reject('no files');
        }
      });
    })
  }

  public uploadAsDataURL(acceptTypes?: string): Promise<string> {
    return this.uploadAs(ReadAs.dataUri, acceptTypes)
      .then(result => result.content);
  }
}
