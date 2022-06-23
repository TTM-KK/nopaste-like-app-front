import Editor from "@monaco-editor/react";
import { useRef } from "react";

import { v4 } from "uuid";

export default function MonacoEditor({}) {
  const editorRef = useRef(null);
  /**monaco editorの初期化*/
  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  // function showValue() {
  //   alert(editorRef.current.getValue());
  //   console.log(editorRef.current.getValue())
  // }

  /**monaco editorに記述されているテキストを取得 */
  function getValue() {
    const val = editorRef.current.getValue();
    return val;
  }

  /**ユーザー用にURLを生成 */
  function generatePageUrl(id) {
    const url =
      process.env.NEXT_PUBLIC_BASE_URL + "/display/" + id + "/";
    return url;
  }

  /**記述したテキストをPOSTする */
  async function postData() {
    const url = process.env.NEXT_PUBLIC_BASE_API_URL + "/data_manage/";

    console.log(data);
    // generate uuid
    const id = v4();
    console.log(id);

    const data = { text: getValue(), id: id };
    const body = JSON.stringify(data);
    console.log("body", body);

    const res = await fetch(url, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    // if post success
    const link = generatePageUrl(id);
    alert(link);

    console.log("res", res);

    const json = await res.json();
    return json;
  }

  return (
    <div>
      <button onClick={getValue}>get value</button>
      <button onClick={postData}>generate link</button>
      <Editor
        height="90vh"
        defaultLanguage="javascript"
        defaultValue="// some comment"
        onMount={handleEditorDidMount}
      />
    </div>
  );
}