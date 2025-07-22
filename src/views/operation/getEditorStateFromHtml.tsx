'use client'

import { ContentState, EditorState } from 'draft-js'

function getEditorStateFromHtml(html: string): EditorState {
  if (typeof window === 'undefined') return EditorState.createEmpty()
  const htmlToDraft = require('html-to-draftjs').default
  try {
    if (!html) return EditorState.createEmpty()

    const blocksFromHtml = htmlToDraft(html)
    if (!blocksFromHtml?.contentBlocks?.length) return EditorState.createEmpty()

    const contentState = ContentState.createFromBlockArray(blocksFromHtml.contentBlocks, blocksFromHtml.entityMap)
    return EditorState.createWithContent(contentState)
  } catch (error) {
    return EditorState.createEmpty()
  }
}

export default getEditorStateFromHtml
