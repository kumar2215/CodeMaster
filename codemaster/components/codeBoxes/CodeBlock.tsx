'use client';
import React, { useEffect } from 'react';
import hljs from 'highlight.js';
import './styles/defualt.css';
import { toast } from "react-toastify";

function interceptKeys(evt: any) {
    evt = evt || window.event; // IE support
    const c = evt.keyCode;
    const ctrlDown = evt.ctrlKey || evt.metaKey; // Mac support

    if (ctrlDown && evt.altKey) return true;

    // Check for ctrl+c, v and x
    if (ctrlDown && (c === 67 || c === 86 || c === 88)) {
        toast("No cheating allowed!", {type: "warning", autoClose: 3000});
        evt.preventDefault();
        return false;
    }

    // Otherwise allow
    return true;
}

const CodeBlock = ({ language, value } : {language: string, value: string}) => {
    useEffect(() => {
        hljs.highlightAll();

        document.addEventListener('keydown', interceptKeys);
        document.addEventListener('contextmenu', (e) => e.preventDefault());
        document.addEventListener('dragstart', (e) => e.preventDefault());

        return () => {
            document.removeEventListener('keydown', interceptKeys);
            document.removeEventListener('contextmenu', (e) => e.preventDefault());
            document.removeEventListener('dragstart', (e) => e.preventDefault());
        };
    }, []);

    return (
    <div className="pl-4 text-base" onContextMenu={() => false}>
        <pre>
          <code className={`language-${language} lg:text-base text-xs`}>
            {value}
          </code>
        </pre>
    </div>
    );
};

export default CodeBlock;
