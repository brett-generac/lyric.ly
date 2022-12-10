import React, { useState, useMemo, useCallback } from 'react';
import { Box } from '@mui/material';
import { createEditor, Editor, Transforms } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';

import { Word } from './Word';

import type { BaseEditor, Descendant, Element } from 'slate';
import type { ReactEditor, RenderElementProps } from 'slate-react';

type CustomElement = { type: 'paragraph'; children: CustomText[] };
type CustomText = { text: string };

type RenderElementPropsWithCustomProperty = RenderElementProps & {
  element: Element & {
    isWord?: boolean;
  };
};

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

const boxSx = {
  height: '100%',
  border: '1px solid darkgray',
  borderRadius: '8px',
  padding: '8px',
};

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];

export const TextEditor = () => {
  const editor = useMemo(() => withReact(createEditor()), []);

  const [editorValue, setEditorValue] = useState(initialValue);

  const renderElement = useCallback((props: RenderElementPropsWithCustomProperty) => {
    if (props.element.isWord) {
      return <Word {...props} />;
    } else {
      return <span {...props.attributes}>{props.children}</span>;
    }
  }, []);

  const handleKeyDown = (event: any) => {
    const isSpaceKey = event.key === ' ';
    const isEnterKey = event.key === 'Enter';
    if (isSpaceKey || isEnterKey) {
      event.preventDefault();
      //@ts-ignore
      Transforms.setNodes(editor, { isWord: true });
      const newText = isEnterKey ? '\n' : ' ';
      const newNode = { type: 'span', children: [{ text: newText }] };
      //@ts-ignore
      Transforms.insertNodes(editor, newNode);
    }
  };

  return (
    <Box sx={boxSx}>
      <Slate editor={editor} value={editorValue} onChange={(value) => setEditorValue(value)}>
        <Editable renderElement={renderElement} onKeyDown={handleKeyDown} />
      </Slate>
    </Box>
  );
};