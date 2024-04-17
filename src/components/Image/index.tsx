const baseUrl = import.meta.env.VITE_BASE_URL.replace('cms', '')
const fallbackSrc = '/noavatar.png'

interface ImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  [key: string]: any
}

const Image = ({ src, alt, ...rest }: ImageProps) => {
  const imageSrc = src?.match(/static/) ? `${baseUrl}${src}` : src || fallbackSrc
  const onError = (e: any) => (e.currentTarget.src = fallbackSrc)

  return <img {...rest} alt={alt} src={imageSrc} onError={onError} />
}

export default Image
