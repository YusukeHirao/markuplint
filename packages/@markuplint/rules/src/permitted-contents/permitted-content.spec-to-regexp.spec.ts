import type { NamespaceURI } from '@markuplint/ml-ast';

import specs from '@markuplint/html-spec';
import { getSpecByTagName } from '@markuplint/ml-spec';

import ExpGenerator from './permitted-content.spec-to-regexp';

function h(localName: string, namespace: NamespaceURI = 'http://www.w3.org/1999/xhtml') {
	return getSpecByTagName(specs, localName, namespace);
}

function expGen() {
	return new ExpGenerator(specs, 0);
}

test('empty', () => {
	expect(expGen().specToRegExp([]).source).toEqual('^$');
});

test('ordered required', () => {
	expect(
		expGen().specToRegExp([
			{
				require: 'a',
			},
			{
				require: 'b',
			},
			{
				require: 'c',
			},
		]).source,
	).toEqual('^<a><b><c>$');
});

test('ordered optional', () => {
	expect(
		expGen().specToRegExp([
			{
				optional: 'a',
			},
			{
				optional: 'b',
			},
			{
				optional: 'c',
			},
		]).source,
	).toEqual('^(?:<a>)?(?:<b>)?(?:<c>)?$');
});

test('ordered zeroOrMore', () => {
	expect(
		expGen().specToRegExp([
			{
				zeroOrMore: 'a',
			},
			{
				zeroOrMore: 'b',
			},
			{
				zeroOrMore: 'c',
			},
		]).source,
	).toEqual('^(?:<a>)*(?:<b>)*(?:<c>)*$');
});

test('ordered oneOrMore', () => {
	expect(
		expGen().specToRegExp([
			{
				oneOrMore: 'a',
			},
			{
				oneOrMore: 'b',
			},
			{
				oneOrMore: 'c',
			},
		]).source,
	).toEqual('^(?:<a>)+(?:<b>)+(?:<c>)+$');
});

test('ordered mixed', () => {
	expect(
		expGen().specToRegExp([
			{
				oneOrMore: 'a',
			},
			{
				require: 'b',
			},
			{
				zeroOrMore: 'c',
			},
			{
				optional: 'd',
			},
			{
				require: 'e',
				min: 3,
			},
			{
				require: 'f',
				min: 3,
				max: 10,
			},
			{
				require: 'g',
				max: 5,
			},
		]).source,
	).toEqual('^(?:<a>)+<b>(?:<c>)*(?:<d>)?(?:<e>){3,3}(?:<f>){3,10}(?:<g>){1,5}$');
});

test('choice required', () => {
	expect(
		expGen().specToRegExp([
			{
				choice: [
					[
						{
							require: 'a',
						},
					],
					[
						{
							require: 'b',
						},
					],
					[
						{
							require: 'c',
						},
					],
				],
			},
		]).source,
	).toEqual('^(?:<a>|<b>|<c>)$');
});

test('choice required', () => {
	expect(
		expGen().specToRegExp([
			{
				require: ['a', 'b', 'c'],
			},
		]).source,
	).toEqual('^(?:<a>|<b>|<c>)$');
});

test('interleave required', () => {
	expect(
		expGen().specToRegExp([
			{
				interleave: [
					[
						{
							require: 'a',
						},
					],
					[
						{
							require: 'b',
						},
					],
					[
						{
							require: 'c',
						},
					],
				],
			},
		]).source,
	).toEqual('^(?:<a><b><c>|<a><c><b>|<b><a><c>|<b><c><a>|<c><a><b>|<c><b><a>)$');
});

test('ignore', () => {
	expect(
		expGen().specToRegExp([
			{
				require: ['a', 'b', 'c'],
				ignore: 'a',
			},
		]).source,
	).toEqual('^(?:<b>|<c>)$');
});

test('group oneOrMore', () => {
	expect(
		expGen().specToRegExp([
			{
				oneOrMore: [
					{
						require: 'a',
					},
					{
						require: 'b',
					},
				],
			},
		]).source,
	).toEqual('^(?:<a><b>)+$');
});

test('content model alias', () => {
	expect(
		expGen().specToRegExp([
			{
				require: '#flow',
			},
		]).source,
	).toEqual(
		'^(?:(?:<[a-z](?:\\-|\\.|[0-9]|_|[a-z]|\u00B7|[\u00C0-\u00D6]|[\u00D8-\u00F6]|[\u00F8-\u037D]|[\u037F-\u1FFF]|[\u200C-\u200D]|[\u203F-\u2040]|[\u2070-\u218F]|[\u2C00-\u2FEF]|[\u3001-\uD7FF]|[\uF900-\uFDCF]|[\uFDF0-\uFFFD]|[\uD800-\uDBFF][\uDC00-\uDFFF])*\\-(?:\\-|\\.|[0-9]|_|[a-z]|\u00B7|[\u00C0-\u00D6]|[\u00D8-\u00F6]|[\u00F8-\u037D]|[\u037F-\u1FFF]|[\u200C-\u200D]|[\u203F-\u2040]|[\u2070-\u218F]|[\u2C00-\u2FEF]|[\u3001-\uD7FF]|[\uF900-\uFDCF]|[\uFDF0-\uFFFD]|[\uD800-\uDBFF][\uDC00-\uDFFF])*>)|<#text>|<a>|<abbr>|<address>|<area>|<article>|<aside>|<audio>|<b>|<bdi>|<bdo>|<blockquote>|<br>|<button>|<canvas>|<cite>|<code>|<data>|<datalist>|<del>|<details>|<dfn>|<dialog>|<div>|<dl>|<em>|<embed>|<fieldset>|<figure>|<footer>|<form>|<h1>|<h2>|<h3>|<h4>|<h5>|<h6>|<header>|<hgroup>|<hr>|<i>|<iframe>|<img>|<input>|<ins>|<kbd>|<label>|(?<ACM_00_flow_link><link>)|<main>|<map>|<mark>|<math>|<menu>|(?<ACM_00_flow_meta><meta>)|<meter>|<nav>|<noscript>|<object>|<ol>|<output>|<p>|<picture>|<pre>|<progress>|<q>|<ruby>|<s>|<samp>|<script>|<section>|<select>|<slot>|<small>|<span>|<strong>|<sub>|<sup>|<svg:svg>|<table>|<template>|<textarea>|<time>|<u>|<ul>|<var>|<video>|<wbr>)$',
	);
});

test('content model alias', () => {
	expect(
		expGen().specToRegExp([
			{
				require: ['a', '#flow'],
			},
		]).source,
	).toEqual(
		'^(?:<a>|(?:<[a-z](?:\\-|\\.|[0-9]|_|[a-z]|\u00B7|[\u00C0-\u00D6]|[\u00D8-\u00F6]|[\u00F8-\u037D]|[\u037F-\u1FFF]|[\u200C-\u200D]|[\u203F-\u2040]|[\u2070-\u218F]|[\u2C00-\u2FEF]|[\u3001-\uD7FF]|[\uF900-\uFDCF]|[\uFDF0-\uFFFD]|[\uD800-\uDBFF][\uDC00-\uDFFF])*\\-(?:\\-|\\.|[0-9]|_|[a-z]|\u00B7|[\u00C0-\u00D6]|[\u00D8-\u00F6]|[\u00F8-\u037D]|[\u037F-\u1FFF]|[\u200C-\u200D]|[\u203F-\u2040]|[\u2070-\u218F]|[\u2C00-\u2FEF]|[\u3001-\uD7FF]|[\uF900-\uFDCF]|[\uFDF0-\uFFFD]|[\uD800-\uDBFF][\uDC00-\uDFFF])*>)|<#text>|<abbr>|<address>|<area>|<article>|<aside>|<audio>|<b>|<bdi>|<bdo>|<blockquote>|<br>|<button>|<canvas>|<cite>|<code>|<data>|<datalist>|<del>|<details>|<dfn>|<dialog>|<div>|<dl>|<em>|<embed>|<fieldset>|<figure>|<footer>|<form>|<h1>|<h2>|<h3>|<h4>|<h5>|<h6>|<header>|<hgroup>|<hr>|<i>|<iframe>|<img>|<input>|<ins>|<kbd>|<label>|(?<ACM_00_flow_link><link>)|<main>|<map>|<mark>|<math>|<menu>|(?<ACM_00_flow_meta><meta>)|<meter>|<nav>|<noscript>|<object>|<ol>|<output>|<p>|<picture>|<pre>|<progress>|<q>|<ruby>|<s>|<samp>|<script>|<section>|<select>|<slot>|<small>|<span>|<strong>|<sub>|<sup>|<svg:svg>|<table>|<template>|<textarea>|<time>|<u>|<ul>|<var>|<video>|<wbr>)$',
	);
});

test('content model alias', () => {
	expect(
		expGen().specToRegExp([
			{
				require: '#transparent',
			},
		]).source,
	).toEqual('^(?<TRANSPARENT_00>(?:<[^>]+>)?)$');
});

test('a', () => {
	expect(expGen().specToRegExp(h('a')!.contentModel.contents).source).toEqual(
		'^(?<NAD_00__interactive___InTRANSPARENT>(?:(?<TRANSPARENT_01>(?:<[^>]+>)?))*)$',
	);
});

test('audio', () => {
	expect(expGen().specToRegExp(h('audio')!.contentModel.contents).source).toEqual(
		'^(?<NAD_00_audio_video___InTRANSPARENT>(?:<source>)*(?:<track>)*(?:(?<TRANSPARENT_01>(?:<[^>]+>)?))*)$',
	);
});

test('head', () => {
	expect(expGen().specToRegExp(h('head')!.contentModel.contents).source).toEqual(
		'^(?:<base>|<link>|<meta>|<noscript>|<script>|<style>|<template>)*<title>(?:<base>|<link>|<meta>|<noscript>|<script>|<style>|<template>)*$',
	);
});

test('picture', () => {
	expect(expGen().specToRegExp(h('picture')!.contentModel.contents).source).toEqual(
		'^(?:<script>|<template>)*(?:<source>)*(?:<script>|<template>)*<img>(?:<script>|<template>)*$',
	);
});

test('ruby', () => {
	expect(expGen().specToRegExp(h('ruby')!.contentModel.contents).source).toEqual(
		'^(?<NAD_01_ruby>(?:(?:<[a-z](?:\\-|\\.|[0-9]|_|[a-z]|\u00B7|[\u00C0-\u00D6]|[\u00D8-\u00F6]|[\u00F8-\u037D]|[\u037F-\u1FFF]|[\u200C-\u200D]|[\u203F-\u2040]|[\u2070-\u218F]|[\u2C00-\u2FEF]|[\u3001-\uD7FF]|[\uF900-\uFDCF]|[\uFDF0-\uFFFD]|[\uD800-\uDBFF][\uDC00-\uDFFF])*\\-(?:\\-|\\.|[0-9]|_|[a-z]|\u00B7|[\u00C0-\u00D6]|[\u00D8-\u00F6]|[\u00F8-\u037D]|[\u037F-\u1FFF]|[\u200C-\u200D]|[\u203F-\u2040]|[\u2070-\u218F]|[\u2C00-\u2FEF]|[\u3001-\uD7FF]|[\uF900-\uFDCF]|[\uFDF0-\uFFFD]|[\uD800-\uDBFF][\uDC00-\uDFFF])*>)|<#text>|<a>|<abbr>|<area>|<audio>|<b>|<bdi>|<bdo>|<br>|<button>|<canvas>|<cite>|<code>|<data>|<datalist>|<del>|<dfn>|<em>|<embed>|<i>|<iframe>|<img>|<input>|<ins>|<kbd>|<label>|(?<ACM_00_phrasing_link><link>)|<map>|<mark>|<math>|(?<ACM_00_phrasing_meta><meta>)|<meter>|<noscript>|<object>|<output>|<picture>|<progress>|<q>|<ruby>|<s>|<samp>|<script>|<select>|<slot>|<small>|<span>|<strong>|<sub>|<sup>|<svg:svg>|<template>|<textarea>|<time>|<u>|<var>|<video>|<wbr>)(?:(?:<rt>)+|(?:<rp>(?:<rt><rp>)+)+))+$',
	);
});

test('select', () => {
	expect(expGen().specToRegExp(h('select')!.contentModel.contents).source).toEqual('^(?:<option>|<optgroup>)*$');
});

test('summary', () => {
	expect(expGen().specToRegExp(h('summary')!.contentModel.contents).source).toEqual(
		'^(?:(?:(?:<[a-z](?:\\-|\\.|[0-9]|_|[a-z]|\u00B7|[\u00C0-\u00D6]|[\u00D8-\u00F6]|[\u00F8-\u037D]|[\u037F-\u1FFF]|[\u200C-\u200D]|[\u203F-\u2040]|[\u2070-\u218F]|[\u2C00-\u2FEF]|[\u3001-\uD7FF]|[\uF900-\uFDCF]|[\uFDF0-\uFFFD]|[\uD800-\uDBFF][\uDC00-\uDFFF])*\\-(?:\\-|\\.|[0-9]|_|[a-z]|\u00B7|[\u00C0-\u00D6]|[\u00D8-\u00F6]|[\u00F8-\u037D]|[\u037F-\u1FFF]|[\u200C-\u200D]|[\u203F-\u2040]|[\u2070-\u218F]|[\u2C00-\u2FEF]|[\u3001-\uD7FF]|[\uF900-\uFDCF]|[\uFDF0-\uFFFD]|[\uD800-\uDBFF][\uDC00-\uDFFF])*>)|<#text>|<a>|<abbr>|<area>|<audio>|<b>|<bdi>|<bdo>|<br>|<button>|<canvas>|<cite>|<code>|<data>|<datalist>|<del>|<dfn>|<em>|<embed>|<i>|<iframe>|<img>|<input>|<ins>|<kbd>|<label>|(?<ACM_00_phrasing_link><link>)|<map>|<mark>|<math>|(?<ACM_00_phrasing_meta><meta>)|<meter>|<noscript>|<object>|<output>|<picture>|<progress>|<q>|<ruby>|<s>|<samp>|<script>|<select>|<slot>|<small>|<span>|<strong>|<sub>|<sup>|<svg:svg>|<template>|<textarea>|<time>|<u>|<var>|<video>|<wbr>)*|(?:<h1>|<h2>|<h3>|<h4>|<h5>|<h6>|<hgroup>))$',
	);
});

test('table', () => {
	expect(expGen().specToRegExp(h('table')!.contentModel.contents).source).toEqual(
		'^(?:<script>|<template>)*(?:<caption>)?(?:<script>|<template>)*(?:<colgroup>)*(?:<script>|<template>)*(?:<thead>)?(?:<script>|<template>)*(?:(?:<tbody>)*|(?:<tr>)+)(?:<script>|<template>)*(?:<tfoot>)?(?:<script>|<template>)*$',
	);
});

test('audio in audio / Duplicate capture group name', () => {
	const expGen = new ExpGenerator(specs, 0);
	expect(
		expGen.specToRegExp(h('audio')!.contentModel.contents, expGen.specToRegExp(h('audio')!.contentModel.contents))
			.source,
	).toEqual(
		'^(?<NAD_02_audio_video___InTRANSPARENT>(?:<source>)*(?:<track>)*(?:(?<TRANSPARENT_03>(?<NAD_00_audio_video___InTRANSPARENT>(?:<source>)*(?:<track>)*(?:(?<TRANSPARENT_01>(?:<[^>]+>)?))*)))*)$',
	);
});

test('svg', () => {
	expect(expGen().specToRegExp(h('svg', 'http://www.w3.org/2000/svg')!.contentModel.contents).source).toEqual(
		'^(?:<svg:animate>|<svg:animateColor>|<svg:animateMotion>|<svg:animateTransform>|<svg:discard>|<svg:mpath>|<svg:set>|<svg:desc>|<svg:metadata>|<svg:title>|<svg:linearGradient>|<svg:pattern>|<svg:radialGradient>|<svg:solidcolor>|<svg:circle>|<svg:ellipse>|<svg:line>|<svg:path>|<svg:polygon>|<svg:polyline>|<svg:rect>|<svg:defs>|<svg:g>|<svg:svg>|<svg:symbol>|<svg:use>|<svg:a>|<svg:clipPath>|<svg:filter>|<svg:foreignObject>|<svg:image>|<svg:marker>|<svg:mask>|<svg:script>|<svg:style>|<svg:switch>|<svg:text>|<svg:view>)*$',
	);
});
