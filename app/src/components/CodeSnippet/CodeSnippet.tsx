import { FC } from "react";
import styles from './CodeSnippet.module.scss';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

export interface Props{
    srcCode:string
}

export const CodeSnippet:FC<Props> = ({srcCode})=>{
    return (
        <div className={styles['code-snippeZ']}>
            <SyntaxHighlighter language="javascript" style={oneDark} showLineNumbers>
                {srcCode}
            </SyntaxHighlighter>
        </div>
    )
}

export default CodeSnippet;