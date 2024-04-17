import ckeditor5 from '@ckeditor/vite-plugin-ckeditor5'
import react from '@vitejs/plugin-react-swc'
import { createRequire } from 'node:module'
import { defineConfig, splitVendorChunkPlugin } from 'vite'

const require = createRequire(import.meta.url)
const getPlugins = () => {
  const plugins = [react(), ckeditor5({ theme: require.resolve('@ckeditor/ckeditor5-theme-lark') })]
  if (process.env.NODE_ENV === 'production') {
    return plugins.concat([splitVendorChunkPlugin()])
  }
  return plugins
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: getPlugins(),
  build: process.env.NODE_ENV === 'production' && {
    cssCodeSplit: false
    // rollupOptions: {
    //   output: {
    //     manualChunks: {
    //       vendor_react: ['react', 'react-router-dom', 'react-dom', 'react-is'],
    //       vendor_ant_skeleton: ['antd/es/skeleton'],
    //       vendor_ant_color_picker: ['antd/es/color-picker'],
    //       vendor_ant_upload: ['antd/es/upload'],
    //       vendor_ant_notification: ['antd/es/notification'],
    //       vendor_ant_date_picker: ['antd/es/date-picker'],
    //       vendor_ant_pagination: ['antd/es/pagination'],
    //       vendor_ant_modal: ['antd/es/modal'],
    //       vendor_ant_select: ['antd/es/select'],
    //       vendor_ant_checkbox: ['antd/es/checkbox'],
    //       vendor_ant_button: ['antd/es/button'],
    //       vendor_draft: ['draft-js'],
    //       vendor_draft_editor: ['react-draft-wysiwyg', 'draft-convert'],
    //       vendor_rc: ['rc-picker', 'rc-menu', 'rc-table'],
    //       vendor_reactstrap: ['reactstrap']
    //     }
    //   }
    // }
  },
  define: process.env.NODE_ENV === 'development' && {
    global: {}
  }
})
