import { useCallback, useEffect, useMemo } from 'react'
import { parse } from '@progfay/scrapbox-parser'
import { useText } from 'hooks/useText'
// @ts-ignore
import filenamify from 'filenamify/browser'
import { Octokit } from '@octokit/rest'
import { Sidebar } from 'components/Sidebar'

function App() {
  const [src, onChange] = useText()
  const parsed = useMemo(() => parse(src), [src])
  const [token, _, setToken] = useText()
  const [owner, __, setOwner] = useText()
  const [repo, ___, setRepo] = useText()
  const [status, ____, setStatus] = useText()
  const onClick = useCallback(async () => {
    const octokit = new Octokit({ auth: token })
    setStatus('retrieving ref...')
    const ref = await octokit.rest.git.getRef({
      owner,
      repo,
      ref: 'heads/main',
    })
    const parent = await octokit.rest.git.getCommit({
      owner,
      repo,
      commit_sha: ref.data.object.sha,
    })
    setStatus('creating blob...')
    const blob = await octokit.rest.git.createBlob({
      owner,
      repo,
      content: src,
    })
    setStatus('creating tree...')
    const title = parsed[0].type === 'title' ? parsed[0].text : ''
    const tree = await octokit.rest.git.createTree({
      owner,
      repo,
      base_tree: parent.data.tree.sha,
      tree: [
        {
          path: `data/${filenamify(title)}`,
          mode: '100644',
          type: 'blob',
          sha: blob.data.sha,
        },
      ],
    })
    setStatus('committing...')
    const commit = await octokit.rest.git.createCommit({
      owner,
      repo,
      message: `Update ${title}`,
      tree: tree.data.sha,
      parents: [parent.data.sha],
    })
    const nextRef = await octokit.rest.git.updateRef({
      owner,
      repo,
      ref: 'heads/main',
      sha: commit.data.sha,
    })
    setStatus('saved!')
  }, [src, parsed, token, owner, repo])
  useEffect(() => {
    setToken(window.localStorage.getItem('token'))
    setOwner(window.localStorage.getItem('owner'))
    setRepo(window.localStorage.getItem('repo'))
  }, [])
  return (
    <div>
      <div className="flex h-screen">
        <div className="w-1/6">
          <Sidebar></Sidebar>
        </div>
        <div className="w-3/6 h-full">
          <button onClick={onClick} className="border">
            save
          </button>
          <span>{status}</span>
          <textarea
            value={src}
            onChange={onChange}
            className="border border-gray-300 w-full h-full"
          ></textarea>
        </div>
        <div className="w-2/6">{JSON.stringify(parsed)}</div>
      </div>
    </div>
  )
}

export default App
