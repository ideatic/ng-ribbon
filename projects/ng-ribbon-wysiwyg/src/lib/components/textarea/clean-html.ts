/**
 * Limpia un HTML en un documento aparte, que no ejecuta nada. clean() quita lo que sobra y dice si ha cambiado algo.
 * Se repite porque volver a analizar el HTML generado puede crear otro elemento peligroso. Si el HTML ya está limpio se
 * devuelve sin cambios, y si sigue cambiando tras varios intentos solo puede ser un ataque, así que se devuelve vacío.
 * fragment: el HTML es parte de un body (contenido del editor), no un documento completo (portapapeles)
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
