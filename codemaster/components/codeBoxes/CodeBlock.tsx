'use client';
import React, { useEffect } from 'react';
import hljs from 'highlight.js';
import { toast } from "react-toastify";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

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

const CodeBlock = ({ language, value, colorTheme } : {language: string, value: string, colorTheme: string}) => {

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
    <div className="w-full pl-2 text-base" onContextMenu={() => false}>
      <link rel="stylesheet" href={`https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.10.0/styles/${colorTheme}.css`} />
      <pre>
        <code 
        className={`language-${language}`} 
        style={{padding: "0rem", paddingRight: "1rem"}}>
          {value}
        </code>
      </pre>
    </div>
  );
};

export default CodeBlock;
