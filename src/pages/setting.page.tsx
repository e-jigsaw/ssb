import { useCallback, useEffect } from 'react'
import { useText } from 'hooks/useText'

function Token() {
  const saveToken = useCallback(() => {
    const token = (document.getElementById('input') as HTMLInputElement).value
    window.localStorage.setItem('token', token)
  }, [])
  const [owner, ownerOnChange, setOwner] = useText()
  const saveOwner = useCallback(() => {
    window.localStorage.setItem('owner', owner)
  }, [owner])
  const [repo, repoOnChange, setRepo] = useText()
  const saveRepo = useCallback(() => {
    window.localStorage.setItem('repo', repo)
  }, [repo])
  useEffect(() => {
    setOwner(window.localStorage.getItem('owner') ?? '')
    setRepo(window.localStorage.getItem('repo') ?? '')
  }, [])
  return (
    <div>
      <div className="p-4">
        <h1>owner</h1>
        <input
          type="text"
          className="border text-xl"
          value={owner}
          onChange={ownerOnChange}
        ></input>
        <button className="border text-xl" onClick={saveOwner}>
          save
        </button>
      </div>
      <div className="p-4">
        <h1>repos</h1>
        <input
          type="text"
          className="border text-xl"
          value={repo}
          onChange={repoOnChange}
        ></input>
        <button className="border text-xl" onClick={saveRepo}>
          save
        </button>
      </div>
      <div className="p-4">
        <h1>token</h1>
        <input type="password" className="border text-xl" id="input"></input>
        <button onClick={saveToken} className="border text-xl">
          save
        </button>
      </div>
    </div>
  )
}

export default Token
