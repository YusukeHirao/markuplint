# @markuplint/config-presets

[![npm version](https://badge.fury.io/js/%40markuplint%2Fconfig-presets.svg)](https://www.npmjs.com/package/@markuplint/config-presets)
[![Build Status](https://travis-ci.org/markuplint/markuplint.svg?branch=main)](https://travis-ci.org/markuplint/markuplint)
[![Coverage Status](https://coveralls.io/repos/github/markuplint/markuplint/badge.svg?branch=main)](https://coveralls.io/github/markuplint/markuplint?branch=main)

## Usage

To the `extends` property of the configuration, specify like below:

```json
{
  "exnteds": ["markuplint:recommended"]
}
```

You can choose some presets appropriately for your preference.

```json
{
  "exnteds": ["markuplint:html-standard", "markuplint:a11y"]
}
```

## Presets

Ruleset|Description|`recommended`|`recommended-vue`|`recommended-svelte`|`recommended-static-html`|`recommended-react`|`a11y`|`code-styles`|`html-standard`|`performance`|`rdfa`|`security`|
---|---|---|---|---|---|---|---|---|---|---|---|---|
[Disallow `<hgroup>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/hgroup)|The hgroup element should not be used because no assistive technology supports it.|✅|✅|✅|✅|✅|✅|❌|❌|❌|❌|❌|
[Must not duplicate **ID**](https://www.w3.org/WAI/WCAG21/Techniques/html/H93.html)|Be able to avoid problems in assistive technologies from the viewpoint of machine readability.|✅|✅|✅|✅|✅|✅|❌|✅|❌|❌|❌|
[Disallow `autofocus` attr](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autofocus#accessibility_considerations)||✅|✅|✅|✅|✅|✅|❌|❌|❌|❌|❌|
[`tabindex` attr only `-1` or `0`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex#accessibility_concerns)||✅|✅|✅|✅|✅|✅|❌|❌|❌|❌|❌|
[Use **landmark**](https://www.w3.org/TR/wai-aria-practices/examples/landmarks/)||✅|✅|✅|✅|✅|✅|❌|❌|❌|❌|❌|
No refer to no existent **ID**||✅|✅|✅|✅|✅|✅|❌|✅|❌|❌|❌|
Require **accessible name**||✅|✅|✅|✅|✅|✅|❌|❌|❌|❌|❌|
Require `<h1>`||✅|✅|✅|✅|✅|✅|❌|❌|❌|❌|❌|
Use `<ul>`||✅|✅|✅|✅|✅|✅|❌|❌|❌|❌|❌|
Conform to **WAI-ARIA**||✅|✅|✅|✅|✅|✅|❌|❌|❌|❌|❌|
Require `<html lang>`||✅|✅|✅|✅|✅|✅|❌|❌|❌|❌|❌|
Require `<abbr title>`||✅|✅|✅|✅|✅|✅|❌|❌|❌|❌|❌|
Require `<track>`||✅|✅|✅|✅|✅|✅|❌|❌|❌|❌|❌|
Require `<video muted>`||✅|✅|✅|✅|✅|✅|❌|❌|❌|❌|❌|
No merge cells||✅|✅|✅|✅|✅|✅|❌|❌|❌|❌|❌|
[No duplicate attr](https://html.spec.whatwg.org/multipage/parsing.html#parse-error-duplicate-attribute)|The parser ignores all such duplicate occurrences of the attribute.|✅|✅|✅|✅|✅|❌|❌|✅|❌|❌|❌|
Use **character reference**||✅|✅|✅|✅|✅|❌|❌|✅|❌|❌|❌|
No use depreacted attr|You should not use deprecated attributes from the viewpoint of compatibility.|✅|✅|✅|✅|✅|❌|❌|✅|❌|❌|❌|
No use depreacted element|You should not use deprecated elements from the viewpoint of compatibility.|✅|✅|✅|✅|✅|❌|❌|✅|❌|❌|❌|
[Require `doctype`](https://html.spec.whatwg.org/multipage/syntax.html#syntax-doctype)|It has the effect of avoiding quirks mode.|✅|✅|✅|✅|✅|❌|❌|✅|❌|❌|❌|
No use ineffective attr||✅|✅|✅|✅|✅|❌|❌|✅|❌|❌|❌|
Allow only **permitted contents**||✅|✅|✅|✅|✅|❌|❌|✅|❌|❌|❌|
Specify required attr||✅|✅|✅|✅|✅|❌|❌|✅|❌|❌|❌|
[Specify `charset=UTF-8`](https://html.spec.whatwg.org/multipage/semantics.html#charset)||✅|✅|✅|✅|✅|❌|❌|✅|❌|❌|❌|
[No use `<small>` as **subheadings**](https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-small-element)|Should not use it in `<h1>`, `<h2>`, `<h3>`, `<h4>`, `<h5>`, and `<h6>`.|✅|✅|✅|✅|✅|❌|❌|✅|❌|❌|❌|
[No use `<caption>` within `<figure>`](https://html.spec.whatwg.org/multipage/tables.html#the-caption-element)|When `<table>` is the only content in `<figure>` other than `<figcaption>`, `<caption>` should be omitted in favor of `<figcaption>`.|✅|✅|✅|✅|✅|❌|❌|✅|❌|❌|❌|
[Require `charset=UTF-8`](https://html.spec.whatwg.org/multipage/semantics.html#charset)||✅|✅|✅|✅|✅|❌|❌|❌|✅|❌|❌|
Require `defer` attr|Should load and parse scripts lazily to avoid render-blocking.|✅|✅|✅|✅|✅|❌|❌|❌|✅|❌|❌|
Require **aspect-ratio**|Require `width` and `height` attr with `<img>` to avoid **Cumulative Layout Shift**|✅|✅|✅|✅|✅|❌|❌|❌|✅|❌|❌|
Require async decoding image|Require `decoding=async` with `<img>` to avoid render-blocking.|✅|✅|✅|✅|✅|❌|❌|❌|✅|❌|❌|
Require loading `<iframe>` lazily|Require `loading=lazy` with `<iframe>` to avoid render-blocking that causes loading if its element is out of the viewport.|✅|✅|✅|✅|✅|❌|❌|❌|✅|❌|❌|
Allow `property` attr with `<meta>`|Be able to use **Open-Graph** etc.|✅|✅|✅|✅|✅|❌|❌|❌|❌|✅|❌|
No hard coding **ID**|The component that hard-coded ID cannot mount to an app duplicately because the IDs must be unique in a document. Recommend to specify dynamic IDs to avoid doing that.|❌|✅|✅|❌|✅|❌|❌|❌|❌|❌|❌|
No omit **end-tag**|Recommend to write an end-tag always because it is too difficult for a human decide an element is end-tag omittable.|❌|❌|❌|✅|❌|❌|❌|❌|❌|❌|❌|
Require `noreferrer` with `target=_blank`|Require `rel=noreferrer` with an element that has `target=_blank` to prevent leaking referrer information and to block operating referrer documents.|✅|✅|✅|✅|✅|❌|❌|❌|❌|❌|✅|

## Install

`markuplint` package includes this package.

If you are installing purposely, how below:

```sh
$ npm install @markuplint/config-presets

$ yarn add @markuplint/config-presets
```