import { Block, Node, parse } from '@progfay/scrapbox-parser'
import videoParser from 'js-video-url-parser'
import Head from 'next/head'
import { useMemo } from 'react'
import Link from 'next/link'
// @ts-ignore
import filenamify from 'filenamify/browser'

const escapeAngle = (str: string) =>
  str.replace(/</g, '&lt;').replace(/(.)>/g, (_, p1) => `${p1}&gt;`)

const nodeRender = (node: Node) => {
  switch (node.type) {
    case 'plain':
      return escapeAngle(node.text)
    case 'hashTag': {
      return (
        <Link href={`/pages/${filenamify(node.href)}`}>
          <span>#{escapeAngle(node.href)}</span>
        </Link>
      )
    }
    case 'link': {
      switch (node.pathType) {
        case 'relative': {
          return (
            <Link href={`/pages/${filenamify(node.href)}`}>
              {escapeAngle(node.href)}
            </Link>
          )
        }
        case 'root':
          return (
            <a
              href={`https://scrapbox.io${node.href}`}
              target="_blank"
              rel="noopener"
            >
              {escapeAngle(node.href)}
            </a>
          )
        case 'absolute': {
          if (
            /^https:\/\/www\.youtube\.com/.test(node.href) ||
            /^https:\/\/youtu.be/.test(node.href)
          ) {
            const video = videoParser.parse(node.href)
            return (
              <amp-youtube
                data-videoid={video.id}
                layout="responsive"
                width="480"
                height="270"
              ></amp-youtube>
            )
          }
          return (
            <a href={node.href} target="_blank" rel="noopener">
              {node.content
                ? escapeAngle(node.content)
                : escapeAngle(node.href)}
            </a>
          )
        }
        default: {
          console.log(node)
          return ''
        }
      }
    }
    case 'image':
      return (
        <div>
          <amp-img class="contain" layout="fill" src={node.src} />
        </div>
      )
    case 'decoration':
      return <span>{node.nodes.map(nodeRender)}</span>
    case 'code':
      return <code>{escapeAngle(node.text)}</code>
    case 'icon': {
      switch (node.pathType) {
        case 'root': {
          if (node.path === '/icons/hr') {
            return <hr />
          } else {
            console.log(node)
            return
          }
        }
        default: {
          console.log(node)
          return
        }
      }
    }
    case 'quote': {
      return <blockquote>{node.nodes.map(nodeRender)}</blockquote>
    }
    default: {
      console.log(node)
      return ''
    }
  }
}

const blockRender = (block: Block) => {
  switch (block.type) {
    case 'line': {
      return (
        <div
          style={{ paddingBottom: `${block.indent}rem`, marginBottom: '.5rem' }}
        >
          {block.nodes.length > 0 ? block.nodes.map(nodeRender) : <br />}
        </div>
      )
    }
    case 'codeBlock': {
      return (
        <div style={{ paddingLeft: `${block.indent}rem`, overflow: 'scroll' }}>
          <code>{escapeAngle(block.fileName)}</code>
          <pre>
            <code>{escapeAngle(block.content)}</code>
          </pre>
        </div>
      )
    }
    case 'title': {
      return <h1>{block.text}</h1>
    }
    default:
      console.log(block)
      return ''
  }
}

type Props = {
  article: string
}

export const Render: React.FC<Props> = ({ article }) => {
  const parsed = useMemo(() => {
    return parse(article)
  }, [article])
  return (
    <div>
      <Head>
        <script async src="https://cdn.ampproject.org/v0.js"></script>
        <script
          async
          custom-element="amp-youtube"
          src="https://cdn.ampproject.org/v0/amp-youtube-0.1.js"
        ></script>
      </Head>
      <div>{parsed.map(blockRender)}</div>
    </div>
  )
}
