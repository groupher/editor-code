import Selectr from "mobius1-selectr";

const ICON_ASSETS = 'https://cps-oss.oss-cn-shanghai.aliyuncs.com/icons/pl/'

const LANGUAGES = [
  "javascript",
  "elixir",
  "swift",
  "typescript",
  "go",
  "ruby",
  "python",
  "rust",
  "swift",
  "dart",
  "scala",
  "haskell",
  "ocaml",
  "php",
  "clojure",
  "perl",
  "delphi",
  "elm",
  "erlang",
  "fsharp",
  "gradle",
  "groovy",
  "julia",
  "kotlin",
  "lisp",
  "lua",
  "r",
  "racket",
  "red",
  "reason",
  "c",
  "java",
  "csharp",
  "cpp",
]

let options = []

// TODO:  将当前选中的那一项放在最顶上
export const getLangOptions = () => {
  if (options.length !== 0) return options

  LANGUAGES.forEach(lang => {
    options.push({
      value: lang,
      title: lang,
      icon: ICON_ASSETS + lang + '.png'
    })
  })

  return options
}

/**
 * init the selectr plugin
 * @private
 * @param {{title: string, value: string, icon: string}}
 *   title — lang title display in select option
 *   value - lang's actual value
 *   icon - lang icon
 * @returns {boolean}
 */
// see https://github.com/Mobius1/Selectr/wiki/Options#renderoption for details 
const renderOption = (option) => {
  const template = [
    "<div class='selectr-lang-template'><img src='", option.dataset.src, "'><span>",
    option.textContent,
    "</span></div>"
  ];

  return template.join('');
}

/**
 * init the selectr plugin
 * @public
 * @param {HTMLDivElement} el - element to save
 * @param {String} activeLabel - active language label
 * @param {func} onChange - label change callback
 * @returns {boolean}
 */
export const initSelector = (el, activeLabel = 'javascript', onChange) => {
  return new Selectr(el, {
    renderOption: renderOption,
    messages: {
      noResults: "未找到该标签",
    },
  }).on('selectr.init', function () {
    this.setValue(activeLabel)
    console.log('init: ', this)

    this.input.placeholder = activeLabel
    this.input.addEventListener('blur', () => this.close())
    this.label.addEventListener('DOMSubtreeModified', ({ target: { innerText } }) => {
      if (innerText) {
        this.input.placeholder = innerText
        if (onChange) onChange(innerText)
      }
    })
  })
  // .on('selectr.open', function () {
  //   this.input.placeholder = 'javascript'

  //   this.input.addEventListener('blur', () => {
  //     console.log('blur')
  //     this.close()
  //   })
  // })
}