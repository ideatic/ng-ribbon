// https://www.tiny.cloud/docs/advanced/editor-command-identifiers/


// Taken from https://developer.mozilla.org/es/docs/Web/API/Document/execCommand using the command
// Array.from($0.querySelectorAll('dt')).map(n=>"/** "+n.nextElementSibling.innerText+"*/\n"+n.innerText+"='"+n.innerText+"'").join(",\n")


export enum EditorCommands {
  /** Changes the background color of the document. In styleWithCss mode, it affects the background color of the containing block. This requires a string with the background color value, passed as an argument value. (Internet Explorer uses this option to set the text background color.)*/
  backColor = 'HiliteColor',
  /** Sets or removes bold for the selection or at the insertion point. (Internet Explorer uses the STRONG tag instead of B.)*/
  bold = 'bold',
  /** Makes the content document either read-only or editable. This requires a true/false boolean passed as an argument value. (Not supported by Internet Explorer.)*/
  contentReadOnly = 'contentReadOnly',
  /** Copies the current selection to the clipboard. The clipboard capability must be enabled in the user.js preferences file. See*/
  copy = 'copy',
  /** Cuts the selection and copies it to the clipboard. The clipboard capability must be enabled in the user.js preferences file. See*/
  cut = 'cut',
  /** Adds a SMALL tag around the selection or at the insertion point. (Not supported by Internet Explorer.)*/
  decreaseFontSize = 'decreaseFontSize',
  /** Deletes the current selection.*/
  delete = 'delete',
  /** Enables or disables the table row and column insertion and deletion controls. (Not supported by Internet Explorer.)*/
  enableInlineTableEditing = 'enableInlineTableEditing',
  /** Enables or disables the resize handles on images and other resizable objects. (Not supported by Internet Explorer.)*/
  enableObjectResizing = 'enableObjectResizing',
  /** Changes the font name for the selection or at the insertion point. This requires a font name string ("Arial", for example) passed as an argument value.*/
  fontName = 'fontName',
  /** Changes the font size for the selection or at the insertion point. This requires an HTML font size (1-7) passed as an argument value.*/
  fontSize = 'fontSize',
  /** Changes the font color for the selection or at the insertion point. This requires a color value string passed as an argument value.*/
  foreColor = 'foreColor',
  /** Adds a block-style HTML tag around the line containing the current selection, replacing the block element containing the line if there is one (in Firefox, BLOCKQUOTE is the exception - it will wrap any containing block element). Requires a tag name string passed as an argument value. Virtually all block-style tags can be used (for example "H1", "P", "DL", "BLOCKQUOTE"). (Internet Explorer only supports the heading tags H1 - H6, address and PRE, which must also include the tag delimiters <>, such as "<H1>".)*/
  formatBlock = 'formatBlock',
  /** Deletes the character in front of the cursor position. It is the same as pressing the delete key.*/
  forwardDelete = 'forwardDelete',
  /** Adds a heading tag around a selection, or the line at the insertion point. Requires the tag name string passed as an argument value (that is, "H1", "H6"). (Not supported by Internet Explorer and Safari.)*/
  heading = 'heading',
  /** Changes the background color for the selection or the insertion point. Requires a color value string passed as an argument value. UseCSS must be on for this to work. (Not supported by Internet Explorer.)*/
  hiliteColor = 'HiliteColor',
  /** Adds a BIG tag around the selection or at the insertion point. (Not supported by Internet Explorer.)*/
  increaseFontSize = 'increaseFontSize',
  /** Indents the line containing the selection or insertion point. In Firefox, if the selection spans several lines at different indentation levels, only the least indented lines in the selection will be indented.*/
  indent = 'indent',
  /** Controls whether the Enter key inserts a br tag or splits the current block element in two. (Not supported by Internet Explorer.)*/
  insertBrOnReturn = 'insertBrOnReturn',
  /** Inserts a horizontal rule at the insertion point (deletes the selection).*/
  insertHorizontalRule = 'insertHorizontalRule',
  /** Inserts an HTML string at the insertion point (deletes the selection). Requires a valid HTML string passed as an argument value. (Not supported by Internet Explorer.)*/
  insertHTML = 'mceInsertContent',
  /** Inserts an image at the insertion point (deletes the selection). Requires the image SRC URI string passed as an argument value. The URI must contain at least a single character, which can be a blank space. (Internet Explorer will create a link with a null URI value.)*/
  insertImage = 'insertImage',
  insertDefinitionList = 'InsertDefinitionList',
  /** Creates a numbered ordered list for the selection or at the insertion point.*/
  insertOrderedList = 'insertOrderedList',
  /** Creates a bulleted unordered list for the selection or at the insertion point.*/
  insertUnorderedList = 'insertUnorderedList',
  /** Inserts a paragraph around the selection or the current line. (Internet Explorer inserts a paragraph at the insertion point and deletes the selection.)*/
  insertParagraph = 'insertParagraph',
  /** Inserts the supplied plain text at the insertion point (deletes the selection).*/
  insertText = 'insertText',
  /** Toggles italic for the selection or the insertion point. (Internet Explorer uses the EM tag instead of I.)*/
  italic = 'italic',
  /** Centers the selection or insertion point.*/
  justifyCenter = 'justifyCenter',
  /** Justifies the selection or insertion point.*/
  justifyFull = 'justifyFull',
  /** Aligns the selection or insertion point to the left.*/
  justifyLeft = 'justifyLeft',
  /** Aligns the selection or insertion point to the right.*/
  justifyRight = 'justifyRight',
  /** Outdents the line containing the selection or the insertion point.*/
  outdent = 'outdent',
  /** Pastes the clipboard contents at the insertion point (replaces the current selection). The clipboard capability must be enabled in the user.js preferences file. See*/
  paste = 'paste',
  /** Redoes the previously undone command.*/
  redo = 'Redo',
  /** Removes all formatting from the current selection.*/
  removeFormat = 'removeFormat',
  /** Selects all the content of the editable region.*/
  selectAll = 'selectAll',
  /** Toggles strikethrough for the selection or the insertion point.*/
  strikeThrough = 'strikeThrough',
  /** Toggles subscript for the selection or the insertion point.*/
  subscript = 'subscript',
  /** Toggles superscript for the selection or the insertion point.*/
  superscript = 'superscript',
  /** Toggles underline for the selection or the insertion point.*/
  underline = 'underline',
  /** Undoes the last executed command.*/
  undo = 'Undo',
  /** Removes the anchor tag from a selected anchor link.*/
  unlink = 'unlink',

  // TinyMCE
  mceLowerCase = 'mceLowerCase',
  mceUpperCase = 'mceUpperCase',
  mceTitleCase = 'mceTitleCase',
  SearchReplace = 'SearchReplace',
  codeEditor = 'mceCodeEditor',
  /** Creates an anchor link from the selection, only if there is a selection. This requires the HREF URI string passed as an argument value. The URI must contain at least a single character, which can be a blank space. (Internet Explorer will create a link with a null URI value.)*/
  createLink = 'mceLink',
}
