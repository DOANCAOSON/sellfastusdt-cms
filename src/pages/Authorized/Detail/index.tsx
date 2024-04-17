import FormBasic from '../../../components/FormBasic'
import { useAppStore } from '../../../store/app-store'

const DetailPage = (props: { uid: string; notify: boolean }) => {
  const layouts = useAppStore((store) => {
    return store.layouts?.has(props.uid) ? store.layouts?.get(props.uid) : null
  })

  if (!layouts) return <></>

  return <FormBasic uid={props.uid} layouts={layouts} notify={props.notify} />
}

export default DetailPage
