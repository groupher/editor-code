import Selectr from "mobius1-selectr";

const ICON_ASSETS = "https://cps-oss.oss-cn-shanghai.aliyuncs.com/icons/pl/";

const LANGUAGES = [
  "javascript",
  "elixir",
  "swift",
  "typescript",
  "css",
  "html",
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
  "shell"
];

let options = [];

// TODO:  将当前选中的那一项放在最顶上
export const getLangOptions = () => {
  if (options.length !== 0) return options;

  LANGUAGES.forEach(lang => {
    options.push({
      value: lang,
      title: lang,
      icon: ICON_ASSETS + lang + ".png"
    });
  });

  return options;
};

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
const renderOption = option => {
  const template = [
    "<div class='selectr-lang-template'><img src='",
    option.dataset.src,
    "'><span>",
    option.textContent,
    "</span></div>"
  ];

  return template.join("");
};

/**
 * init the selectr plugin
 * @public
 * @param {HTMLDivElement} el - element to save
 * @param {String} activeLabel - active language label
 * @param {func} onChange - label change callback
 * @returns {boolean}
 */
export const initSelector = (el, activeLabel = "javascript", onChange) => {
  const selector = new Selectr(el, {
    renderOption: renderOption,
    messages: {
      noResults: "未找到该标签"
    }
  });

  selector.on("selectr.init", function() {
    this.setValue(activeLabel);

    this.input.placeholder = activeLabel;
    this.input.addEventListener("blur", () => this.close());
  });

  selector.on("selectr.open", function() {
    this.input.placeholder = activeLabel;

    this.input.addEventListener("blur", () => this.close());
  });

  selector.on("selectr.change", function(option) {
    this.input.placeholder = option.innerText;
    if (onChange) {
      onChange(option.innerText);
    }
  });

  return selector;
};
