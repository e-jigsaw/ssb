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
import { useRouter } from 'next/router'

export const Sidebar = () => {
  const router = useRouter()
  const { data } = useBlob(['pages', router.query.repo as string, 'sidebar'])
  const parsed = useMemo(() => {
    if (data) {
      return decodeURIComponent(escape(atob(data.data.content)))
    }
    return ''
  }, [data])
  const [repos, setRepos] = useState([])
  useEffect(() => {
    setRepos(window.localStorage.getItem('repo').split(','))
  }, [])
  const onChange = useCallback<ChangeEventHandler<HTMLSelectElement>>(
    (event) => {
      router.push(`/meta/${event.target.value}/daily`)
    },
    [router]
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
      <Link href={`/meta/${router.query.repo}/daily`}>Daily Note</Link>
      <Render article={parsed}></Render>
      <Link href="/setting">setting</Link>
    </div>
  )
}
