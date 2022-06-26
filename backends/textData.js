
/**
 * DRFで作成したAPIへPOSTを実行
 * @param postText monaco editor内のテキストデータ
 * @param id uuid
 * @param lang monaco editorで指定している言語
 * @returns 実行結果
 */
export async function post(postText, id, lang) {
    const url = process.env.NEXT_PUBLIC_BASE_API_URL + "/data_manage/";

    const data = { text: postText, id: id, lang: lang };

    const res = await fetch(url, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })

    // TODO: error処理を
    return true
}



/**
 * @param id 取得するオブジェクトのuuid
 * @returns json response
 */
export async function get(id){
  const url = process.env.NEXT_PUBLIC_BASE_API_URL + "/data_manage/display/" + id

  const res = await fetch(url)
  const data = await res.json()

  return data
}