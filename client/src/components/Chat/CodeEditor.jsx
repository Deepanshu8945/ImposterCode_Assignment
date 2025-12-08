import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import './CodeEditor.css';

const CodeEditor = ({ socket, room, name }) => {
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('// Start coding here...');
  const [typingUsers, setTypingUsers] = useState([]);
  const editorRef = useRef(null);

  // Debounce helper
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  useEffect(() => {
    if (!socket) return;

    // Listen for code changes from other users
    socket.on('code_update', (newCode) => {
      if (editorRef.current) {
        const currentPosition = editorRef.current.getPosition();
        setCode(newCode);
        // Restore cursor position if possible (basic implementation)
        // editorRef.current.setPosition(currentPosition); 
      }
    });

    // Listen for language changes
    socket.on('language_update', (newLanguage) => {
      setLanguage(newLanguage);
    });

    // Listen for editor typing
    socket.on('display_editor_typing', (userName) => {
      if (!typingUsers.includes(userName)) {
        setTypingUsers((prev) => [...prev, userName]);
        setTimeout(() => {
          setTypingUsers((prev) => prev.filter((u) => u !== userName));
        }, 3000);
      }
    });

    return () => {
      socket.off('code_update');
      socket.off('language_update');
      socket.off('display_editor_typing');
    };
  }, [socket, typingUsers]);

  const handleEditorChange = (value) => {
    setCode(value);
    debouncedEmitCodeChange(value);
    socket.emit('editor_typing', { room, name });
  };

  const roomRef = useRef(room);
  const socketRef = useRef(socket);

  useEffect(() => {
    roomRef.current = room;
    socketRef.current = socket;
  }, [room, socket]);

  const debouncedEmitCodeChange = useRef(
    debounce((value) => {
      socketRef.current?.emit('code_change', { room: roomRef.current, code: value });
    }, 300)
  ).current;

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    socket.emit('language_change', { room, language: newLang });
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  return (
    <div className="code-editor-container">
      <div className="editor-header">
        <select value={language} onChange={handleLanguageChange} className="language-selector">
          <option value="python">Python</option>
          <option value="c">C</option>
          <option value="cpp">C++</option>
          <option value="javascript">JavaScript</option>
        </select>
        <div className="typing-indicator-editor">
           {typingUsers.length > 0 && (
             <span style={{ color: '#aaa', fontSize: '0.8rem' }}>
               {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} coding...
             </span>
           )}
        </div>
      </div>
      <Editor
        height="90vh"
        language={language}
        value={code}
        theme="vs-dark"
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
        }}
      />
    </div>
  );
};

export default CodeEditor;
