import {Service} from '@angular/core';

@Service()
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
    // Line breaks before <p> and <div>
    html = html.replace(new RegExp("<(p|div|h1|h2|h3|h4|h5|h6|ul|li|table)>", 'g'), "\n$&");

    // Escape HTML entities
    html = this.escape(html);

    // Tag names
    html = html.replace(new RegExp("(&lt;/|&lt;)(\\w+)", 'g'), "$1<span style='color:#A31515'>$2</span>");

    // Attributes
    html = html.replace(new RegExp("(\\w+)(=&quot;.*?&quot;)", 'g'), "<span style='color:red'>$1</span><span style='color:blue'>$2</span>");

    // Opening and closing tag symbols (</ /> < >)
    html == html.replace(new RegExp("&lt;/|/&gt;|&lt;|&gt;", 'g'), "<span style='color:blue'>$0</span>");

    return '<pre style="white-space: pre-wrap">' + html + '</pre>';
  }*/
}
