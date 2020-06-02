import React from 'react'
import Prism from 'prismjs';

const log = console.log.bind(console)

class PrismjsDemo extends React.Component{
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        const code = `const listMaxValue = (list) => {
let max = list[0]
for(let i = 1, len = list.length; i < len; i++) {
    if(max > list[i]) {
        max = list[i]
    }
}
return max
}`

        log(Prism)

        let codeHtml = {
            // Prism.highlight(text, grammar, language)
            // text: 需要格式化的代码
            // grammar: 需要格式化代码的语法
            // language: 需要格式化代码表示的语言
            __html: Prism.highlight(code, Prism.languages.javascript, 'javascript')
        }

        return (
            <>
                <pre className="language-javascript line-numbers">
                    <code dangerouslySetInnerHTML={codeHtml}></code>
                </pre>
            </>
        )
    }
}

export default PrismjsDemo