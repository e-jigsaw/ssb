import { useMemo } from 'react'
import { Render } from 'components/Render'
import { useBlob } from 'hooks/useBlob'
import Link from 'next/link'
import format from 'date-fns/format'

export const Sidebar = () => {
  const { data } = useBlob(['pages', 'sidebar'])
  const parsed = useMemo(() => {
    if (data) {
      return atob(data.data.content)
    }
    return ''
  }, [data])
  const today = useMemo(() => {
    return format(new Date(), 'yMMdd')
  }, [])
  return (
    <div>
      <Link href={`/pages/${today}`}>Daily Note</Link>
      <Render article={parsed}></Render>
    </div>
  )
}
