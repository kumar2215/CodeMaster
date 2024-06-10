import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

function Toolbar(params: any) {
  const editorRef = useRef(null);

  // const setContent = params.setContent;

  useEffect(() => {
    if (editorRef.current) {
      const quill = new Quill(editorRef.current, {
        theme: 'snow',
        placeholder: 'Write your post here...',
        modules: {
          toolbar: [
            [{ 'header': [1, 2, 3, false] }], // Customize header options
            ['bold', 'italic', 'underline', 'strike'], // Toggle buttons
            [{ 'script': 'sub'}, { 'script': 'super' }], // Subscript/Superscript
            ['blockquote', 'code-block'], // Blockquote and code block
            [{ 'list': 'ordered'}, { 'list': 'bullet' }], // Ordered and unordered list
            [{ 'indent': '-1'}, { 'indent': '+1' }], // Outdent and indent
            [{ 'direction': 'rtl' }], // Text direction
            [{ 'size': ['small', false, 'large', 'huge'] }], // Text size
            [{ 'color': [] }, { 'background': [] }], // Text color and background
            [{ 'font': [] }], // Font family
            [{ 'align': [] }], // Text alignment
            ['link', 'image', 'video'], // Media links
            ['clean'] // Clear formatting
          ]
        }
      });

      quill.root.style.fontSize = '1.125rem'; 
      // setContent(quill.root.innerHTML);

      // not working as intended, need to fix
      const toolbar = (editorRef.current as HTMLElement)?.querySelector('.ql-toolbar') as HTMLElement;
      if (toolbar) {
        toolbar.style.display = 'flex';
        toolbar.style.flexWrap = 'wrap';
        toolbar.style.gap = '0.5rem'; // Adjust the gap as needed
      }
    }
  }, []);
  
  return (
    <div className="bg-white rounded">
      <div ref={editorRef} style={{ height: '300px' }} />
    </div>
  );
};

export default Toolbar;