import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HtmlToolsService {

  constructor() {
  }


  public escape(unsafe: string) {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /*public highlight(html: string) {
    // Saltos de línea antes de <p> y <div>
    html = html.replace(new RegExp("<(p|div|h1|h2|h3|h4|h5|h6|ul|li|table)>", 'g'), "\n$&");

    // Escapar identidades HTML
    html = this.escape(html);

    // Nombre de los tags
    html = html.replace(new RegExp("(&lt;/|&lt;)(\\w+)", 'g'), "$1<span style='color:#A31515'>$2</span>");

    // Atributos
    html = html.replace(new RegExp("(\\w+)(=&quot;.*?&quot;)", 'g'), "<span style='color:red'>$1</span><span style='color:blue'>$2</span>");

    // Simbolos de inicio y cierre de etiquetas (</ /> < >)
    html == html.replace(new RegExp("&lt;/|/&gt;|&lt;|&gt;", 'g'), "<span style='color:blue'>$0</span>");

    return '<pre style="white-space: pre-wrap">' + html + '</pre>';
  }*/
}
