import useSWR from 'swr'
import { Octokit } from '@octokit/rest'
import { useMemo } from 'react'
import { Render } from 'components/Render'

const fetcher = async () => {
  const token = window.localStorage.getItem('token')
  const owner = window.localStorage.getItem('owner')
  const repo = window.localStorage.getItem('repo')
  const octokit = new Octokit({ auth: token })
  const file = await octokit.rest.repos.getContent({
    owner,
    repo,
    path: 'data/sidebar',
  })
  const blob = await octokit.rest.git.getBlob({
    owner,
    repo,
    // @ts-ignore
    file_sha: file.data.sha,
  })
  return blob
}

export const Sidebar = () => {
  const { data } = useSWR('sidebar', fetcher, {
    revalidateOnFocus: false,
  })
  const parsed = useMemo(() => {
    if (data) {
      return atob(data.data.content)
    }
    return ''
  }, [data])
  return <Render article={parsed}></Render>
}
