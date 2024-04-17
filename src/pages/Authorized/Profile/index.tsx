import FormBasic from '../../../components/FormBasic'
import { useAppStore } from '../../../store/app-store'

const Profile = () => {
  const uid = 'admin/users'
  const layouts = useAppStore((store) => {
    return store.layouts?.has(uid) ? store.layouts?.get(uid) : null
  })

  if (!layouts) return <></>

  return (
    <FormBasic
      uid={uid}
      layouts={{
        ...layouts,
        edit: layouts.edit.map((e) => {
          return e.map((i: { name: string; disabled: boolean }) => {
            if (i.name === 'email' || i.name === 'roles') {
              i.disabled = true
            }
            return i
          })
        })
      }}
    />
  )
}
export default Profile
