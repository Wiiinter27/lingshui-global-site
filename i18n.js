(function () {
  'use strict';
  var dictionaries = window.LINGSHUI_LOCALES || {};
  var supported = ['zh-CN', 'en', 'fr', 'ru', 'es'];
  var language = 'zh-CN';
  var textSources = new WeakMap();
  var attributeSources = new WeakMap();
  var attributes = ['alt', 'aria-label', 'title', 'placeholder'];
  var selector = document.getElementById('language-select');
  var status = document.getElementById('language-status');
  var observer;
  var formats = {
    'zh-CN': { count: '共 {n} 张', question: '第 {n} / {total} 题', place: '推荐去看看：{place}', answer: '{status}正确答案：{answer}。{explanation}', changed: '已切换为简体中文。' },
    en: { count: '{n} photos', question: 'Question {n} / {total}', place: 'Recommended place: {place}', answer: '{status} Correct answer: {answer}. {explanation}', changed: 'Language changed to English.' },
    fr: { count: '{n} photos', question: 'Question {n} / {total}', place: 'Lieu conseillé : {place}', answer: '{status} Bonne réponse : {answer}. {explanation}', changed: 'La langue est maintenant le français.' },
    ru: { count: '{n} фото', question: 'Вопрос {n} / {total}', place: 'Рекомендуемое место: {place}', answer: '{status} Правильный ответ: {answer}. {explanation}', changed: 'Выбран русский язык.' },
    es: { count: '{n} fotos', question: 'Pregunta {n} / {total}', place: 'Lugar recomendado: {place}', answer: '{status} Respuesta correcta: {answer}. {explanation}', changed: 'El idioma se ha cambiado a español.' }
  };

  function format(key, values) {
    return formats[language][key].replace(/\{(\w+)\}/g, function (_, name) { return values[name]; });
  }

  function translate(source) {
    if (language === 'zh-CN') return source;
    var dictionary = dictionaries[language] || {};
    if (Object.prototype.hasOwnProperty.call(dictionary, source)) return dictionary[source];
    // These are the only composed strings emitted by the original interactions.
    var match = source.match(/^共 (\d+) 张$/);
    if (match) return format('count', { n: match[1] });
    match = source.match(/^第 (\d+) \/ (\d+) 题$/);
    if (match) return format('question', { n: match[1], total: match[2] });
    match = source.match(/^推荐去看看：(.+)$/);
    if (match) return format('place', { place: translate(match[1]) });
    match = source.match(/^(答对了。|时间到。|这题答错了。)正确答案：(.+?)。(.+)$/);
    if (match) return format('answer', { status: translate(match[1]), answer: translate(match[2]), explanation: translate(match[3]) });
    return source;
  }

  function ignored(element) {
    return !element || element.closest('script, style, noscript, [translate="no"], #language-status');
  }

  function translateText(node) {
    if (ignored(node.parentElement)) return;
    var current = node.nodeValue;
    var saved = textSources.get(node);
    // Retain source text across switches, but accept content changed by a quiz or counter.
    if (!saved || (current !== saved.rendered && current !== saved.source)) {
      saved = { source: current, rendered: current };
      textSources.set(node, saved);
    }
    var core = saved.source.trim();
    if (!core) return;
    var translated = translate(core);
    var next = saved.source.replace(core, function () { return translated; });
    saved.rendered = next;
    if (current !== next) node.nodeValue = next;
  }

  function translateAttributes(element) {
    if (ignored(element)) return;
    var saved = attributeSources.get(element);
    if (!saved) { saved = {}; attributeSources.set(element, saved); }
    var names = attributes.slice();
    if (element.matches('meta[name="description"]')) names.push('content');
    names.forEach(function (name) {
      if (!element.hasAttribute(name)) return;
      var current = element.getAttribute(name);
      var entry = saved[name];
      if (!entry || (current !== entry.rendered && current !== entry.source)) entry = saved[name] = { source: current };
      entry.rendered = translate(entry.source);
      if (current !== entry.rendered) element.setAttribute(name, entry.rendered);
    });
  }

  function translateTree(root) {
    if (root.nodeType === 3) { translateText(root); return; }
    if (root.nodeType === 1) translateAttributes(root);
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    var node;
    while ((node = walker.nextNode())) {
      if (node.nodeType === 3) translateText(node);
      else translateAttributes(node);
    }
  }

  function observe() {
    observer.observe(document.documentElement, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: attributes.concat('content') });
  }

  function setLanguage(next, announce) {
    if (supported.indexOf(next) < 0) return;
    language = next;
    if (observer) observer.disconnect();
    document.documentElement.lang = next;
    selector.value = next;
    translateTree(document.documentElement);
    try { localStorage.setItem('lingshui-language', next); } catch (_) { /* Storage may be disabled. */ }
    if (announce) {
      try {
        var url = new URL(window.location.href);
        url.searchParams.set('lang', next);
        history.replaceState(null, '', url);
      } catch (_) { /* Direct file previews may restrict history access. */ }
      status.textContent = formats[next].changed;
    }
    if (observer) observe();
  }

  try {
    var requested = new URLSearchParams(location.search).get('lang');
    var stored = localStorage.getItem('lingshui-language');
    if (supported.indexOf(requested) >= 0) language = requested;
    else if (supported.indexOf(stored) >= 0) language = stored;
  } catch (_) { /* Default to Chinese when browser storage is unavailable. */ }

  setLanguage(language, false);
  selector.addEventListener('change', function () { setLanguage(selector.value, true); });
  observer = new MutationObserver(function (records) {
    // Disconnect while translating so our own updates cannot cause an observation loop.
    observer.disconnect();
    records.forEach(function (record) {
      if (record.type === 'characterData') translateText(record.target);
      else if (record.type === 'attributes') translateAttributes(record.target);
      else Array.prototype.forEach.call(record.addedNodes, translateTree);
    });
    observe();
  });
  observe();
})();
