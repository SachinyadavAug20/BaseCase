import { Code } from 'bright'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

Code.theme = {
  light: "github-light",
  dark: "github-dark",
  lightSelector: "html.light",
}

const Preview = ({ content }: { content: string }) => {
  const formattedContent = content.replace(/\\/g, '').replace(/&#x20;/g, '')

  return (
    <section className="markdown prose grid break-words">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre: (props) => (
            <Code {...props} lineNumbers className="shadow-light-200 dark:shadow-dark-200" />
          ),
        }}
      >
        {formattedContent}
      </ReactMarkdown>
    </section>
  )
}

export default Preview
