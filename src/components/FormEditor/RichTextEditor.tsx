import { CKEditor } from '@ckeditor/ckeditor5-react'
import { Autoformat } from '@ckeditor/ckeditor5-autoformat'
import { Bold, Italic } from '@ckeditor/ckeditor5-basic-styles'
import { BlockQuote } from '@ckeditor/ckeditor5-block-quote'
import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic'
import { Essentials } from '@ckeditor/ckeditor5-essentials'
import { FontBackgroundColor, FontColor, FontFamily, FontSize } from '@ckeditor/ckeditor5-font'
import { Heading } from '@ckeditor/ckeditor5-heading'
import { Highlight } from '@ckeditor/ckeditor5-highlight'
import { HtmlComment } from '@ckeditor/ckeditor5-html-support'
import {
  Image,
  ImageCaption,
  ImageResizeEditing,
  ImageResizeHandles,
  ImageStyle,
  ImageToolbar,
  ImageUpload
} from '@ckeditor/ckeditor5-image'
import { Indent } from '@ckeditor/ckeditor5-indent'
import { Link } from '@ckeditor/ckeditor5-link'
import { List } from '@ckeditor/ckeditor5-list'
import { MediaEmbed } from '@ckeditor/ckeditor5-media-embed'
import { Paragraph } from '@ckeditor/ckeditor5-paragraph'
import { PasteFromOffice } from '@ckeditor/ckeditor5-paste-from-office'
import {
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar
} from '@ckeditor/ckeditor5-table'
import { TextTransformation } from '@ckeditor/ckeditor5-typing'
import { Base64UploadAdapter } from '@ckeditor/ckeditor5-upload'

const EDITOR_PLUGINS = [
  Autoformat,
  BlockQuote,
  Bold,
  Essentials,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  Heading,
  Highlight,
  HtmlComment,
  Image,
  ImageCaption,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  Indent,
  Italic,
  Link,
  List,
  MediaEmbed,
  Paragraph,
  PasteFromOffice,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TextTransformation,
  TextTransformation,
  Base64UploadAdapter,
  ImageResizeEditing,
  ImageResizeHandles
]

const TOOLBAR_ITEMS = {
  items: [
    'heading',
    '|',
    'bold',
    'italic',
    'link',
    'bulletedList',
    'numberedList',
    '|',
    'outdent',
    'indent',
    '|',
    'imageUpload',
    'blockQuote',
    'insertTable',
    'undo',
    'redo',
    'alignment',
    'fontBackgroundColor',
    'fontColor',
    'highlight',
    'fontSize',
    'fontFamily',
    'insertImage',
    'insertImageFromUnsplash'
  ]
}

const TOOLBAR_IMAGES = {
  toolbar: ['imageTextAlternative', 'toggleImageCaption', 'imageStyle:inline', 'imageStyle:block', 'imageStyle:side']
}

const TOOLBAR_TABLE = {
  contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableCellProperties', 'tableProperties']
}

interface IProps {
  data?: string | null
  onChange: (value: string) => void
}
const RichTextEditor = (props: IProps) => {
  return (
    <CKEditor
      editor={ClassicEditor}
      config={{
        plugins: EDITOR_PLUGINS,
        language: 'en',
        toolbar: TOOLBAR_ITEMS,
        table: TOOLBAR_TABLE,
        image: TOOLBAR_IMAGES,
        placeholder: 'Start editing here...'
      }}
      data={props.data || ''}
      onChange={(_, editor) => props.onChange(editor.getData())}
      onBlur={(_, editor) => props.onChange(editor.getData())}
    />
  )
}

export default RichTextEditor
