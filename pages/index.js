import Editor from "@monaco-editor/react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

import { v4 } from "uuid";

import style from "../styles/Index.module.css";
import { post as dataPost, get as dataGet } from "../backends/textData";

export default function MonacoEditor({}) {
  const router = useRouter();
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const [generateLink, setGenerateLink] = useState("");
  const [editorLang, setEditorLang] = useState("Plain Text");
  const [fetchData, setFetchData] = useState(null);
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
    setEditorLang(lang);
  }

  /**monaco editorに記述されているテキストを取得 */
  function getValue() {
    const val = editorRef.current.getValue();
    return val;
  }

  /**ユーザー用にURLを生成 */
  function generatePageUrl(id) {
    const url = process.env.NEXT_PUBLIC_BASE_URL + "/?id=" + id;
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

  /** uuidからデータを取得 */
  function getData(id) {
    console.log("get");
    dataGet(id).then((res) => setFetchData(res));
  }

  /** query param idがある時のみAPIにfetch */
  useEffect(() => {
    if (!fetchData) {
      if (router.query.id) {
        getData(router.query.id);
      }
    }
  });
  if (router.query.id && !fetchData) {
    return <div>Loading</div>;
  } else if (fetchData || !router.query.id) {
    return (
      <div>
        <div className={`${style.title_text} ${style.title_box}`}>
          NoPaste Like App
        </div>
        <div className={`${style.nav_box}`}>
          <div className={style.nav_item}>
            <select
              onChange={(e) =>
                updateEditorLang(options[e.target.selectedIndex])
              }
              defaultValue={options[0]}
              className={`${style.pulldown_box}`}
            >
              {options.map((option, id) => (
                <option key={id} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className={`${style.nav_item}`}>
            <button onClick={post} className={`${style.link_btn}`}>URLを取得</button>
            <span className={style.link_arrow}>→</span>
          </div>
          <div className={`${style.nav_item}`}>
            <input
              defaultValue={generateLink}
              onClick={selectLink}
              id="select-link"
              readOnly="readonly"
              className={style.link_box}
            ></input>
          </div>
          <div className={style.explain_box}>
            ・テキストを入力後に「URLを取得」をクリックすることで、共有可能なURLを取得する事ができます。<br />
            ・入力するプログラミング言語を指定することも可能です。
          </div>
        </div>

        <Editor
          height="90vh"
          width="100vw"
          defaultLanguage={fetchData ? fetchData.lang : "Plain Text"}
          defaultValue={fetchData ? fetchData.text : ""}
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
          className={style.editor}
        />
      </div>
    );
  }
}
