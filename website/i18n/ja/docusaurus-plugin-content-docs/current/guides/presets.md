# プリセットをつかう

いくつかのプリセットがあります。ルールはそれぞれを有効にする必要があるため、これらを指定することをオススメします。

## プリセットの適用

[設定](/docs/configuration)の`extends`プロパティを以下のように指定します。

```json
{
  "extends": ["markuplint:recommended"]
}
```

好みに合わせて、いくつかの**基本プリセット**を選択できます。

```json
{
  "extends": ["markuplint:html-standard", "markuplint:a11y"]
}
```

### 基本プリセット {#base-presets}

- `markuplint:a11y`
- `markuplint:html-standard`
- `markuplint:performance`
- `markuplint:rdfa`
- `markuplint:security`

各プリセットに含まれる[ルールセット](#rulesets-of-base-presets)を参照してください。

### 推奨プリセット

- `markuplint:recommended`
- `markuplint:recommended-static-html`
- `markuplint:recommended-react`
- `markuplint:recommended-vue`
- `markuplint:recommended-svelte`

これらの**推奨プリセット**には、**すべての[基本プリセット](#base-presets)**が含まれています。また、`markuplint:recommended`以外はそれぞれ[固有のルールセット](#syntax-specific-presets)を持っています。

## 基本プリセットのルールセット {#rulesets-of-base-presets}

| ルールセット                                                                                                                            | 解説                                                                                                                                                 | `a11y` | `html-standard` | `performance` | `rdfa` | `security` |
| --------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | --------------- | ------------- | ------ | ---------- |
| [Must not duplicate **ID**](https://www.w3.org/WAI/WCAG21/Techniques/html/H93.html)                                                     | Be able to avoid problems in assistive technologies from the viewpoint of machine readability.                                                       | ✅     | ✅              | ❌            | ❌     | ❌         |
| [Disallow `autofocus` attr](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autofocus#accessibility_considerations) |                                                                                                                                                      | ✅     | ❌              | ❌            | ❌     | ❌         |
| [`tabindex` attr only `-1` or `0`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex#accessibility_concerns) |                                                                                                                                                      | ✅     | ❌              | ❌            | ❌     | ❌         |
| `<label>` should have control                                                                                                           |                                                                                                                                                      | ✅     | ❌              | ❌            | ❌     | ❌         |
| [Use **landmark**](https://www.w3.org/TR/wai-aria-practices/examples/landmarks/)                                                        |                                                                                                                                                      | ✅     | ❌              | ❌            | ❌     | ❌         |
| No refer to no existent **ID**                                                                                                          |                                                                                                                                                      | ✅     | ✅              | ❌            | ❌     | ❌         |
| Require **accessible name**                                                                                                             |                                                                                                                                                      | ✅     | ❌              | ❌            | ❌     | ❌         |
| Require `<h1>`                                                                                                                          |                                                                                                                                                      | ✅     | ❌              | ❌            | ❌     | ❌         |
| Use `<ul>`                                                                                                                              |                                                                                                                                                      | ✅     | ❌              | ❌            | ❌     | ❌         |
| Conform to **WAI-ARIA**                                                                                                                 |                                                                                                                                                      | ✅     | ❌              | ❌            | ❌     | ❌         |
| Require `<html lang>`                                                                                                                   |                                                                                                                                                      | ✅     | ❌              | ❌            | ❌     | ❌         |
| Require `<abbr title>`                                                                                                                  |                                                                                                                                                      | ✅     | ❌              | ❌            | ❌     | ❌         |
| Require `<track>`                                                                                                                       |                                                                                                                                                      | ✅     | ❌              | ❌            | ❌     | ❌         |
| Require `<video muted>`                                                                                                                 |                                                                                                                                                      | ✅     | ❌              | ❌            | ❌     | ❌         |
| No merge cells                                                                                                                          |                                                                                                                                                      | ✅     | ❌              | ❌            | ❌     | ❌         |
| [`<summary>` no contains interactive contents](https://github.com/whatwg/html/issues/2272#issuecomment-1242415594)                      | There is a case where an assistive technology can't access contents, or contents don't propagate a mouse event to `<summary>`.                       | ✅     | ❌              | ❌            | ❌     | ❌         |
| [No duplicate attr](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-duplicate-attribute)                                | The parser ignores all such duplicate occurrences of the attribute.                                                                                  | ❌     | ✅              | ❌            | ❌     | ❌         |
| Use **character reference**                                                                                                             |                                                                                                                                                      | ❌     | ✅              | ❌            | ❌     | ❌         |
| No use deprecated attr                                                                                                                  | You should not use deprecated attributes from the viewpoint of compatibility.                                                                        | ❌     | ✅              | ❌            | ❌     | ❌         |
| No use deprecated element                                                                                                               | You should not use deprecated elements from the viewpoint of compatibility.                                                                          | ❌     | ✅              | ❌            | ❌     | ❌         |
| [Require `doctype`](https://html.spec.whatwg.org/multipage/syntax.html#syntax-doctype)                                                  | It has the effect of avoiding quirks mode.                                                                                                           | ❌     | ✅              | ❌            | ❌     | ❌         |
| No use ineffective attr                                                                                                                 |                                                                                                                                                      | ❌     | ✅              | ❌            | ❌     | ❌         |
| Allow only **permitted contents**                                                                                                       |                                                                                                                                                      | ❌     | ✅              | ❌            | ❌     | ❌         |
| Need **placeholder label option**                                                                                                       |                                                                                                                                                      | ❌     | ✅              | ❌            | ❌     | ❌         |
| Require the `datetime` attribute if the content of the `time` element is invalid                                                        |                                                                                                                                                      | ❌     | ✅              | ❌            | ❌     | ❌         |
| Specify required attr                                                                                                                   |                                                                                                                                                      | ❌     | ✅              | ❌            | ❌     | ❌         |
| [Specify `charset=UTF-8`](https://html.spec.whatwg.org/multipage/semantics.html#charset)                                                |                                                                                                                                                      | ❌     | ✅              | ❌            | ❌     | ❌         |
| [No use `<small>` as **subheadings**](https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-small-element)               | Should not use it in `<h1>`, `<h2>`, `<h3>`, `<h4>`, `<h5>`, and `<h6>`.                                                                             | ❌     | ✅              | ❌            | ❌     | ❌         |
| [No use `<caption>` within `<figure>`](https://html.spec.whatwg.org/multipage/tables.html#the-caption-element)                          | When `<table>` is the only content in `<figure>` other than `<figcaption>`, `<caption>` should be omitted in favor of `<figcaption>`.                | ❌     | ✅              | ❌            | ❌     | ❌         |
| [Require `charset=UTF-8`](https://html.spec.whatwg.org/multipage/semantics.html#charset)                                                |                                                                                                                                                      | ❌     | ❌              | ✅            | ❌     | ❌         |
| Require `defer` attr                                                                                                                    | Should load and parse scripts lazily to avoid render-blocking.                                                                                       | ❌     | ❌              | ✅            | ❌     | ❌         |
| Require **aspect-ratio**                                                                                                                | Require `width` and `height` attr with `<img>` to avoid **Cumulative Layout Shift**                                                                  | ❌     | ❌              | ✅            | ❌     | ❌         |
| Require async decoding image                                                                                                            | Require `decoding=async` with `<img>` to avoid render-blocking.                                                                                      | ❌     | ❌              | ✅            | ❌     | ❌         |
| Require loading `<iframe>` lazily                                                                                                       | Require `loading=lazy` with `<iframe>` to avoid render-blocking that causes loading if its element is out of the viewport.                           | ❌     | ❌              | ✅            | ❌     | ❌         |
| Allow `property` attr with `<meta>`                                                                                                     | Be able to use **Open-Graph** etc.                                                                                                                   | ❌     | ❌              | ❌            | ✅     | ❌         |
| Require `noreferrer` with `target=_blank`                                                                                               | Require `rel=noreferrer` with an element that has `target=_blank` to prevent leaking referrer information and to block operating referrer documents. | ❌     | ❌              | ❌            | ❌     | ✅         |

## 構文固有のルールセット {#syntax-specific-presets}

| ルールセット          | 解説                                                                                                                                                                   | `recommended-static-html` | `recommended-react` | `recommended-vue` | `recommended-svelte` |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- | ------------------- | ----------------- | -------------------- |
| No hard coding **ID** | The component that hard-coded ID cannot mount to an app duplicated because the IDs must be unique in a document. Recommend to specify dynamic IDs to avoid doing that. | ❌                        | ✅                  | ✅                | ✅                   |
| No omit **end-tag**   | Recommend to write an end-tag always because it is too difficult for a human decide an element is end-tag omittable.                                                   | ✅                        | ❌                  | ❌                | ❌                   |
