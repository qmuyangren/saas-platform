import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import ReactQuill, { ReactQuillProps } from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface EditorProps extends Omit<ReactQuillProps, 'theme'> {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  height?: number;
  readOnly?: boolean;
}

export interface EditorRef {
  getEditor: () => any;
  getValue: () => string;
  setValue: (value: string) => void;
  focus: () => void;
  blur: () => void;
}

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    ['link', 'image', 'video'],
    ['clean'],
  ],
};

const Editor = forwardRef<EditorRef, EditorProps>(
  ({ value = '', onChange, placeholder = '请输入内容...', height = 300, readOnly = false, ...props }, ref) => {
    const quillRef = useRef<any>(null);

    useImperativeHandle(ref, () => ({
      getEditor: () => quillRef.current?.getEditor(),
      getValue: () => value,
      setValue: (newValue: string) => {
        onChange?.(newValue);
      },
      focus: () => {
        quillRef.current?.getEditor()?.focus();
      },
      blur: () => {
        quillRef.current?.getEditor()?.blur();
      },
    }));

    return (
      <div style={{ background: '#fff' }}>
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          placeholder={placeholder}
          readOnly={readOnly}
          style={{ height }}
          {...props}
        />
      </div>
    );
  }
);

export default Editor;
