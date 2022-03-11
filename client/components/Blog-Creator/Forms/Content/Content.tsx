import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  AtomicBlockUtils,
  CompositeDecorator,
  ContentBlock,
  Editor,
  EditorState,
  RichUtils,
} from 'draft-js';
import 'draft-js/dist/Draft.css';
import mediaBlockRenderer from '../Media/Media';
import url$ from 'lib/text-editor-image-uploader';
import showStyleForText from './utils/editor-style-options';
import confirmMedia from './utils/create-image';
import content__style from './content.module.css';
import { useObservable } from 'observable-hooks';
import { map, Observable, withLatestFrom } from 'rxjs';

import { style$ } from './utils/editor-style-options';

const HASHTAG_REGEX = /#[\w\u0590-\u05ff]+/g;

function findWithRegex(
  regex: RegExp,
  contentBlock: ContentBlock,
  callback: Function
) {
  const text = contentBlock.getText();
  let matchArr, start;
  while ((matchArr = regex.exec(text)) !== null) {
    start = matchArr.index;
    callback(start, start + matchArr[0].length);
  }
}
function hashtagStrategy(
  contentBlock: ContentBlock,
  callback: Function
  // contentState
) {
  findWithRegex(HASHTAG_REGEX, contentBlock, callback);
}

const composeStyles = (
  styless$: typeof style$,
  editorState$: Observable<[EditorState]>,
  setEditorState: Dispatch<SetStateAction<EditorState>>
) => {
  useEffect(() => {
    const subscription = styless$
      .pipe(
        withLatestFrom(editorState$),
        map(([style, [editorState]]) => {
          return RichUtils.toggleInlineStyle(editorState, style);
        })
      )
      .subscribe(setEditorState);
    return () => {
      subscription.unsubscribe();
    };
  }, []);
};

const HandleSpan: FC<{ offsetKey: number }> = (props) => {
  return (
    <span
      style={{
        backgroundColor: 'lightpink',
        padding: 10,
        margin: 10,
        borderRadius: 5,
        display: 'inline-block',
      }}
      data-offset-key={props.offsetKey}
    >
      {props.children}
    </span>
  );
};
const compositeDecoration = new CompositeDecorator([
  {
    strategy: hashtagStrategy,
    component: HandleSpan,
  },
]);

function MediaEditor() {
  const [editorState, setEditorState] = useState(
    EditorState.createEmpty(compositeDecoration)
  );
  const editorRef = useRef<Editor>(null);
  const [file, setFile] = useState<File>({} as File);

  const editorState$ = useObservable((input$) => input$, [editorState]);
  composeStyles(style$, editorState$, setEditorState);

  useEffect(() => {
    url$.subscribe(setFile);
  }, []);

  useEffect(() => {
    file.name
      ? confirmMedia(editorState, setEditorState, file, 'user-draft01')
      : null;
  }, [file]);

  const onChange = (newEditorState: EditorState) => {
    showStyleForText(newEditorState, setEditorState);
  };

  const handleKeyCommand = (command: string, editorState: EditorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  };

  return (
    <div className={content__style.editor}>
      <Editor
        blockRendererFn={mediaBlockRenderer}
        editorState={editorState}
        handleKeyCommand={handleKeyCommand}
        onChange={onChange}
        placeholder="Enter some text..."
        customStyleMap={{
          HIGHLIGHT: {
            backgroundColor: 'red',
          },
        }}
        ref={editorRef}
      />
    </div>
  );
}

export default MediaEditor;
