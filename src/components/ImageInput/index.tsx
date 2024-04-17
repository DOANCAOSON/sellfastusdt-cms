import { PlusOutlined } from '@ant-design/icons'
import Modal from 'antd/es/modal'
import Upload, { RcFile, UploadFile } from 'antd/es/upload'
import { useState } from 'react'
import './ImageInput.scss'

interface IProps {
  max?: number
  disabled?: boolean
  images: UploadFile[]
  onChange: (images: UploadFile[]) => void
}

const MAX_FILES = 10

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })

const UploadUI = (props: IProps) => {
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')

  const handleCancel = () => setPreviewOpen(false)

  const handlePreview = async (file: UploadFile) => {
    if (file.thumbUrl) {
      file.preview = file.thumbUrl
    } else if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile)
    }

    setPreviewImage(file.url || (file.preview as string))
    setPreviewOpen(true)
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1))
  }

  return (
    <>
      <Upload
        prefixCls='image-input'
        listType='picture-card'
        fileList={props.images}
        multiple
        maxCount={props.max}
        beforeUpload={async (_, fileList) => {
          const newFiles: UploadFile[] = [].concat(props.images as any)
          for (const file of fileList) {
            if (file.type.match(/image/) && newFiles.length < (props.max ?? MAX_FILES)) {
              const rcFile = {
                name: file.name,
                size: file.size,
                type: file.type,
                lastModified: file.lastModified,
                lastModifiedDate: file.lastModifiedDate,
                thumbUrl: await getBase64(file)
              } as UploadFile
              newFiles.push(rcFile)
            }
          }
          props.onChange(newFiles)
          return false
        }}
        disabled={props.disabled}
        onPreview={handlePreview}
        onRemove={(file) => {
          props.onChange(props.images?.filter((f) => f.uid !== file.uid))
        }}>
        {props.images.length >= (props.max ?? MAX_FILES) ? null : (
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
          </div>
        )}
      </Upload>
      <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img alt='example' style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  )
}
const ImageInput = (props: IProps) => {
  return (
    <div className='ImageInput-container'>
      <div className='main-contain'>
        <div className='page-center'>
          <div className='page-center-main'>
            <UploadUI {...props} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageInput
