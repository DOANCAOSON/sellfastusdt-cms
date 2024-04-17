import { parse, stringify } from 'qs'

export const updateQs = (latest: object) => {
  const query = parse(location.search.slice(1))
  return stringify({ ...query, ...latest }, { encodeValuesOnly: true })
}

export const parseQs = () => {
  return parse(location.search.slice(1))
}
