import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import Editor from "@monaco-editor/react";
import { useRef } from "react";

export default function DisplayNopaste() {
  const router = useRouter();
  const { id } = router.query;

  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const editorRef = useRef(null);

  /**monaco editorに記述されているテキストを取得 */
  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  /** uuidからデータを取得 */
  async function getData() {
    if (id && isLoading) {
      console.log("conceed");
      const res = await fetch(process.env.NEXT_PUBLIC_BASE_API_URL + "/data_manage/display/" + id);
      const json = await res.json();
      setLoading(false);
      setData(json);
    }
  }

  if (id) {
    getData();
  }

  if (isLoading) return <div>Loading</div>;
  else
    return (
      <div>
        display nopaste
        <Editor
          height="90vh"
          defaultLanguage="javascript"
          defaultValue={data.text}
          onMount={handleEditorDidMount}
        />
      </div>
    );
}
