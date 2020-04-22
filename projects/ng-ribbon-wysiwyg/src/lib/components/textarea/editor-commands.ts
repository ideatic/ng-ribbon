// https://www.tiny.cloud/docs/advanced/editor-command-identifiers/


// Obtenido de https://developer.mozilla.org/es/docs/Web/API/Document/execCommand utilizando el comando
// Array.from($0.querySelectorAll('dt')).map(n=>"/** "+n.nextElementSibling.innerText+"*/\n"+n.innerText+"='"+n.innerText+"'").join(",\n")


export enum EditorCommands {
  /**  Cambia el color de fondo del documento. En el modo styleWithCss, afecta el color de fondo del bloque que contiene. Esto requiere una cadena con el valor del color de fondo que se pasa como un valor de argumento. (Internet Explorer utiliza esta opción para definir el color de fondo del texto.)*/
  backColor = 'HiliteColor',
  /** Pone las negritas o las quita para la selección o en el punto de inserción. (Internet Explorer utiliza la etiqueta STRONG en lugar de B.)*/
  bold = 'bold',
  /** Hace que el documento de contenido, ya sea de sólo lectura o editable. Esto requiere un booleano verdadero / falso que se pasa como un valor de argumento. (No es compatible con Internet Explorer.)*/
  contentReadOnly = 'contentReadOnly',
  /** Copia la selección actual en el portapapeles. Capacidad del Portapapeles debe estar habilitado en el archivo de preferencias user.js. Vea*/
  copy = 'copy',
  /** Corta la selección y lo copia en el portapapeles actual. Capacidad del Portapapeles debe estar habilitado en el archivo de preferencias user.js. Vea*/
  cut = 'cut',
  /** Añade una etiqueta SMALL alrededor de la selección o en el punto de inserción. (No es compatible con Internet Explorer.)*/
  decreaseFontSize = 'decreaseFontSize',
  /** Elimina la selección actual.*/
    delete = 'delete',
  /** Activa o desactiva la fila de la tabla y los controles de inserción y supresión de columna. (No es compatible con Internet Explorer.)*/
  enableInlineTableEditing = 'enableInlineTableEditing',
  /** Activa o desactiva los controladores de tamaño en imágenes y otros objetos de tamaño variable. (No es compatible con Internet Explorer.)*/
  enableObjectResizing = 'enableObjectResizing',
  /** Cambia el nombre de la fuente para la selección o en el punto de inserción. Esto requiere una cadena de nombre de la fuente ("Arial", por ejemplo) que se pasa como un valor de argumento.*/
  fontName = 'fontName',
  /** Cambia el tamaño de fuente para la selección o en el punto de inserción. Esto requiere un tamaño de fuente HTML (1-7) que se pasa como un valor de argumento.*/
  fontSize = 'fontSize',
  /** Cambia un color de fuente para la selección o en el punto de inserción. Esto requiere una cadena de valor de color que se pasa como un valor de argumento.*/
  foreColor = 'foreColor',
  /** Añade una etiqueta HTML de estilo bloque alrededor de la línea que contiene la selección actual, reemplazando el elemento de bloque que contiene la línea si existe (en Firefox, BLOCKQUOTE es la excepción - que envolverá cualquier elemento de bloque que contiene). Requiere una cadena de etiqueta-nombre que se pasa como un argumento de valor. Prácticamente todas las etiquetas de estilo bloque se pueden utilizar (por ejemplo. "H1", "P", "DL", "BLOCKQUOTE"). (Internet Explorer sólo admite etiquetas de título H1 - H6, dirección y PRE, que también debe incluir los delimitadores de etiquetas <>, como "<H1>".)*/
  formatBlock = 'formatBlock',
  /** Elimina el character delante de la posición del cursor cursor.  Es lo mismo que pulsar la tecla suprimir.*/
  forwardDelete = 'forwardDelete',
  /** Añade una etiqueta de encabezado en torno a una selección, o la línea en el punto de inserción. Requiere la cadena de nombre de etiqueta que se pasa como un valor de argumento (es decir, "H1", "H6"). (No es compatible con Internet Explorer y Safari.)*/
  heading = 'heading',
  /** Cambia el color de fondo para la selección o el punto de inserción. Requiere una cadena de valores de color que se pasa como un valor de argumento. UseCSS debe estar encendido para que esto funcione. (No es compatible con Internet Explorer.)*/
  hiliteColor = 'HiliteColor',
  /** Añade una etiqueta BIG alrededor de la selección o en el punto de inserción. (No es compatible con Internet Explorer.)*/
  increaseFontSize = 'increaseFontSize',
  /** Indenta la línea que contiene el punto de selección o inserción. En Firefox, si la selección abarca varias líneas en los diferentes niveles de indentación serán indentadas sólo las líneas menos indentadas en la selección.*/
  indent = 'indent',
  /** Controla si la tecla Intro inserta una etiqueta br o divide el elemento de bloque actual en dos. (No es compatible con Internet Explorer.)*/
  insertBrOnReturn = 'insertBrOnReturn',
  /**  Inserta una regla horizontal en el punto de inserción (borra la selección).*/
  insertHorizontalRule = 'insertHorizontalRule',
  /** Inserta una cadena HTML en el punto de inserción (borra la selección). Requiere una cadena HTML válido que se ha pasado como un valor de argumento. (No es compatible con Internet Explorer.)*/
  insertHTML = 'mceInsertRawHTML',
  /** Inserta una imagen en el punto de inserción (borra la selección). Requiere la cadena de imagen SRC URI que se pasa como un argumento de valor. El URI debe contener al menos un solo carácter, que puede ser un espacio en blanco. (Internet Explorer creará un enlace con un nulo valor URI.)*/
  insertImage = 'insertImage',
  insertDefinitionList = 'InsertDefinitionList',
  /** Crea una lista ordenada con números para la selección o en el punto de inserción.*/
  insertOrderedList = 'insertOrderedList',
  /** Crea una lista desordenada con viñetas para la selección o en el punto de inserción.*/
  insertUnorderedList = 'insertUnorderedList',
  /**   Inserta un párrafo en torno a la selección o la línea actual. (Internet Explorer inserta un párrafo en el punto de inserción y elimina la selección.)*/
  insertParagraph = 'insertParagraph',
  /** Inserta el texto plano expedido en el punto de inserción (borra la selección).*/
  insertText = 'insertText',
  /** Alterna cursiva para la selección o el punto de inserción. (Internet Explorer utiliza la etiqueta de EM en lugar de I.)*/
  italic = 'italic',
  /**  Centra el punto de selección o inserción.*/
  justifyCenter = 'justifyCenter',
  /** Justifica el punto de selección o inserción.*/
  justifyFull = 'justifyFull',
  /** Justifica la selección o inserción punto a la izquierda.*/
  justifyLeft = 'justifyLeft',
  /** Justifica la selección o el punto de inserción a la derecha.*/
  justifyRight = 'justifyRight',
  /** Anula la sangría de la línea que contiene la selección o el punto de inserción.*/
  outdent = 'outdent',
  /** Pega el contenido del portapapeles en el punto de inserción (reemplaza la selección actual). Capacidad del Portapapeles debe estar habilitado en el archivo de preferencias user.js. Ver*/
  paste = 'paste',
  /** Rehace el anterior comando deshecho.*/
  redo = 'Redo',
  /** Quita todo el formato de la selección actual.*/
  removeFormat = 'removeFormat',
  /** Selecciona todo el contenido de la región editable.*/
  selectAll = 'selectAll',
  /** Alterna tachado para la selección o el punto de inserción.*/
  strikeThrough = 'strikeThrough',
  /** Alterna subíndice para la selección o el punto de inserción.*/
  subscript = 'subscript',
  /** Alterna exponente para la selección o el punto de inserción.*/
  superscript = 'superscript',
  /** Alterna subrayado para la selección o el punto de inserción.*/
  underline = 'underline',
  /** Deshace el último comando ejecutado.*/
  undo = 'Undo',
  /**  Elimina la etiqueta de ancla de un enlace ancla seleccionado.*/
  unlink = 'unlink',

  // TinyMCE
  mceLowerCase = 'mceLowerCase',
  mceUpperCase = 'mceUpperCase',
  mceTitleCase = 'mceTitleCase',
  SearchReplace = 'SearchReplace',
  codeEditor = 'mceCodeEditor',
  /** Crea un vínculo de anclaje a partir de la selección, sólo si hay una selección. Esto requiere la cadena HREF URI que se pasa como un argumento de valor. El URI debe contener al menos un solo carácter, el cual puede ser un espacio en blanco. (Internet Explorer creará un enlace con un nulo valor URI.)*/
  createLink = 'mceLink',
}
