import AntSelect, { SelectProps } from 'antd/es/select'
import { useEffect, useState } from 'react'
import { cancelToken } from '../../helper-plugin'
import getFetchClient from '../../helper-plugin/utils/getFetchClient'
import './select.scss'
import { AutoComplete } from 'antd'

interface IRelationProps {
  optionTarget: string
  type: 'relation'
  relations: string[]
  setValues?: (val: any) => void
  autocomplete: boolean
}
interface IEnumerationProps {
  enum: string[]
  type: 'enumeration'
}

const SelectWithRelation = (props: SelectProps & IRelationProps) => {
  const { optionTarget, setValues, autocomplete, ...rest } = props
  const [options, setOptions] = useState<Array<{ value: string; label: string }>>([])
  const fetchClient = getFetchClient()

  useEffect(() => {
    const source = cancelToken()

    fetchClient.get(optionTarget, { cancelToken: source.token }).then(({ data }) => {
      const dataRes = Array.isArray(data) ? data : data.dataSource
      setOptions(dataRes)
      setValues?.(dataRes)
    })

    return () => source.cancel()
  }, [])

  if (autocomplete) {
    return (
      <AutoComplete
        className='form-control'
        options={options}
        filterOption={(inputValue, option) =>
          option!.value?.toString().toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
        }
        placeholder='Enter symbol token ...'
        allowClear
        {...rest}
      />
    )
  }

  return <AntSelect allowClear prefixCls='detail-select' size='large' options={options} {...rest} />
}

const Select = (props: SelectProps & (IRelationProps | IEnumerationProps)) => {
  if (props.type === 'relation') {
    return <SelectWithRelation {...props} />
  }

  const options = props.enum ? props.enum.map((x) => ({ value: x, label: x })) : []

  return <AntSelect allowClear prefixCls='detail-select' size='large' options={options} {...props} />
}

export default Select
