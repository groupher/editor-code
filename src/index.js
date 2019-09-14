/**
 * Build styles
 */
require('./index.css').toString()

const Prism = require('prismjs');

/**
 * @class Code
 * @classdesc Code Tool for Editor.js
 * @property {CodeData} data - Tool`s input and output data
 * @propert {object} api - Editor.js API instance
 *
 * @typedef {object} CodeData
 * @description Code Tool`s input and output data
 * @property {string} text - code`s text
 * @property {'center'|'left'} alignment - code`s alignment
 *
 * @typedef {object} CodeConfig
 * @description Code Tool`s initial configuration
 * @property {'center'|'left'} defaultAlignment - alignment to use as default
 */
class Code {
  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   *
   * @return {{icon: string, title: string}}
   */
  static get toolbox() {
    return {
      icon: `<svg width="14" height="14" viewBox="0 -1 14 14" xmlns="http://www.w3.org/2000/svg" > <path d="M3.177 6.852c.205.253.347.572.427.954.078.372.117.844.117 1.417 0 .418.01.725.03.92.02.18.057.314.107.396.046.075.093.117.14.134.075.027.218.056.42.083a.855.855 0 0 1 .56.297c.145.167.215.38.215.636 0 .612-.432.934-1.216.934-.457 0-.87-.087-1.233-.262a1.995 1.995 0 0 1-.853-.751 2.09 2.09 0 0 1-.305-1.097c-.014-.648-.029-1.168-.043-1.56-.013-.383-.034-.631-.06-.733-.064-.263-.158-.455-.276-.578a2.163 2.163 0 0 0-.505-.376c-.238-.134-.41-.256-.519-.371C.058 6.76 0 6.567 0 6.315c0-.37.166-.657.493-.846.329-.186.56-.342.693-.466a.942.942 0 0 0 .26-.447c.056-.2.088-.42.097-.658.01-.25.024-.85.043-1.802.015-.629.239-1.14.672-1.522C2.691.19 3.268 0 3.977 0c.783 0 1.216.317 1.216.921 0 .264-.069.48-.211.643a.858.858 0 0 1-.563.29c-.249.03-.417.076-.498.126-.062.04-.112.134-.139.291-.031.187-.052.562-.061 1.119a8.828 8.828 0 0 1-.112 1.378 2.24 2.24 0 0 1-.404.963c-.159.212-.373.406-.64.583.25.163.454.342.612.538zm7.34 0c.157-.196.362-.375.612-.538a2.544 2.544 0 0 1-.641-.583 2.24 2.24 0 0 1-.404-.963 8.828 8.828 0 0 1-.112-1.378c-.009-.557-.03-.932-.061-1.119-.027-.157-.077-.251-.14-.29-.08-.051-.248-.096-.496-.127a.858.858 0 0 1-.564-.29C8.57 1.401 8.5 1.185 8.5.921 8.5.317 8.933 0 9.716 0c.71 0 1.286.19 1.72.574.432.382.656.893.671 1.522.02.952.033 1.553.043 1.802.009.238.041.458.097.658a.942.942 0 0 0 .26.447c.133.124.364.28.693.466a.926.926 0 0 1 .493.846c0 .252-.058.446-.183.58-.109.115-.281.237-.52.371-.21.118-.377.244-.504.376-.118.123-.212.315-.277.578-.025.102-.045.35-.06.733-.013.392-.027.912-.042 1.56a2.09 2.09 0 0 1-.305 1.097c-.2.323-.486.574-.853.75a2.811 2.811 0 0 1-1.233.263c-.784 0-1.216-.322-1.216-.934 0-.256.07-.47.214-.636a.855.855 0 0 1 .562-.297c.201-.027.344-.056.418-.083.048-.017.096-.06.14-.134a.996.996 0 0 0 .107-.396c.02-.195.031-.502.031-.92 0-.573.039-1.045.117-1.417.08-.382.222-.701.427-.954z" /> </svg>`,
      title: 'Code',
    }
  }

  /**
   * Empty Code is not empty Block
   * @public
   * @returns {boolean}
   */
  static get contentless() {
    return true
  }

  /**
   * Allow to press Enter inside the Code
   * @public
   * @returns {boolean}
   */
  static get enableLineBreaks() {
    return true
  }

  /**
   * Tool`s styles
   *
   * @returns {{baseClass: string, wrapper: string, code: string, input: string, settingsButton: string, settingsButtonActive: string}}
   */
  get CSS() {
    return {
      baseClass: this.api.styles.block,
      wrapper: 'cdx-code',
      text: 'cdx-code__text',
      langClass: 'language-' + this.data.lang,
      input: 'cdx-code__input', // this.api.styles.input,
      langInput: 'cdx-code-lang_input',
      settingsWrapper: 'cdx-code-settings',
      settingsButton: this.api.styles.settingsButton,
      settingsButtonActive: this.api.styles.settingsButtonActive,
    }
  }

  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {{data: CodeData, config: CodeConfig, api: object}}
   *   data — previously saved data
   *   config - user config for Tool
   *   api - Editor.js API
   */
  constructor({ data, config, api }) {
    this.api = api

    this.data = {
      text: data.text || '',
      lang: data.lang || 'text',
    }

    this.langInputEl = this._make('input', [this.CSS.langInput], {
      id: 'lang-input',
      value: this.data.lang,
    })
    this.highlightCodeSyntax()
  }

  highlightCodeSyntax() {
    console.log('inside highlightCodeSyntax.....')
    Prism.highlightAll()
    // const isClientSide = typeof window !== 'undefined'

    // if(isClientSide && window.Prism) {
    //   console.log("Prism highlightAll .. .")
    //   Prism.highlightAll()
    // }
  }
  /**
   * Create Code Tool container with language input
   *
   * @returns {Element}
   */
  render() {
    const container = this._make(
      'code',
      [this.CSS.baseClass, this.CSS.wrapper, this.CSS.langClass],
      {
        contentEditable: true,
      }
    )
    const innerHTML = this.data.text.replace(/ /g, '&nbsp;')

    const code = this._make('div', [this.CSS.input, this.CSS.text], {
      innerHTML,
    })

    container.appendChild(code)

    this.langInputEl.addEventListener('blur', ({ target: { value } }) => {
      const oldLangClass = 'language-' + this.data.lang
      const newLangClass = 'language-' + value

      container.classList.remove(oldLangClass)
      container.classList.add(newLangClass)

      this.data = { lang: value }
      console.log(' TODO:  hilight prism')
      this.api.toolbar.close()
    })

    return container
  }

  /**
   * Extract Code data from Code Tool element
   *
   * @param {HTMLDivElement} codeElement - element to save
   * @returns {CodeData}
   */
  save(codeElement) {
    // console.log('stringify version: ', JSON.stringify(codeElement.innerText));
    this.highlightCodeSyntax()
    return Object.assign(this.data, {
      text: codeElement.innerText,
    })
  }

  /**
   * Sanitizer rules
   */
  static get sanitize() {
    return {
      /* text: { */
      /* br: false, */
      /* }, */
      /* alignment: {}, */
    }
  }

  /**
   * Create wrapper for Tool`s language selection:
   * 1. Left alignment
   * 2. Center alignment
   *
   * @returns {HTMLDivElement}
   */
  renderSettings() {
    const wrapper = this._make('div', [this.CSS.settingsWrapper], {})

    wrapper.appendChild(this.langInputEl)

    return wrapper
  }

  /**
   * Helper for making Elements with attributes
   *
   * @param  {string} tagName           - new Element tag name
   * @param  {array|string} classNames  - list or name of CSS classname(s)
   * @param  {Object} attributes        - any attributes
   * @return {Element}
   */
  _make(tagName, classNames = null, attributes = {}) {
    let el = document.createElement(tagName)

    if (Array.isArray(classNames)) {
      el.classList.add(...classNames)
    } else if (classNames) {
      el.classList.add(classNames)
    }

    for (let attrName in attributes) {
      el[attrName] = attributes[attrName]
    }

    return el
  }
}
module.exports = Code
