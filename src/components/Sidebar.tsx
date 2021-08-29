import {
  ChangeEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Render } from 'components/Render'
import { useBlob } from 'hooks/useBlob'
import Link from 'next/link'
import format from 'date-fns/format'
import { useRouter } from 'next/router'

export const Sidebar = () => {
  const router = useRouter()
  const { data } = useBlob(['pages', router.query.repo as string, 'sidebar'])
  const parsed = useMemo(() => {
    if (data) {
      return atob(data.data.content)
    }
    return ''
  }, [data])
  const today = useMemo(() => {
    return format(new Date(), 'yMMdd')
  }, [])
  const [repos, setRepos] = useState([])
  useEffect(() => {
    setRepos(window.localStorage.getItem('repo').split(','))
  }, [])
  const onChange = useCallback<ChangeEventHandler<HTMLSelectElement>>(
    (event) => {
      router.push(`/pages/${event.target.value}/${today}`)
    },
    [router, today]
  )
  return (
    <div>
      <div>
        <select value={router.query.repo} onChange={onChange}>
          {repos.map((r) => (
            <option value={r} key={r}>
              {r}
            </option>
          ))}
        </select>
      </div>
      <Link href={`/pages/${router.query.repo}/${today}`}>Daily Note</Link>
      <Render article={parsed}></Render>
      <Link href="/setting">setting</Link>
    </div>
  )
}
