import Editor from "@monaco-editor/react";
import { useRef, useState } from "react";

import { v4 } from "uuid";

import style from "../styles/Index.module.css";
import { post as dataPost } from "../backends/textData";

export default function MonacoEditor({}) {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const [generateLink, setGenerateLink] = useState("");
  const [editorLang, setEditorLang] =useState("Plain Text")
  /**対応言語 */
  const options = ["Plain Text", "javascript", "python", "css"];

  /**monaco editorの初期化　editor, monacoインスタンスはonMount時に引数として*/
  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    monacoRef.current = monaco;
  }

  /**monaco editorの言語を変更する */
  function updateEditorLang(lang) {
    monacoRef.current.editor.setModelLanguage(
      editorRef.current.getModel(),
      lang
    );
    // 更新
    setEditorLang(lang)
  }

  /**monaco editorに記述されているテキストを取得 */
  function getValue() {
    const val = editorRef.current.getValue();
    return val;
  }

  /**ユーザー用にURLを生成 */
  function generatePageUrl(id) {
    const url = process.env.NEXT_PUBLIC_BASE_URL + "/display/" + id + "/";
    setGenerateLink(url);
    return url;
  }

  /**クリック時に全選択の状態にする */
  function selectLink() {
    document.getElementById("select-link").select();
  }

  /**入力データを保存。表示用のリンク取得 */
  function post() {
    // generate uuid
    const id = v4();

    // get value
    const postText = getValue();

    /**記述したテキストをPOSTする */
    const res = dataPost(postText, id, editorLang);
    if (res) {
      generatePageUrl(id);
    }
  }

  return (
    <div>
      <div className={`${style.text_title}`}>NoPaste Like App</div>

      <button onClick={post}>共有用のリンクを取得</button>
      <select
        onChange={(e) => updateEditorLang(options[e.target.selectedIndex])}
        defaultValue={options[0]}
      >
        {options.map((option, id) => (
          <option key={id} value={option}>
            {option}
          </option>
        ))}
      </select>
      <input
        defaultValue={generateLink}
        onClick={selectLink}
        id="select-link"
      ></input>
      <Editor
        height="90vh"
        width="100vw"
        defaultLanguage=""
        defaultValue=""
        options={{
          minimap: { enabled: false },
          overviewRulerLanes: 0,
          scrollbar: {
            vertical: "hidden",
            horizontal: "hidden",
            handleMouseWheel: false,
          },
        }}
        onMount={handleEditorDidMount}
      />
    </div>
  );
}
