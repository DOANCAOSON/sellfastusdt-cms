/// <reference types="vite/client" />

type EmptyFunc = () => void

declare interface IDocument extends Document {
  mozFullScreenElement: EmptyFunc
  webkitFullscreenElement: EmptyFunc
  mozRequestFullScreen: EmptyFunc
  cancelFullScreen: EmptyFunc
  mozCancelFullScreen: EmptyFunc
  webkitCancelFullScreen: EmptyFunc
}

declare interface IHTMLElement extends HTMLElement {
  mozRequestFullScreen: EmptyFunc
  webkitRequestFullscreen: EmptyFunc
}

declare interface ILayouts {
  displayName: string
  creatable: boolean
  notify: boolean
  editable: boolean
  exportable: boolean
  filterable: ArrayRecord<string, any>
  list: Array<Record<string, any>>
  edit: Array<Record<string, any>>
  defaultValue: Record<string, unknown>
}
