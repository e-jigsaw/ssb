import format from 'date-fns/format'
import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'

function Daily() {
  const router = useRouter()
  const today = useMemo(() => {
    return format(new Date(), 'yMMdd')
  }, [])
  useEffect(() => {
    router.push(`/pages/${router.query.repo}/${today}`)
  }, [])
  return null
}

export default Daily
