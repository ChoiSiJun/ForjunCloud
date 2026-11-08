import { useEffect, useRef } from 'react';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import useFileUploadMutation from '@domain/upload/api/useFileUploadMutation';
import { toast } from 'react-toastify';

interface BoardEditorProps {
  placeholder?: string;
  directory?: string;
  value?: string;
  setValue: (value: string) => void;
}

const BoardEditor = ({ value = '', setValue, placeholder = '내용을 입력해주세요.', directory = 'etc' }: BoardEditorProps) => {
  const editorRef = useRef<Editor>(null);

  const { mutateAsync: uploadFile } = useFileUploadMutation();

  useEffect(() => {
    const editorInstance = editorRef.current?.getInstance();
    if (editorInstance) {
      if (editorInstance.getMarkdown() !== value) {
        editorInstance.setMarkdown(value || '');
      }
    }
  }, [value]);

  const onUploadImage = async (blob: Blob, callback: (url: string, alt: string) => void) => {
    // 1. 원본 파일명 확인
    let fileName = (blob as File).name;

    // 2. 파일명이 없는 경우 (복사+붙여넣기 등) 이름 지어주기
    if (!fileName) {
      // blob.type은 "image/png" 또는 "image/jpeg" 형태입니다.
      const extension = blob.type.split('/')[1] || 'png';
      fileName = `image_${Date.now()}.${extension}`;
    }

    // 3. 정확한 타입과 이름을 가진 File 객체 생성
    const file = new File([blob], fileName, { type: blob.type });

    try {
      const response = await uploadFile({ uploadFile: file, directory });
      callback(response.url, fileName);
    } catch (error) {
      toast.error('이미지 업로드 실패');
    }
  };

  const handleChange = () => {
    const instance = editorRef.current?.getInstance()?.getMarkdown();
    setValue(instance ?? '');
  };

  return (
    <div>
      <Editor
        ref={editorRef}
        placeholder={placeholder}
        previewStyle="vertical" // 미리보기 스타일 (tab, vertical)
        height="500px"
        initialEditType="wysiwyg" // 초기 에디터 모드 (markdown, wysiwyg)
        useCommandShortcut // 단축키 사용 여부
        onChange={handleChange}
        initialValue={value}
        hooks={{
          addImageBlobHook: onUploadImage,
        }}
      />
    </div>
  );
};

export default BoardEditor;
