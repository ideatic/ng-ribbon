/**
 * Cleans an HTML string in a separate document, which runs nothing. clean() removes what is not allowed and reports whether it changed anything.
 * It is repeated because parsing the generated HTML again can create another dangerous element. If the HTML is already clean it is
 * returned unchanged, and if it keeps changing after several attempts it can only be an attack, so an empty string is returned.
 * fragment: the HTML is part of a body (editor content), not a complete document (clipboard)
 */
export function cleanHtml(html: string, fragment: boolean, clean: (document: Document) => boolean): string {
  for (let attempt = 0; attempt < 5; attempt++) {
    const parsed = new DOMParser().parseFromString(fragment ? `<body>${html}</body>` : html, 'text/html');
    if (!clean(parsed)) {
      return html;
    }

    html = fragment ? parsed.body.innerHTML : parsed.documentElement.outerHTML;
  }

  return '';
}
