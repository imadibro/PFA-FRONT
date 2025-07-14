'use client'

import { Editor } from 'react-draft-wysiwyg'
import type { SystemMode } from '@core/types'

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

const toolbarOptions = {
  options: [
    'inline',
    'blockType',
    'fontSize',
    'list',
    'textAlign',
    'history',
    'link',
    'image',
    'emoji',
    'colorPicker',
    'remove',
    'embedded',
    'fontFamily'
  ],
  inline: {
    inDropdown: false,
    options: ['bold', 'italic', 'underline', 'strikethrough', 'monospace']
  },
  blockType: {
    inDropdown: true,
    options: ['Normal', 'H1', 'H2', 'H3', 'Blockquote']
  },
  fontSize: {
    options: [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36],
    inDropdown: true
  },
  list: {
    inDropdown: false,
    options: ['unordered', 'ordered']
  },
  textAlign: {
    inDropdown: false,
    options: ['left', 'center', 'right', 'justify']
  },
  history: {
    inDropdown: false,
    options: ['undo', 'redo']
  },
  link: {
    inDropdown: false,
    options: ['link', 'unlink']
  },
  image: {
    uploadCallback: (file: File) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          resolve({ data: { link: reader.result as string } })
        }
        reader.onerror = () => {
          reject(new Error('Image upload failed'))
        }
        reader.readAsDataURL(file)
      }),
    previewImage: true,
    alt: { present: true, mandatory: false }
  },
  emoji: {
    emojis: [
      '😀',
      '😁',
      '😂',
      '🤣',
      '😃',
      '😄',
      '😅',
      '😆',
      '😉',
      '😊',
      '😋',
      '😎',
      '😍',
      '😘',
      '🥰',
      '😗',
      '😙',
      '😚',
      '🙂',
      '🤗'
      // Add more emojis as needed
    ]
  },
  colorPicker: {
    colors: [
      '#000000',
      '#FF0000',
      '#00FF00',
      '#0000FF',
      '#FFFF00',
      '#FF00FF',
      '#00FFFF',
      '#FFFFFF',
      '#808080',
      '#C0C0C0'
    ]
  },
  remove: {
    inDropdown: false,
    options: ['remove']
  },
  embedded: {
    defaultSize: {
      height: 'auto',
      width: '100%'
    },
    inDropdown: false,
    options: ['embedded']
  },
  fontFamily: {
    options: ['Arial', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana'],
    inDropdown: true
  }
}

const draftStyle = {
  wrapperStyle: {
    backgroundColor: 'inherit',
    border: '1px solid #ccc',
    borderRadius: '4px',
    padding: '10px',
    color: 'inherit',
    fontFamily: 'Arial, sans-serif',
    fontSize: '14px',
    lineHeight: '1.5'
  },
  editorStyle: {
    backgroundColor: 'inherit',
    color: 'inherit',
    padding: '10px',
    minHeight: '200px',
    fontFamily: 'Arial, sans-serif',
    fontSize: '14px',
    lineHeight: '1.5'
  },
  toolbarStyle: {
    backgroundColor: 'inherit',
    borderBottom: '1px solid #ccc',
    padding: '5px',
    color: 'black'
  }
}

const RichTextEditor = (props: { mode: SystemMode; editorState: any; setEditorState: (state: any) => void }) => {
  const { setEditorState, editorState } = props

  const onEditorStateChange = (state: any = {}) => {
    setEditorState(state)
  }

  return (
    <Editor
      editorState={editorState}
      onEditorStateChange={onEditorStateChange}
      toolbar={toolbarOptions}
      defaultEditorState={editorState}
      placeholder='Écrivez votre texte ici...'
      {...draftStyle}
    />
  )
}

export default RichTextEditor
