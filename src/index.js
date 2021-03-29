import copyToClipboard from "copy-to-clipboard";
import { make, loadJS } from "@groupher/editor-utils";

/**
 * Build styles
 */
import "./index.css";
import "./lang_selector.css";
import "./tabber.css";

import { getLangOptions, initSelector } from "./lang_selector";
import Tabber from "./tabber";

import CopyIcon from "./icon/copy.svg";
import TabIcon from "./icon/tab.svg";
import LinenoIcon from "./icon/lineno.svg";

const scripts = {
  prism:
    "https://cdn.jsdelivr.net/npm/prismjs@1.17.1/components/prism-core.min.js",
  prismAutoloader:
    "https://cdn.jsdelivr.net/npm/prismjs@1.17.1/plugins/autoloader/prism-autoloader.min.js",
};

/**
 * @class Code
 * @classdesc Code Tool for Editor.js
 * @property {CodeData} data - Tool`s input and output data
 * @propert {object} api - Editor.js API instance
 *
 * @typedef {object} CodeData
 * @description Code Tool`s input and output data
 * @property {number} index - code index
 * @property {string} content - code snippet
 * @property {string} lang - code lang
 *
 * @typedef {object} CodeConfig
 * @description Code Tool`s initial configuration
 * @property {'center'|'left'} defaultAlignment - alignment to use as default
 */
export default class Code {
  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {{data: CodeData, config: CodeConfig, api: object}}
   *   data — previously saved data
   *   config - user config for Tool
   *   api - Editor.js API
   */
  constructor({ data, config, api }) {
    this.api = api;
    this.i18n = config.i18n || "en";

    this.element = null;
    this.codeContainer = null;
    this.langSelector = null;
    this.tabberEl = null;

    console.log("the fucking data: ", data);
    this.data = data;

    loadJS(scripts.prism, this.prismOnload.bind(this), document.body);
    loadJS(scripts.prismAutoloader, null, document.body);

    this.isTabMode = this.data.length > 1;

    this.settings = [
      {
        title: "增加标签页",
        icon: TabIcon,
        type: "warning",
      },
      {
        title: "显示行号",
        icon: LinenoIcon,
        type: "error",
      },
    ];

    this.tabber = new Tabber({
      api,
      config,
      data,
      switchTab: this.switchTab.bind(this),
      removeTab: this.removeTab.bind(this),
    });
  }

  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   *
   * @return {{icon: string, title: string}}
   */
  static get toolbox() {
    return {
      icon: `<svg width="16" height="16" viewBox="0 -1 14 14" xmlns="http://www.w3.org/2000/svg" > <path d="M3.177 6.852c.205.253.347.572.427.954.078.372.117.844.117 1.417 0 .418.01.725.03.92.02.18.057.314.107.396.046.075.093.117.14.134.075.027.218.056.42.083a.855.855 0 0 1 .56.297c.145.167.215.38.215.636 0 .612-.432.934-1.216.934-.457 0-.87-.087-1.233-.262a1.995 1.995 0 0 1-.853-.751 2.09 2.09 0 0 1-.305-1.097c-.014-.648-.029-1.168-.043-1.56-.013-.383-.034-.631-.06-.733-.064-.263-.158-.455-.276-.578a2.163 2.163 0 0 0-.505-.376c-.238-.134-.41-.256-.519-.371C.058 6.76 0 6.567 0 6.315c0-.37.166-.657.493-.846.329-.186.56-.342.693-.466a.942.942 0 0 0 .26-.447c.056-.2.088-.42.097-.658.01-.25.024-.85.043-1.802.015-.629.239-1.14.672-1.522C2.691.19 3.268 0 3.977 0c.783 0 1.216.317 1.216.921 0 .264-.069.48-.211.643a.858.858 0 0 1-.563.29c-.249.03-.417.076-.498.126-.062.04-.112.134-.139.291-.031.187-.052.562-.061 1.119a8.828 8.828 0 0 1-.112 1.378 2.24 2.24 0 0 1-.404.963c-.159.212-.373.406-.64.583.25.163.454.342.612.538zm7.34 0c.157-.196.362-.375.612-.538a2.544 2.544 0 0 1-.641-.583 2.24 2.24 0 0 1-.404-.963 8.828 8.828 0 0 1-.112-1.378c-.009-.557-.03-.932-.061-1.119-.027-.157-.077-.251-.14-.29-.08-.051-.248-.096-.496-.127a.858.858 0 0 1-.564-.29C8.57 1.401 8.5 1.185 8.5.921 8.5.317 8.933 0 9.716 0c.71 0 1.286.19 1.72.574.432.382.656.893.671 1.522.02.952.033 1.553.043 1.802.009.238.041.458.097.658a.942.942 0 0 0 .26.447c.133.124.364.28.693.466a.926.926 0 0 1 .493.846c0 .252-.058.446-.183.58-.109.115-.281.237-.52.371-.21.118-.377.244-.504.376-.118.123-.212.315-.277.578-.025.102-.045.35-.06.733-.013.392-.027.912-.042 1.56a2.09 2.09 0 0 1-.305 1.097c-.2.323-.486.574-.853.75a2.811 2.811 0 0 1-1.233.263c-.784 0-1.216-.322-1.216-.934 0-.256.07-.47.214-.636a.855.855 0 0 1 .562-.297c.201-.027.344-.056.418-.083.048-.017.096-.06.14-.134a.996.996 0 0 0 .107-.396c.02-.195.031-.502.031-.92 0-.573.039-1.045.117-1.417.08-.382.222-.701.427-.954z" /> </svg>`,
      title: "代码块",
    };
  }

  /**
   * Empty Code is not empty Block
   * @public
   * @returns {boolean}
   */
  static get contentless() {
    return true;
  }

  /**
   * Allow to press Enter inside the Code
   * @public
   * @returns {boolean}
   */
  static get enableLineBreaks() {
    return true;
  }

  /**
   * Tool`s styles
   *
   * @returns {{block: string, wrapper: string, code: string, input: string, settingsButton: string, settingsButtonActive: string}}
   */
  get CSS() {
    return {
      block: this.api.styles.block,
      codeWrapper: "cdx-code-wrapper",
      contentWrapper: "cdx-code-content-wrapper",
      wrapper: "cdx-code",
      text: "cdx-code__text",
      langClass: `language-${this.data[0].lang}`,
      langLabel: "cdx-code-lang_label",
      copyLabel: "cdx-code-lang_copy",
      copySuccess: "cdx-code-lang_copy-success",
      cornerWrapper: "cdx-code-lang_corner_warpper",
      input: "cdx-code__input", // this.api.styles.input,

      // settings
      customSettingWrapper: "cdx-custom-setting-wrapper",
      settingsButton: "cdx-settings-button",
    };
  }

  /**
   * init prism config, highlight current code block
   *
   * @returns {void}
   * @private
   */
  prismOnload() {
    // see: https://github.com/PrismJS/prism/issues/832#issuecomment-300175499
    Prism.hooks.add("before-highlight", (env) => {
      env.code = env.element.innerText;
    });
    this.highlightCodeSyntax();
  }

  // find index in current langs array
  findIndex(array, targetIdx) {
    let index = -1;

    for (let i = 0; i < array.length; i += 1) {
      if (array[i].index === targetIdx) {
        index = i;
        break;
      }
    }

    return index;
  }

  /**
   * switch code block tab
   * only call it when there is more then one block
   *
   * @param {{ index: number, lang: string, content: string, active: bool }} data - code block info
   * @returns {void}
   * @private
   */
  switchTab(data) {
    const langArrayIndex = this.findIndex(this.data, data.index);
    this.tabber.moveIndicator(langArrayIndex);

    const curClass = this.codeContainer.classList.value;
    const classedWithLang = curClass.slice(0, curClass.indexOf("language-"));

    this.data.map((item) => (item.active = false));
    const curLang = this.data.filter((item) => item.index === data.index);
    curLang[0].active = true;

    this.codeContainer.innerText = curLang[0].content;
    this.codeContainer.classList = classedWithLang + " language-" + data.lang;
    this.langSelector.setValue(data.lang);
    this.highlightCodeSyntax();
  }

  /**
   * remove current code block tab
   * only call it when there is more then one block
   *
   * @param {{ index: number, lang: string, content: string, active: bool }} data - code block info
   * @returns {void}
   * @private
   */
  removeTab(data) {
    this.data = this.data.filter((item) => item.index !== data.index);

    if (this.data.length === 1) {
      this.isTabMode = false;
      this.data = { ...this.data[0] };
      this.element.removeChild(this.tabberEl);
      this.tabberEl = null;
    } else {
      this.reBuildTabs();
    }
  }

  /**
   * add a new tab with default shell syntax
   *
   * @returns {void}
   * @private
   */
  addTab() {
    if (!this.isTabMode) {
      this.data = [{ ...this.data, index: 0 }];
      this.isTabMode = true;
    }

    // index is grows in linear, but may not be one by one because the
    // remove/add action, so just add the current-max-index + 1 as the new index
    // index 是线性增长的，但是由于各种删除增加等操作，所以每次就以
    // 目前最大的 index + 1 作为新的 index

    const curIndexList = [];
    for (let i = 0; i < this.data.length; i += 1) {
      curIndexList.push(this.data[i].index);
    }

    const maxIndex = Math.max(...curIndexList);

    this.data.push({
      index: maxIndex + 1,
      lang: "shell",
      content: "",
    });

    this.reBuildTabs();
    this.api.toolbar.close();
  }

  /**
   * re-render the current tabs with new code info list
   *
   * @param {boolean} whether switch to first tab
   * @private
   */
  reBuildTabs(switchToFirstTab = true) {
    const newTabberEl = this.tabber.renderTabs(this.data);

    if (this.tabberEl) {
      this.element.replaceChild(newTabberEl, this.tabberEl);
    } else {
      // fist time when init tab not exist
      this.element.insertBefore(newTabberEl, this.element.childNodes[0]);
    }

    this.tabberEl = newTabberEl;

    if (switchToFirstTab) {
      this.switchTab(this.data[0]);
    }
  }

  /**
   * highlight code block when Prism plugin is valid
   *
   * @private
   */
  highlightCodeSyntax() {
    const element = this.codeContainer;

    if (element && Prism) {
      Prism.highlightElement(element);
    }
  }

  /**
   * Create Code Tool container with language selector
   *
   * @returns {Element}
   */
  render() {
    this.element = make("div", [this.CSS.block, this.CSS.codeWrapper]);
    this.contentWrapper = make("div", [this.CSS.contentWrapper]);

    const codeText = this.data[0].content;

    this.codeContainer = make("code", [this.CSS.wrapper, this.CSS.langClass], {
      contentEditable: true,
    });

    const codeContent = make("div", [this.CSS.input, this.CSS.text], {
      innerHTML: codeText,
    });

    const cornerWrapper = make("div", [this.CSS.cornerWrapper]);
    const langLabel = make("select", [this.CSS.langLabel], {});

    const copyLabel = make("div", [this.CSS.copyLabel], {
      innerHTML: CopyIcon,
    });

    cornerWrapper.appendChild(langLabel);
    cornerWrapper.appendChild(copyLabel);

    // TODO:  depands data structure
    if (this.isTabMode) {
      this.tabberEl = this.tabber.renderTabs(this.data);
      this.element.appendChild(this.tabberEl);
    }

    this.codeContainer.appendChild(codeContent);
    this.contentWrapper.appendChild(this.codeContainer);
    this.contentWrapper.appendChild(cornerWrapper);

    this.element.appendChild(this.contentWrapper);

    this.setupLangsOptions(langLabel);
    this.highlightCodeSyntax();

    copyLabel.addEventListener("click", () => this.handleCopyAction(copyLabel));

    this.codeContainer.addEventListener("blur", () =>
      this.highlightCodeSyntax()
    );

    // init selector after render element to dom
    setTimeout(() => {
      this.langSelector = initSelector(
        langLabel,
        "javascript",
        this.selectLabelOnChange.bind(this)
      );
    }, 100);

    return this.element;
  }

  /**
   * handle language syntax selector
   *
   * @param {string} label - selected option
   * @returns {void}
   * @private
   */
  selectLabelOnChange(label) {
    const activeTabs = this.data.filter((item) => item.active);
    if (activeTabs.length <= 0) return false;

    const activeTab = activeTabs[0];

    if (activeTab.lang !== label) {
      activeTab.lang = label;
      this.reBuildTabs(false);
      this.switchTab(activeTab);
    }
  }

  /**
   * load all options to select label
   *
   * @param {HTMLElement} el - copyLabel
   * @returns {void}
   * @private
   */
  setupLangsOptions(el) {
    const options = getLangOptions();

    options.forEach((option) => {
      const optionEl = make("option", null, {
        value: option.value,
        innerText: option.title,
      });

      optionEl.setAttribute("data-src", option.icon);
      el.appendChild(optionEl);
    });
  }

  /**
   * handle copy action
   *
   * @param {HTMLElement} el - copyLabel
   * @returns {void}
   * @private
   */
  handleCopyAction(el) {
    const content = this.codeContainer.innerText;

    copyToClipboard(content);

    el.innerHTML = "✔ 已复制";
    el.classList.add(this.CSS.copySuccess);

    setTimeout(() => {
      el.classList.remove(this.CSS.copySuccess);
      el.innerHTML = CopyIcon;
    }, 2000);
  }

  /**
   * Extract Code data from Code Tool element
   *
   * @param {HTMLDivElement} codeElement - element to save
   * @returns {CodeData}
   */
  save(codeElement) {
    return this.data;
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
    };
  }

  /**
   * Create wrapper for Tool`s language selection:
   * 1. Left alignment
   * 2. Center alignment
   *
   * @returns {HTMLDivElement}
   */
  renderSettings() {
    const Wrapper = make("DIV", [this.CSS.customSettingWrapper]);

    this.settings.forEach((item) => {
      const itemEl = make("div", [this.CSS.settingsButton], {
        title: item.title,
        innerHTML: item.icon,
      });

      /* if (this.data.type === item.type) this.highlightSettingIcon(itemEl) */
      /*  */

      itemEl.addEventListener("click", () => {
        this.addTab();
      });

      Wrapper.appendChild(itemEl);
    });

    return Wrapper;
  }
}
