import { debounce } from 'debounce'
import { useEffect } from 'react'

const clearLoaderUI = debounce(() => {
  const loader = document.getElementById('lds-ripple-container')
  if (loader) {
    loader.remove()
    const root = document.getElementById('root')
    if (root) {
      root.style.display = 'block'
    }
  }
}, 300)

const Fallback = () => {
  useEffect(() => {
    return () => clearLoaderUI()
  }, [])

  return <></>
}

export default Fallback
