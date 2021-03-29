import copyToClipboard from "copy-to-clipboard";
import { make, loadJS } from "@groupher/editor-utils";

/**
 * Build styles
 */
import "./style/index.css";

import { getLangOptions, initSelector } from "./lang_selector";
import Tabber from "./tabber";

import CodeIcon from "./icon/code.svg";
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
      icon: CodeIcon,
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
    this.element = make("div", [this.CSS.block, this.CSS.wrapper]);
    this.contentWrapper = make("div", [this.CSS.contentWrapper]);

    const codeText = this.data[0].content;

    this.codeContainer = make(
      "code",
      [this.CSS.codeWrapper, this.CSS.langClass],
      {
        contentEditable: true,
      }
    );

    const CodeContentEl = make("div", [this.CSS.input, this.CSS.text], {
      innerHTML: codeText,
    });

    const cornerWrapper = make("div", [this.CSS.cornerWrapper]);
    const LangLabelEl = make("select");

    const CopyLabelEl = make("div", [this.CSS.copyLabel], {
      innerHTML: CopyIcon,
    });

    cornerWrapper.appendChild(LangLabelEl);
    cornerWrapper.appendChild(CopyLabelEl);

    // TODO:  depands data structure
    if (this.isTabMode) {
      this.tabberEl = this.tabber.renderTabs(this.data);
      this.element.appendChild(this.tabberEl);
    }

    this.codeContainer.appendChild(CodeContentEl);
    this.contentWrapper.appendChild(this.codeContainer);
    this.contentWrapper.appendChild(cornerWrapper);

    this.element.appendChild(this.contentWrapper);

    this.setupLangsOptions(LangLabelEl);
    this.highlightCodeSyntax();

    CopyLabelEl.addEventListener("click", () =>
      this.handleCopyAction(CopyLabelEl)
    );

    this.codeContainer.addEventListener("blur", () =>
      this.highlightCodeSyntax()
    );

    // init selector after render element to dom
    setTimeout(() => {
      this.langSelector = initSelector(
        LangLabelEl,
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
