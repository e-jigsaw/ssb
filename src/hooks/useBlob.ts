import useSWR from 'swr'
import { Octokit } from '@octokit/rest'
import { SWRConfiguration } from 'swr/dist/types'

const fetcher = async (_: 'pages', repo: string, path: string) => {
  if (!path || !repo) {
    throw null
  }
  const token = window.localStorage.getItem('token')
  const owner = window.localStorage.getItem('owner')
  const octokit = new Octokit({ auth: token })
  const file = await octokit.rest.repos.getContent({
    owner,
    repo,
    path: `data/${path}`,
  })
  const blob = await octokit.rest.git.getBlob({
    owner,
    repo,
    // @ts-ignore
    file_sha: file.data.sha,
  })
  return blob
}

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T

export const useBlob = (
  path: ['pages', string, string],
  opt: SWRConfiguration<ThenArg<ReturnType<typeof fetcher>>> = {}
) => {
  const res = useSWR<ThenArg<ReturnType<typeof fetcher>>>(path, fetcher, {
    revalidateOnFocus: false,
    errorRetryCount: 0,
    ...opt,
  })
  return res
}
