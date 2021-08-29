import { useCallback, useMemo, useState } from 'react'
import { parse } from '@progfay/scrapbox-parser'
import 'tailwindcss/tailwind.css'

function App() {
  const [src, setSrc] = useState('')
  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setSrc(event.target.value)
    },
    []
  )
  const parsed = useMemo(() => parse(src), [src])
  return (
    <div className="flex h-screen">
      <textarea
        value={src}
        onChange={onChange}
        className="border border-gray-300 w-1/2 h-full"
      ></textarea>
      <div className="w-1/2">{JSON.stringify(parsed)}</div>
    </div>
  )
}

export default App
