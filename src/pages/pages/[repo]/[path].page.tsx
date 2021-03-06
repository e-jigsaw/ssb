import { useCallback, useEffect, useMemo } from 'react'
import { parse } from '@progfay/scrapbox-parser'
import { useText } from 'hooks/useText'
// @ts-ignore
import filenamify from 'filenamify/browser'
import { Octokit } from '@octokit/rest'
import { Sidebar } from 'components/Sidebar'
import { useRouter } from 'next/router'
import { useBlob } from 'hooks/useBlob'
import { useSWRConfig } from 'swr'
import { Render } from 'components/Render'

function Page() {
  const router = useRouter()
  const [src, onChange, setSrc] = useText()
  const parsed = useMemo(() => parse(src), [src])
  const [token, _, setToken] = useText()
  const [owner, __, setOwner] = useText()
  const [repo, ___, setRepo] = useText()
  const [status, ____, setStatus] = useText()
  const { mutate } = useSWRConfig()
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
    mutate(
      typeof router.query.path === 'string'
        ? ['pages', router.query.path]
        : ['pages', undefined]
    )
  }, [src, parsed, token, owner, repo])
  useEffect(() => {
    setToken(window.localStorage.getItem('token'))
    setOwner(window.localStorage.getItem('owner'))
  }, [])
  const { data } = useBlob(
    typeof router.query.path === 'string'
      ? ['pages', router.query.repo as string, router.query.path]
      : ['pages', undefined, undefined],
    {
      onError: () => {
        setSrc(`${router.query.path as string}\n\n`)
      },
    }
  )
  useEffect(() => {
    if (data) {
      setSrc(decodeURIComponent(escape(atob(data.data.content))))
    }
  }, [data])
  useEffect(() => {
    if (router.query.repo) {
      setRepo(router.query.repo as string)
    }
  }, [router.query])
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
        <div className="w-2/6">
          <Render article={src}></Render>
        </div>
      </div>
    </div>
  )
}

export default Page
