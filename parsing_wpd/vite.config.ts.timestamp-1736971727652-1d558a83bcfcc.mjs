// vite.generated.ts
import path from "path";
import { existsSync as existsSync5, mkdirSync as mkdirSync2, readdirSync as readdirSync2, readFileSync as readFileSync4, writeFileSync as writeFileSync2 } from "fs";
import { createHash } from "crypto";
import * as net from "net";

// build/plugins/application-theme-plugin/theme-handle.js
import { existsSync as existsSync3, readFileSync as readFileSync2 } from "fs";
import { resolve as resolve3 } from "path";

// build/plugins/application-theme-plugin/theme-generator.js
import { globSync as globSync2 } from "file:///D:/Jmix_parser/parsing_wpd/parsing_wpd/node_modules/.pnpm/glob@10.3.3/node_modules/glob/dist/mjs/index.js";
import { resolve as resolve2, basename as basename2 } from "path";
import { existsSync as existsSync2, readFileSync, writeFileSync } from "fs";

// build/plugins/application-theme-plugin/theme-copy.js
import { readdirSync, statSync, mkdirSync, existsSync, copyFileSync } from "fs";
import { resolve, basename, relative, extname } from "path";
import { globSync } from "file:///D:/Jmix_parser/parsing_wpd/parsing_wpd/node_modules/.pnpm/glob@10.3.3/node_modules/glob/dist/mjs/index.js";
var ignoredFileExtensions = [".css", ".js", ".json"];
function copyThemeResources(themeFolder2, projectStaticAssetsOutputFolder, logger) {
  const staticAssetsThemeFolder = resolve(projectStaticAssetsOutputFolder, "themes", basename(themeFolder2));
  const collection = collectFolders(themeFolder2, logger);
  if (collection.files.length > 0) {
    mkdirSync(staticAssetsThemeFolder, { recursive: true });
    collection.directories.forEach((directory) => {
      const relativeDirectory = relative(themeFolder2, directory);
      const targetDirectory = resolve(staticAssetsThemeFolder, relativeDirectory);
      mkdirSync(targetDirectory, { recursive: true });
    });
    collection.files.forEach((file) => {
      const relativeFile = relative(themeFolder2, file);
      const targetFile = resolve(staticAssetsThemeFolder, relativeFile);
      copyFileIfAbsentOrNewer(file, targetFile, logger);
    });
  }
}
function collectFolders(folderToCopy, logger) {
  const collection = { directories: [], files: [] };
  logger.trace("files in directory", readdirSync(folderToCopy));
  readdirSync(folderToCopy).forEach((file) => {
    const fileToCopy = resolve(folderToCopy, file);
    try {
      if (statSync(fileToCopy).isDirectory()) {
        logger.debug("Going through directory", fileToCopy);
        const result = collectFolders(fileToCopy, logger);
        if (result.files.length > 0) {
          collection.directories.push(fileToCopy);
          logger.debug("Adding directory", fileToCopy);
          collection.directories.push.apply(collection.directories, result.directories);
          collection.files.push.apply(collection.files, result.files);
        }
      } else if (!ignoredFileExtensions.includes(extname(fileToCopy))) {
        logger.debug("Adding file", fileToCopy);
        collection.files.push(fileToCopy);
      }
    } catch (error) {
      handleNoSuchFileError(fileToCopy, error, logger);
    }
  });
  return collection;
}
function copyStaticAssets(themeName, themeProperties, projectStaticAssetsOutputFolder, logger) {
  const assets = themeProperties["assets"];
  if (!assets) {
    logger.debug("no assets to handle no static assets were copied");
    return;
  }
  mkdirSync(projectStaticAssetsOutputFolder, {
    recursive: true
  });
  const missingModules = checkModules(Object.keys(assets));
  if (missingModules.length > 0) {
    throw Error(
      "Missing npm modules '" + missingModules.join("', '") + "' for assets marked in 'theme.json'.\nInstall package(s) by adding a @NpmPackage annotation or install it using 'npm/pnpm/bun i'"
    );
  }
  Object.keys(assets).forEach((module) => {
    const copyRules = assets[module];
    Object.keys(copyRules).forEach((copyRule) => {
      const nodeSources = resolve("node_modules/", module, copyRule);
      const files = globSync(nodeSources, { nodir: true });
      const targetFolder = resolve(projectStaticAssetsOutputFolder, "themes", themeName, copyRules[copyRule]);
      mkdirSync(targetFolder, {
        recursive: true
      });
      files.forEach((file) => {
        const copyTarget = resolve(targetFolder, basename(file));
        copyFileIfAbsentOrNewer(file, copyTarget, logger);
      });
    });
  });
}
function checkModules(modules) {
  const missing = [];
  modules.forEach((module) => {
    if (!existsSync(resolve("node_modules/", module))) {
      missing.push(module);
    }
  });
  return missing;
}
function copyFileIfAbsentOrNewer(fileToCopy, copyTarget, logger) {
  try {
    if (!existsSync(copyTarget) || statSync(copyTarget).mtime < statSync(fileToCopy).mtime) {
      logger.trace("Copying: ", fileToCopy, "=>", copyTarget);
      copyFileSync(fileToCopy, copyTarget);
    }
  } catch (error) {
    handleNoSuchFileError(fileToCopy, error, logger);
  }
}
function handleNoSuchFileError(file, error, logger) {
  if (error.code === "ENOENT") {
    logger.warn("Ignoring not existing file " + file + ". File may have been deleted during theme processing.");
  } else {
    throw error;
  }
}

// build/plugins/application-theme-plugin/theme-generator.js
var themeComponentsFolder = "components";
var documentCssFilename = "document.css";
var stylesCssFilename = "styles.css";
var CSSIMPORT_COMMENT = "CSSImport end";
var headerImport = `import 'construct-style-sheets-polyfill';
`;
function writeThemeFiles(themeFolder2, themeName, themeProperties, options) {
  const productionMode = !options.devMode;
  const useDevServerOrInProductionMode = !options.useDevBundle;
  const outputFolder = options.frontendGeneratedFolder;
  const styles = resolve2(themeFolder2, stylesCssFilename);
  const documentCssFile = resolve2(themeFolder2, documentCssFilename);
  const autoInjectComponents = themeProperties.autoInjectComponents ?? true;
  const globalFilename = "theme-" + themeName + ".global.generated.js";
  const componentsFilename = "theme-" + themeName + ".components.generated.js";
  const themeFilename = "theme-" + themeName + ".generated.js";
  let themeFileContent = headerImport;
  let globalImportContent = "// When this file is imported, global styles are automatically applied\n";
  let componentsFileContent = "";
  var componentsFiles;
  if (autoInjectComponents) {
    componentsFiles = globSync2("*.css", {
      cwd: resolve2(themeFolder2, themeComponentsFolder),
      nodir: true
    });
    if (componentsFiles.length > 0) {
      componentsFileContent += "import { unsafeCSS, registerStyles } from '@vaadin/vaadin-themable-mixin/register-styles';\n";
    }
  }
  if (themeProperties.parent) {
    themeFileContent += `import { applyTheme as applyBaseTheme } from './theme-${themeProperties.parent}.generated.js';
`;
  }
  themeFileContent += `import { injectGlobalCss } from 'Frontend/generated/jar-resources/theme-util.js';
`;
  themeFileContent += `import './${componentsFilename}';
`;
  themeFileContent += `let needsReloadOnChanges = false;
`;
  const imports = [];
  const componentCssImports = [];
  const globalFileContent = [];
  const globalCssCode = [];
  const shadowOnlyCss = [];
  const componentCssCode = [];
  const parentTheme = themeProperties.parent ? "applyBaseTheme(target);\n" : "";
  const parentThemeGlobalImport = themeProperties.parent ? `import './theme-${themeProperties.parent}.global.generated.js';
` : "";
  const themeIdentifier = "_vaadintheme_" + themeName + "_";
  const lumoCssFlag = "_vaadinthemelumoimports_";
  const globalCssFlag = themeIdentifier + "globalCss";
  const componentCssFlag = themeIdentifier + "componentCss";
  if (!existsSync2(styles)) {
    if (productionMode) {
      throw new Error(`styles.css file is missing and is needed for '${themeName}' in folder '${themeFolder2}'`);
    }
    writeFileSync(
      styles,
      "/* Import your application global css files here or add the styles directly to this file */",
      "utf8"
    );
  }
  let filename = basename2(styles);
  let variable = camelCase(filename);
  const lumoImports = themeProperties.lumoImports || ["color", "typography"];
  if (lumoImports) {
    lumoImports.forEach((lumoImport) => {
      imports.push(`import { ${lumoImport} } from '@vaadin/vaadin-lumo-styles/${lumoImport}.js';
`);
      if (lumoImport === "utility" || lumoImport === "badge" || lumoImport === "typography" || lumoImport === "color") {
        globalFileContent.push(`import '@vaadin/vaadin-lumo-styles/${lumoImport}-global.js';
`);
      }
    });
    lumoImports.forEach((lumoImport) => {
      shadowOnlyCss.push(`removers.push(injectGlobalCss(${lumoImport}.cssText, '', target, true));
`);
    });
  }
  if (useDevServerOrInProductionMode) {
    globalFileContent.push(parentThemeGlobalImport);
    globalFileContent.push(`import 'themes/${themeName}/${filename}';
`);
    imports.push(`import ${variable} from 'themes/${themeName}/${filename}?inline';
`);
    shadowOnlyCss.push(`removers.push(injectGlobalCss(${variable}.toString(), '', target));
    `);
  }
  if (existsSync2(documentCssFile)) {
    filename = basename2(documentCssFile);
    variable = camelCase(filename);
    if (useDevServerOrInProductionMode) {
      globalFileContent.push(`import 'themes/${themeName}/${filename}';
`);
      imports.push(`import ${variable} from 'themes/${themeName}/${filename}?inline';
`);
      shadowOnlyCss.push(`removers.push(injectGlobalCss(${variable}.toString(),'', document));
    `);
    }
  }
  let i = 0;
  if (themeProperties.documentCss) {
    const missingModules = checkModules(themeProperties.documentCss);
    if (missingModules.length > 0) {
      throw Error(
        "Missing npm modules or files '" + missingModules.join("', '") + "' for documentCss marked in 'theme.json'.\nInstall or update package(s) by adding a @NpmPackage annotation or install it using 'npm/pnpm/bun i'"
      );
    }
    themeProperties.documentCss.forEach((cssImport) => {
      const variable2 = "module" + i++;
      imports.push(`import ${variable2} from '${cssImport}?inline';
`);
      globalCssCode.push(`if(target !== document) {
        removers.push(injectGlobalCss(${variable2}.toString(), '', target));
    }
    `);
      globalCssCode.push(
        `removers.push(injectGlobalCss(${variable2}.toString(), '${CSSIMPORT_COMMENT}', document));
    `
      );
    });
  }
  if (themeProperties.importCss) {
    const missingModules = checkModules(themeProperties.importCss);
    if (missingModules.length > 0) {
      throw Error(
        "Missing npm modules or files '" + missingModules.join("', '") + "' for importCss marked in 'theme.json'.\nInstall or update package(s) by adding a @NpmPackage annotation or install it using 'npm/pnpm/bun i'"
      );
    }
    themeProperties.importCss.forEach((cssPath) => {
      const variable2 = "module" + i++;
      globalFileContent.push(`import '${cssPath}';
`);
      imports.push(`import ${variable2} from '${cssPath}?inline';
`);
      shadowOnlyCss.push(`removers.push(injectGlobalCss(${variable2}.toString(), '${CSSIMPORT_COMMENT}', target));
`);
    });
  }
  if (autoInjectComponents) {
    componentsFiles.forEach((componentCss) => {
      const filename2 = basename2(componentCss);
      const tag = filename2.replace(".css", "");
      const variable2 = camelCase(filename2);
      componentCssImports.push(
        `import ${variable2} from 'themes/${themeName}/${themeComponentsFolder}/${filename2}?inline';
`
      );
      const componentString = `registerStyles(
        '${tag}',
        unsafeCSS(${variable2}.toString())
      );
      `;
      componentCssCode.push(componentString);
    });
  }
  themeFileContent += imports.join("");
  const themeFileApply = `
  let themeRemovers = new WeakMap();
  let targets = [];

  export const applyTheme = (target) => {
    const removers = [];
    if (target !== document) {
      ${shadowOnlyCss.join("")}
    }
    ${parentTheme}
    ${globalCssCode.join("")}

    if (import.meta.hot) {
      targets.push(new WeakRef(target));
      themeRemovers.set(target, removers);
    }

  }
  
`;
  componentsFileContent += `
${componentCssImports.join("")}

if (!document['${componentCssFlag}']) {
  ${componentCssCode.join("")}
  document['${componentCssFlag}'] = true;
}

if (import.meta.hot) {
  import.meta.hot.accept((module) => {
    window.location.reload();
  });
}

`;
  themeFileContent += themeFileApply;
  themeFileContent += `
if (import.meta.hot) {
  import.meta.hot.accept((module) => {

    if (needsReloadOnChanges) {
      window.location.reload();
    } else {
      targets.forEach(targetRef => {
        const target = targetRef.deref();
        if (target) {
          themeRemovers.get(target).forEach(remover => remover())
          module.applyTheme(target);
        }
      })
    }
  });

  import.meta.hot.on('vite:afterUpdate', (update) => {
    document.dispatchEvent(new CustomEvent('vaadin-theme-updated', { detail: update }));
  });
}

`;
  globalImportContent += `
${globalFileContent.join("")}
`;
  writeIfChanged(resolve2(outputFolder, globalFilename), globalImportContent);
  writeIfChanged(resolve2(outputFolder, themeFilename), themeFileContent);
  writeIfChanged(resolve2(outputFolder, componentsFilename), componentsFileContent);
}
function writeIfChanged(file, data) {
  if (!existsSync2(file) || readFileSync(file, { encoding: "utf-8" }) !== data) {
    writeFileSync(file, data);
  }
}
function camelCase(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
    return index === 0 ? word.toLowerCase() : word.toUpperCase();
  }).replace(/\s+/g, "").replace(/\.|\-/g, "");
}

// build/plugins/application-theme-plugin/theme-handle.js
var nameRegex = /theme-(.*)\.generated\.js/;
var prevThemeName = void 0;
var firstThemeName = void 0;
function processThemeResources(options, logger) {
  const themeName = extractThemeName(options.frontendGeneratedFolder);
  if (themeName) {
    if (!prevThemeName && !firstThemeName) {
      firstThemeName = themeName;
    } else if (prevThemeName && prevThemeName !== themeName && firstThemeName !== themeName || !prevThemeName && firstThemeName !== themeName) {
      const warning = `Attention: Active theme is switched to '${themeName}'.`;
      const description = `
      Note that adding new style sheet files to '/themes/${themeName}/components', 
      may not be taken into effect until the next application restart.
      Changes to already existing style sheet files are being reloaded as before.`;
      logger.warn("*******************************************************************");
      logger.warn(warning);
      logger.warn(description);
      logger.warn("*******************************************************************");
    }
    prevThemeName = themeName;
    findThemeFolderAndHandleTheme(themeName, options, logger);
  } else {
    prevThemeName = void 0;
    logger.debug("Skipping Vaadin application theme handling.");
    logger.trace("Most likely no @Theme annotation for application or only themeClass used.");
  }
}
function findThemeFolderAndHandleTheme(themeName, options, logger) {
  let themeFound = false;
  for (let i = 0; i < options.themeProjectFolders.length; i++) {
    const themeProjectFolder = options.themeProjectFolders[i];
    if (existsSync3(themeProjectFolder)) {
      logger.debug("Searching themes folder '" + themeProjectFolder + "' for theme '" + themeName + "'");
      const handled = handleThemes(themeName, themeProjectFolder, options, logger);
      if (handled) {
        if (themeFound) {
          throw new Error(
            "Found theme files in '" + themeProjectFolder + "' and '" + themeFound + "'. Theme should only be available in one folder"
          );
        }
        logger.debug("Found theme files from '" + themeProjectFolder + "'");
        themeFound = themeProjectFolder;
      }
    }
  }
  if (existsSync3(options.themeResourceFolder)) {
    if (themeFound && existsSync3(resolve3(options.themeResourceFolder, themeName))) {
      throw new Error(
        "Theme '" + themeName + `'should not exist inside a jar and in the project at the same time
Extending another theme is possible by adding { "parent": "my-parent-theme" } entry to the theme.json file inside your theme folder.`
      );
    }
    logger.debug(
      "Searching theme jar resource folder '" + options.themeResourceFolder + "' for theme '" + themeName + "'"
    );
    handleThemes(themeName, options.themeResourceFolder, options, logger);
    themeFound = true;
  }
  return themeFound;
}
function handleThemes(themeName, themesFolder, options, logger) {
  const themeFolder2 = resolve3(themesFolder, themeName);
  if (existsSync3(themeFolder2)) {
    logger.debug("Found theme ", themeName, " in folder ", themeFolder2);
    const themeProperties = getThemeProperties(themeFolder2);
    if (themeProperties.parent) {
      const found = findThemeFolderAndHandleTheme(themeProperties.parent, options, logger);
      if (!found) {
        throw new Error(
          "Could not locate files for defined parent theme '" + themeProperties.parent + "'.\nPlease verify that dependency is added or theme folder exists."
        );
      }
    }
    copyStaticAssets(themeName, themeProperties, options.projectStaticAssetsOutputFolder, logger);
    copyThemeResources(themeFolder2, options.projectStaticAssetsOutputFolder, logger);
    writeThemeFiles(themeFolder2, themeName, themeProperties, options);
    return true;
  }
  return false;
}
function getThemeProperties(themeFolder2) {
  const themePropertyFile = resolve3(themeFolder2, "theme.json");
  if (!existsSync3(themePropertyFile)) {
    return {};
  }
  const themePropertyFileAsString = readFileSync2(themePropertyFile);
  if (themePropertyFileAsString.length === 0) {
    return {};
  }
  return JSON.parse(themePropertyFileAsString);
}
function extractThemeName(frontendGeneratedFolder) {
  if (!frontendGeneratedFolder) {
    throw new Error(
      "Couldn't extract theme name from 'theme.js', because the path to folder containing this file is empty. Please set the a correct folder path in ApplicationThemePlugin constructor parameters."
    );
  }
  const generatedThemeFile = resolve3(frontendGeneratedFolder, "theme.js");
  if (existsSync3(generatedThemeFile)) {
    const themeName = nameRegex.exec(readFileSync2(generatedThemeFile, { encoding: "utf8" }))[1];
    if (!themeName) {
      throw new Error("Couldn't parse theme name from '" + generatedThemeFile + "'.");
    }
    return themeName;
  } else {
    return "";
  }
}

// build/plugins/theme-loader/theme-loader-utils.js
import { existsSync as existsSync4, readFileSync as readFileSync3 } from "fs";
import { resolve as resolve4, basename as basename3 } from "path";
import { globSync as globSync3 } from "file:///D:/Jmix_parser/parsing_wpd/parsing_wpd/node_modules/.pnpm/glob@10.3.3/node_modules/glob/dist/mjs/index.js";
var urlMatcher = /(url\(\s*)(\'|\")?(\.\/|\.\.\/)(\S*)(\2\s*\))/g;
function assetsContains(fileUrl, themeFolder2, logger) {
  const themeProperties = getThemeProperties2(themeFolder2);
  if (!themeProperties) {
    logger.debug("No theme properties found.");
    return false;
  }
  const assets = themeProperties["assets"];
  if (!assets) {
    logger.debug("No defined assets in theme properties");
    return false;
  }
  for (let module of Object.keys(assets)) {
    const copyRules = assets[module];
    for (let copyRule of Object.keys(copyRules)) {
      if (fileUrl.startsWith(copyRules[copyRule])) {
        const targetFile = fileUrl.replace(copyRules[copyRule], "");
        const files = globSync3(resolve4("node_modules/", module, copyRule), { nodir: true });
        for (let file of files) {
          if (file.endsWith(targetFile))
            return true;
        }
      }
    }
  }
  return false;
}
function getThemeProperties2(themeFolder2) {
  const themePropertyFile = resolve4(themeFolder2, "theme.json");
  if (!existsSync4(themePropertyFile)) {
    return {};
  }
  const themePropertyFileAsString = readFileSync3(themePropertyFile);
  if (themePropertyFileAsString.length === 0) {
    return {};
  }
  return JSON.parse(themePropertyFileAsString);
}
function rewriteCssUrls(source, handledResourceFolder, themeFolder2, logger, options) {
  source = source.replace(urlMatcher, function(match, url, quoteMark, replace2, fileUrl, endString) {
    let absolutePath = resolve4(handledResourceFolder, replace2, fileUrl);
    const existingThemeResource = absolutePath.startsWith(themeFolder2) && existsSync4(absolutePath);
    if (existingThemeResource || assetsContains(fileUrl, themeFolder2, logger)) {
      const replacement = options.devMode ? "./" : "../static/";
      const skipLoader = existingThemeResource ? "" : replacement;
      const frontendThemeFolder = skipLoader + "themes/" + basename3(themeFolder2);
      logger.debug(
        "Updating url for file",
        "'" + replace2 + fileUrl + "'",
        "to use",
        "'" + frontendThemeFolder + "/" + fileUrl + "'"
      );
      const pathResolved = absolutePath.substring(themeFolder2.length).replace(/\\/g, "/");
      return url + (quoteMark ?? "") + frontendThemeFolder + pathResolved + endString;
    } else if (options.devMode) {
      logger.log("No rewrite for '", match, "' as the file was not found.");
    } else {
      return url + (quoteMark ?? "") + "../../" + fileUrl + endString;
    }
    return match;
  });
  return source;
}

// build/vaadin-dev-server-settings.json
var vaadin_dev_server_settings_default = {
  frontendFolder: "D:/Jmix_parser/parsing_wpd/parsing_wpd/frontend",
  themeFolder: "themes",
  themeResourceFolder: "D:/Jmix_parser/parsing_wpd/parsing_wpd/frontend/generated/jar-resources",
  staticOutput: "D:/Jmix_parser/parsing_wpd/parsing_wpd/build/classes/META-INF/VAADIN/webapp/VAADIN/static",
  generatedFolder: "generated",
  statsOutput: "D:\\Jmix_parser\\parsing_wpd\\parsing_wpd\\build\\classes\\META-INF\\VAADIN\\config",
  frontendBundleOutput: "D:\\Jmix_parser\\parsing_wpd\\parsing_wpd\\build\\classes\\META-INF\\VAADIN\\webapp",
  devBundleOutput: "D:/Jmix_parser/parsing_wpd/parsing_wpd/build/dev-bundle/webapp",
  devBundleStatsOutput: "D:/Jmix_parser/parsing_wpd/parsing_wpd/build/dev-bundle/config",
  jarResourcesFolder: "D:/Jmix_parser/parsing_wpd/parsing_wpd/frontend/generated/jar-resources",
  themeName: "parsing_wpd",
  clientServiceWorkerSource: "D:\\Jmix_parser\\parsing_wpd\\parsing_wpd\\build\\sw.ts",
  pwaEnabled: true,
  offlineEnabled: true,
  offlinePath: "'.'"
};

// vite.generated.ts
import {
  defineConfig,
  mergeConfig
} from "file:///D:/Jmix_parser/parsing_wpd/parsing_wpd/node_modules/.pnpm/vite@5.1.7_@types+node@22.10.6_terser@5.37.0/node_modules/vite/dist/node/index.js";
import { getManifest } from "file:///D:/Jmix_parser/parsing_wpd/parsing_wpd/node_modules/.pnpm/workbox-build@7.0.0_@types+babel__core@7.20.5/node_modules/workbox-build/build/index.js";
import * as rollup from "file:///D:/Jmix_parser/parsing_wpd/parsing_wpd/node_modules/.pnpm/rollup@2.79.2/node_modules/rollup/dist/es/rollup.js";
import brotli from "file:///D:/Jmix_parser/parsing_wpd/parsing_wpd/node_modules/.pnpm/rollup-plugin-brotli@3.1.0/node_modules/rollup-plugin-brotli/lib/index.cjs.js";
import replace from "file:///D:/Jmix_parser/parsing_wpd/parsing_wpd/node_modules/.pnpm/@rollup+plugin-replace@5.0.5_rollup@2.79.2/node_modules/@rollup/plugin-replace/dist/es/index.js";
import checker from "file:///D:/Jmix_parser/parsing_wpd/parsing_wpd/node_modules/.pnpm/vite-plugin-checker@0.6.4_typescript@5.3.3_vite@5.1.7_@types+node@22.10.6_terser@5.37.0_/node_modules/vite-plugin-checker/dist/esm/main.js";

// build/plugins/rollup-plugin-postcss-lit-custom/rollup-plugin-postcss-lit.js
import { createFilter } from "file:///D:/Jmix_parser/parsing_wpd/parsing_wpd/node_modules/.pnpm/@rollup+pluginutils@5.1.0_rollup@2.79.2/node_modules/@rollup/pluginutils/dist/es/index.js";
import transformAst from "file:///D:/Jmix_parser/parsing_wpd/parsing_wpd/node_modules/.pnpm/transform-ast@2.4.4/node_modules/transform-ast/index.js";
var assetUrlRE = /__VITE_ASSET__([\w$]+)__(?:\$_(.*?)__)?/g;
var escape = (str) => str.replace(assetUrlRE, '${unsafeCSSTag("__VITE_ASSET__$1__$2")}').replace(/`/g, "\\`").replace(/\\(?!`)/g, "\\\\");
function postcssLit(options = {}) {
  const defaultOptions = {
    include: "**/*.{css,sss,pcss,styl,stylus,sass,scss,less}",
    exclude: null,
    importPackage: "lit"
  };
  const opts = { ...defaultOptions, ...options };
  const filter = createFilter(opts.include, opts.exclude);
  return {
    name: "postcss-lit",
    enforce: "post",
    transform(code, id) {
      if (!filter(id))
        return;
      const ast = this.parse(code, {});
      let defaultExportName;
      let isDeclarationLiteral = false;
      const magicString = transformAst(code, { ast }, (node) => {
        if (node.type === "ExportDefaultDeclaration") {
          defaultExportName = node.declaration.name;
          isDeclarationLiteral = node.declaration.type === "Literal";
        }
      });
      if (!defaultExportName && !isDeclarationLiteral) {
        return;
      }
      magicString.walk((node) => {
        if (defaultExportName && node.type === "VariableDeclaration") {
          const exportedVar = node.declarations.find((d) => d.id.name === defaultExportName);
          if (exportedVar) {
            exportedVar.init.edit.update(`cssTag\`${escape(exportedVar.init.value)}\``);
          }
        }
        if (isDeclarationLiteral && node.type === "ExportDefaultDeclaration") {
          node.declaration.edit.update(`cssTag\`${escape(node.declaration.value)}\``);
        }
      });
      magicString.prepend(`import {css as cssTag, unsafeCSS as unsafeCSSTag} from '${opts.importPackage}';
`);
      return {
        code: magicString.toString(),
        map: magicString.generateMap({
          hires: true
        })
      };
    }
  };
}

// vite.generated.ts
import { createRequire } from "module";
import { visualizer } from "file:///D:/Jmix_parser/parsing_wpd/parsing_wpd/node_modules/.pnpm/rollup-plugin-visualizer@5.12.0_rollup@2.79.2/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
var __vite_injected_original_dirname = "D:\\Jmix_parser\\parsing_wpd\\parsing_wpd";
var __vite_injected_original_import_meta_url = "file:///D:/Jmix_parser/parsing_wpd/parsing_wpd/vite.generated.ts";
var require2 = createRequire(__vite_injected_original_import_meta_url);
var appShellUrl = ".";
var frontendFolder = path.resolve(__vite_injected_original_dirname, vaadin_dev_server_settings_default.frontendFolder);
var themeFolder = path.resolve(frontendFolder, vaadin_dev_server_settings_default.themeFolder);
var frontendBundleFolder = path.resolve(__vite_injected_original_dirname, vaadin_dev_server_settings_default.frontendBundleOutput);
var devBundleFolder = path.resolve(__vite_injected_original_dirname, vaadin_dev_server_settings_default.devBundleOutput);
var devBundle = !!process.env.devBundle;
var jarResourcesFolder = path.resolve(__vite_injected_original_dirname, vaadin_dev_server_settings_default.jarResourcesFolder);
var themeResourceFolder = path.resolve(__vite_injected_original_dirname, vaadin_dev_server_settings_default.themeResourceFolder);
var projectPackageJsonFile = path.resolve(__vite_injected_original_dirname, "package.json");
var buildOutputFolder = devBundle ? devBundleFolder : frontendBundleFolder;
var statsFolder = path.resolve(__vite_injected_original_dirname, devBundle ? vaadin_dev_server_settings_default.devBundleStatsOutput : vaadin_dev_server_settings_default.statsOutput);
var statsFile = path.resolve(statsFolder, "stats.json");
var bundleSizeFile = path.resolve(statsFolder, "bundle-size.html");
var nodeModulesFolder = path.resolve(__vite_injected_original_dirname, "node_modules");
var webComponentTags = "";
var projectIndexHtml = path.resolve(frontendFolder, "index.html");
var projectStaticAssetsFolders = [
  path.resolve(__vite_injected_original_dirname, "src", "main", "resources", "META-INF", "resources"),
  path.resolve(__vite_injected_original_dirname, "src", "main", "resources", "static"),
  frontendFolder
];
var themeProjectFolders = projectStaticAssetsFolders.map((folder) => path.resolve(folder, vaadin_dev_server_settings_default.themeFolder));
var themeOptions = {
  devMode: false,
  useDevBundle: devBundle,
  // The following matches folder 'frontend/generated/themes/'
  // (not 'frontend/themes') for theme in JAR that is copied there
  themeResourceFolder: path.resolve(themeResourceFolder, vaadin_dev_server_settings_default.themeFolder),
  themeProjectFolders,
  projectStaticAssetsOutputFolder: devBundle ? path.resolve(devBundleFolder, "../assets") : path.resolve(__vite_injected_original_dirname, vaadin_dev_server_settings_default.staticOutput),
  frontendGeneratedFolder: path.resolve(frontendFolder, vaadin_dev_server_settings_default.generatedFolder)
};
var hasExportedWebComponents = existsSync5(path.resolve(frontendFolder, "web-component.html"));
console.trace = () => {
};
console.debug = () => {
};
function injectManifestToSWPlugin() {
  const rewriteManifestIndexHtmlUrl = (manifest) => {
    const indexEntry = manifest.find((entry) => entry.url === "index.html");
    if (indexEntry) {
      indexEntry.url = appShellUrl;
    }
    return { manifest, warnings: [] };
  };
  return {
    name: "vaadin:inject-manifest-to-sw",
    async transform(code, id) {
      if (/sw\.(ts|js)$/.test(id)) {
        const { manifestEntries } = await getManifest({
          globDirectory: buildOutputFolder,
          globPatterns: ["**/*"],
          globIgnores: ["**/*.br"],
          manifestTransforms: [rewriteManifestIndexHtmlUrl],
          maximumFileSizeToCacheInBytes: 100 * 1024 * 1024
          // 100mb,
        });
        return code.replace("self.__WB_MANIFEST", JSON.stringify(manifestEntries));
      }
    }
  };
}
function buildSWPlugin(opts) {
  let config;
  const devMode = opts.devMode;
  const swObj = {};
  async function build(action, additionalPlugins = []) {
    const includedPluginNames = [
      "vite:esbuild",
      "rollup-plugin-dynamic-import-variables",
      "vite:esbuild-transpile",
      "vite:terser"
    ];
    const plugins = config.plugins.filter((p) => {
      return includedPluginNames.includes(p.name);
    });
    const resolver = config.createResolver();
    const resolvePlugin = {
      name: "resolver",
      resolveId(source, importer, _options) {
        return resolver(source, importer);
      }
    };
    plugins.unshift(resolvePlugin);
    plugins.push(
      replace({
        values: {
          "process.env.NODE_ENV": JSON.stringify(config.mode),
          ...config.define
        },
        preventAssignment: true
      })
    );
    if (additionalPlugins) {
      plugins.push(...additionalPlugins);
    }
    const bundle = await rollup.rollup({
      input: path.resolve(vaadin_dev_server_settings_default.clientServiceWorkerSource),
      plugins
    });
    try {
      return await bundle[action]({
        file: path.resolve(buildOutputFolder, "sw.js"),
        format: "es",
        exports: "none",
        sourcemap: config.command === "serve" || config.build.sourcemap,
        inlineDynamicImports: true
      });
    } finally {
      await bundle.close();
    }
  }
  return {
    name: "vaadin:build-sw",
    enforce: "post",
    async configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    async buildStart() {
      if (devMode) {
        const { output } = await build("generate");
        swObj.code = output[0].code;
        swObj.map = output[0].map;
      }
    },
    async load(id) {
      if (id.endsWith("sw.js")) {
        return "";
      }
    },
    async transform(_code, id) {
      if (id.endsWith("sw.js")) {
        return swObj;
      }
    },
    async closeBundle() {
      if (!devMode) {
        await build("write", [injectManifestToSWPlugin(), brotli()]);
      }
    }
  };
}
function statsExtracterPlugin() {
  function collectThemeJsonsInFrontend(themeJsonContents, themeName) {
    const themeJson = path.resolve(frontendFolder, vaadin_dev_server_settings_default.themeFolder, themeName, "theme.json");
    if (existsSync5(themeJson)) {
      const themeJsonContent = readFileSync4(themeJson, { encoding: "utf-8" }).replace(/\r\n/g, "\n");
      themeJsonContents[themeName] = themeJsonContent;
      const themeJsonObject = JSON.parse(themeJsonContent);
      if (themeJsonObject.parent) {
        collectThemeJsonsInFrontend(themeJsonContents, themeJsonObject.parent);
      }
    }
  }
  return {
    name: "vaadin:stats",
    enforce: "post",
    async writeBundle(options, bundle) {
      const modules = Object.values(bundle).flatMap((b) => b.modules ? Object.keys(b.modules) : []);
      const nodeModulesFolders = modules.map((id) => id.replace(/\\/g, "/")).filter((id) => id.startsWith(nodeModulesFolder.replace(/\\/g, "/"))).map((id) => id.substring(nodeModulesFolder.length + 1));
      const npmModules = nodeModulesFolders.map((id) => id.replace(/\\/g, "/")).map((id) => {
        const parts = id.split("/");
        if (id.startsWith("@")) {
          return parts[0] + "/" + parts[1];
        } else {
          return parts[0];
        }
      }).sort().filter((value, index, self) => self.indexOf(value) === index);
      const npmModuleAndVersion = Object.fromEntries(npmModules.map((module) => [module, getVersion(module)]));
      const cvdls = Object.fromEntries(
        npmModules.filter((module) => getCvdlName(module) != null).map((module) => [module, { name: getCvdlName(module), version: getVersion(module) }])
      );
      mkdirSync2(path.dirname(statsFile), { recursive: true });
      const projectPackageJson = JSON.parse(readFileSync4(projectPackageJsonFile, { encoding: "utf-8" }));
      const entryScripts = Object.values(bundle).filter((bundle2) => bundle2.isEntry).map((bundle2) => bundle2.fileName);
      const generatedIndexHtml = path.resolve(buildOutputFolder, "index.html");
      const customIndexData = readFileSync4(projectIndexHtml, { encoding: "utf-8" });
      const generatedIndexData = readFileSync4(generatedIndexHtml, {
        encoding: "utf-8"
      });
      const customIndexRows = new Set(customIndexData.split(/[\r\n]/).filter((row) => row.trim() !== ""));
      const generatedIndexRows = generatedIndexData.split(/[\r\n]/).filter((row) => row.trim() !== "");
      const rowsGenerated = [];
      generatedIndexRows.forEach((row) => {
        if (!customIndexRows.has(row)) {
          rowsGenerated.push(row);
        }
      });
      const parseImports = (filename, result) => {
        const content = readFileSync4(filename, { encoding: "utf-8" });
        const lines = content.split("\n");
        const staticImports = lines.filter((line) => line.startsWith("import ")).map((line) => line.substring(line.indexOf("'") + 1, line.lastIndexOf("'"))).map((line) => line.includes("?") ? line.substring(0, line.lastIndexOf("?")) : line);
        const dynamicImports = lines.filter((line) => line.includes("import(")).map((line) => line.replace(/.*import\(/, "")).map((line) => line.split(/'/)[1]).map((line) => line.includes("?") ? line.substring(0, line.lastIndexOf("?")) : line);
        staticImports.forEach((staticImport) => result.add(staticImport));
        dynamicImports.map((dynamicImport) => {
          const importedFile = path.resolve(path.dirname(filename), dynamicImport);
          parseImports(importedFile, result);
        });
      };
      const generatedImportsSet = /* @__PURE__ */ new Set();
      parseImports(
        path.resolve(themeOptions.frontendGeneratedFolder, "flow", "generated-flow-imports.js"),
        generatedImportsSet
      );
      const generatedImports = Array.from(generatedImportsSet).sort();
      const frontendFiles = {};
      const projectFileExtensions = [".js", ".js.map", ".ts", ".ts.map", ".tsx", ".tsx.map", ".css", ".css.map"];
      const isThemeComponentsResource = (id) => id.startsWith(themeOptions.frontendGeneratedFolder.replace(/\\/g, "/")) && id.match(/.*\/jar-resources\/themes\/[^\/]+\/components\//);
      const isGeneratedWebComponentResource = (id) => id.startsWith(themeOptions.frontendGeneratedFolder.replace(/\\/g, "/")) && id.match(/.*\/flow\/web-components\//);
      const isFrontendResourceCollected = (id) => !id.startsWith(themeOptions.frontendGeneratedFolder.replace(/\\/g, "/")) || isThemeComponentsResource(id) || isGeneratedWebComponentResource(id);
      modules.map((id) => id.replace(/\\/g, "/")).filter((id) => id.startsWith(frontendFolder.replace(/\\/g, "/"))).filter(isFrontendResourceCollected).map((id) => id.substring(frontendFolder.length + 1)).map((line) => line.includes("?") ? line.substring(0, line.lastIndexOf("?")) : line).forEach((line) => {
        const filePath = path.resolve(frontendFolder, line);
        if (projectFileExtensions.includes(path.extname(filePath))) {
          const fileBuffer = readFileSync4(filePath, { encoding: "utf-8" }).replace(/\r\n/g, "\n");
          frontendFiles[line] = createHash("sha256").update(fileBuffer, "utf8").digest("hex");
        }
      });
      generatedImports.filter((line) => line.includes("generated/jar-resources")).forEach((line) => {
        let filename = line.substring(line.indexOf("generated"));
        const fileBuffer = readFileSync4(path.resolve(frontendFolder, filename), { encoding: "utf-8" }).replace(
          /\r\n/g,
          "\n"
        );
        const hash = createHash("sha256").update(fileBuffer, "utf8").digest("hex");
        const fileKey = line.substring(line.indexOf("jar-resources/") + 14);
        frontendFiles[fileKey] = hash;
      });
      let frontendFolderAlias = "Frontend";
      generatedImports.filter((line) => line.startsWith(frontendFolderAlias + "/")).filter((line) => !line.startsWith(frontendFolderAlias + "/generated/")).filter((line) => !line.startsWith(frontendFolderAlias + "/themes/")).map((line) => line.substring(frontendFolderAlias.length + 1)).filter((line) => !frontendFiles[line]).forEach((line) => {
        const filePath = path.resolve(frontendFolder, line);
        if (projectFileExtensions.includes(path.extname(filePath)) && existsSync5(filePath)) {
          const fileBuffer = readFileSync4(filePath, { encoding: "utf-8" }).replace(/\r\n/g, "\n");
          frontendFiles[line] = createHash("sha256").update(fileBuffer, "utf8").digest("hex");
        }
      });
      if (existsSync5(path.resolve(frontendFolder, "index.ts"))) {
        const fileBuffer = readFileSync4(path.resolve(frontendFolder, "index.ts"), { encoding: "utf-8" }).replace(
          /\r\n/g,
          "\n"
        );
        frontendFiles[`index.ts`] = createHash("sha256").update(fileBuffer, "utf8").digest("hex");
      }
      const themeJsonContents = {};
      const themesFolder = path.resolve(jarResourcesFolder, "themes");
      if (existsSync5(themesFolder)) {
        readdirSync2(themesFolder).forEach((themeFolder2) => {
          const themeJson = path.resolve(themesFolder, themeFolder2, "theme.json");
          if (existsSync5(themeJson)) {
            themeJsonContents[path.basename(themeFolder2)] = readFileSync4(themeJson, { encoding: "utf-8" }).replace(
              /\r\n/g,
              "\n"
            );
          }
        });
      }
      collectThemeJsonsInFrontend(themeJsonContents, vaadin_dev_server_settings_default.themeName);
      let webComponents = [];
      if (webComponentTags) {
        webComponents = webComponentTags.split(";");
      }
      const stats = {
        packageJsonDependencies: projectPackageJson.dependencies,
        npmModules: npmModuleAndVersion,
        bundleImports: generatedImports,
        frontendHashes: frontendFiles,
        themeJsonContents,
        entryScripts,
        webComponents,
        cvdlModules: cvdls,
        packageJsonHash: projectPackageJson?.vaadin?.hash,
        indexHtmlGenerated: rowsGenerated
      };
      writeFileSync2(statsFile, JSON.stringify(stats, null, 1));
    }
  };
}
function vaadinBundlesPlugin() {
  const disabledMessage = "Vaadin component dependency bundles are disabled.";
  const modulesDirectory = nodeModulesFolder.replace(/\\/g, "/");
  let vaadinBundleJson;
  function parseModuleId(id) {
    const [scope, scopedPackageName] = id.split("/", 3);
    const packageName = scope.startsWith("@") ? `${scope}/${scopedPackageName}` : scope;
    const modulePath = `.${id.substring(packageName.length)}`;
    return {
      packageName,
      modulePath
    };
  }
  function getExports(id) {
    const { packageName, modulePath } = parseModuleId(id);
    const packageInfo = vaadinBundleJson.packages[packageName];
    if (!packageInfo)
      return;
    const exposeInfo = packageInfo.exposes[modulePath];
    if (!exposeInfo)
      return;
    const exportsSet = /* @__PURE__ */ new Set();
    for (const e of exposeInfo.exports) {
      if (typeof e === "string") {
        exportsSet.add(e);
      } else {
        const { namespace, source } = e;
        if (namespace) {
          exportsSet.add(namespace);
        } else {
          const sourceExports = getExports(source);
          if (sourceExports) {
            sourceExports.forEach((e2) => exportsSet.add(e2));
          }
        }
      }
    }
    return Array.from(exportsSet);
  }
  function getExportBinding(binding) {
    return binding === "default" ? "_default as default" : binding;
  }
  function getImportAssigment(binding) {
    return binding === "default" ? "default: _default" : binding;
  }
  return {
    name: "vaadin:bundles",
    enforce: "pre",
    apply(config, { command }) {
      if (command !== "serve")
        return false;
      try {
        const vaadinBundleJsonPath = require2.resolve("@vaadin/bundles/vaadin-bundle.json");
        vaadinBundleJson = JSON.parse(readFileSync4(vaadinBundleJsonPath, { encoding: "utf8" }));
      } catch (e) {
        if (typeof e === "object" && e.code === "MODULE_NOT_FOUND") {
          vaadinBundleJson = { packages: {} };
          console.info(`@vaadin/bundles npm package is not found, ${disabledMessage}`);
          return false;
        } else {
          throw e;
        }
      }
      const versionMismatches = [];
      for (const [name, packageInfo] of Object.entries(vaadinBundleJson.packages)) {
        let installedVersion = void 0;
        try {
          const { version: bundledVersion } = packageInfo;
          const installedPackageJsonFile = path.resolve(modulesDirectory, name, "package.json");
          const packageJson = JSON.parse(readFileSync4(installedPackageJsonFile, { encoding: "utf8" }));
          installedVersion = packageJson.version;
          if (installedVersion && installedVersion !== bundledVersion) {
            versionMismatches.push({
              name,
              bundledVersion,
              installedVersion
            });
          }
        } catch (_) {
        }
      }
      if (versionMismatches.length) {
        console.info(`@vaadin/bundles has version mismatches with installed packages, ${disabledMessage}`);
        console.info(`Packages with version mismatches: ${JSON.stringify(versionMismatches, void 0, 2)}`);
        vaadinBundleJson = { packages: {} };
        return false;
      }
      return true;
    },
    async config(config) {
      return mergeConfig(
        {
          optimizeDeps: {
            exclude: [
              // Vaadin bundle
              "@vaadin/bundles",
              ...Object.keys(vaadinBundleJson.packages),
              "@vaadin/vaadin-material-styles"
            ]
          }
        },
        config
      );
    },
    load(rawId) {
      const [path2, params] = rawId.split("?");
      if (!path2.startsWith(modulesDirectory))
        return;
      const id = path2.substring(modulesDirectory.length + 1);
      const bindings = getExports(id);
      if (bindings === void 0)
        return;
      const cacheSuffix = params ? `?${params}` : "";
      const bundlePath = `@vaadin/bundles/vaadin.js${cacheSuffix}`;
      return `import { init as VaadinBundleInit, get as VaadinBundleGet } from '${bundlePath}';
await VaadinBundleInit('default');
const { ${bindings.map(getImportAssigment).join(", ")} } = (await VaadinBundleGet('./node_modules/${id}'))();
export { ${bindings.map(getExportBinding).join(", ")} };`;
    }
  };
}
function themePlugin(opts) {
  const fullThemeOptions = { ...themeOptions, devMode: opts.devMode };
  return {
    name: "vaadin:theme",
    config() {
      processThemeResources(fullThemeOptions, console);
    },
    configureServer(server) {
      function handleThemeFileCreateDelete(themeFile, stats) {
        if (themeFile.startsWith(themeFolder)) {
          const changed = path.relative(themeFolder, themeFile);
          console.debug("Theme file " + (!!stats ? "created" : "deleted"), changed);
          processThemeResources(fullThemeOptions, console);
        }
      }
      server.watcher.on("add", handleThemeFileCreateDelete);
      server.watcher.on("unlink", handleThemeFileCreateDelete);
    },
    handleHotUpdate(context) {
      const contextPath = path.resolve(context.file);
      const themePath = path.resolve(themeFolder);
      if (contextPath.startsWith(themePath)) {
        const changed = path.relative(themePath, contextPath);
        console.debug("Theme file changed", changed);
        if (changed.startsWith(vaadin_dev_server_settings_default.themeName)) {
          processThemeResources(fullThemeOptions, console);
        }
      }
    },
    async resolveId(id, importer) {
      if (path.resolve(themeOptions.frontendGeneratedFolder, "theme.js") === importer && !existsSync5(path.resolve(themeOptions.frontendGeneratedFolder, id))) {
        console.debug("Generate theme file " + id + " not existing. Processing theme resource");
        processThemeResources(fullThemeOptions, console);
        return;
      }
      if (!id.startsWith(vaadin_dev_server_settings_default.themeFolder)) {
        return;
      }
      for (const location of [themeResourceFolder, frontendFolder]) {
        const result = await this.resolve(path.resolve(location, id));
        if (result) {
          return result;
        }
      }
    },
    async transform(raw, id, options) {
      const [bareId, query] = id.split("?");
      if (!bareId?.startsWith(themeFolder) && !bareId?.startsWith(themeOptions.themeResourceFolder) || !bareId?.endsWith(".css")) {
        return;
      }
      const [themeName] = bareId.substring(themeFolder.length + 1).split("/");
      return rewriteCssUrls(raw, path.dirname(bareId), path.resolve(themeFolder, themeName), console, opts);
    }
  };
}
function runWatchDog(watchDogPort, watchDogHost) {
  const client = net.Socket();
  client.setEncoding("utf8");
  client.on("error", function(err) {
    console.log("Watchdog connection error. Terminating vite process...", err);
    client.destroy();
    process.exit(0);
  });
  client.on("close", function() {
    client.destroy();
    runWatchDog(watchDogPort, watchDogHost);
  });
  client.connect(watchDogPort, watchDogHost || "localhost");
}
var allowedFrontendFolders = [frontendFolder, nodeModulesFolder];
function showRecompileReason() {
  return {
    name: "vaadin:why-you-compile",
    handleHotUpdate(context) {
      console.log("Recompiling because", context.file, "changed");
    }
  };
}
var DEV_MODE_START_REGEXP = /\/\*[\*!]\s+vaadin-dev-mode:start/;
var DEV_MODE_CODE_REGEXP = /\/\*[\*!]\s+vaadin-dev-mode:start([\s\S]*)vaadin-dev-mode:end\s+\*\*\//i;
function preserveUsageStats() {
  return {
    name: "vaadin:preserve-usage-stats",
    transform(src, id) {
      if (id.includes("vaadin-usage-statistics")) {
        if (src.includes("vaadin-dev-mode:start")) {
          const newSrc = src.replace(DEV_MODE_START_REGEXP, "/*! vaadin-dev-mode:start");
          if (newSrc === src) {
            console.error("Comment replacement failed to change anything");
          } else if (!newSrc.match(DEV_MODE_CODE_REGEXP)) {
            console.error("New comment fails to match original regexp");
          } else {
            return { code: newSrc };
          }
        }
      }
      return { code: src };
    }
  };
}
var vaadinConfig = (env) => {
  const devMode = env.mode === "development";
  const productionMode = !devMode && !devBundle;
  if (devMode && process.env.watchDogPort) {
    runWatchDog(process.env.watchDogPort, process.env.watchDogHost);
  }
  return {
    root: frontendFolder,
    base: "",
    publicDir: false,
    resolve: {
      alias: {
        "@vaadin/flow-frontend": jarResourcesFolder,
        Frontend: frontendFolder
      },
      preserveSymlinks: true
    },
    define: {
      OFFLINE_PATH: vaadin_dev_server_settings_default.offlinePath,
      VITE_ENABLED: "true"
    },
    server: {
      host: "127.0.0.1",
      strictPort: true,
      fs: {
        allow: allowedFrontendFolders
      }
    },
    build: {
      outDir: buildOutputFolder,
      emptyOutDir: devBundle,
      assetsDir: "VAADIN/build",
      rollupOptions: {
        input: {
          indexhtml: projectIndexHtml,
          ...hasExportedWebComponents ? { webcomponenthtml: path.resolve(frontendFolder, "web-component.html") } : {}
        },
        onwarn: (warning, defaultHandler) => {
          const ignoreEvalWarning = [
            "generated/jar-resources/FlowClient.js",
            "generated/jar-resources/vaadin-spreadsheet/spreadsheet-export.js",
            "@vaadin/charts/src/helpers.js"
          ];
          if (warning.code === "EVAL" && warning.id && !!ignoreEvalWarning.find((id) => warning.id.endsWith(id))) {
            return;
          }
          defaultHandler(warning);
        }
      }
    },
    optimizeDeps: {
      entries: [
        // Pre-scan entrypoints in Vite to avoid reloading on first open
        "generated/vaadin.ts"
      ],
      exclude: [
        "@vaadin/router",
        "@vaadin/vaadin-license-checker",
        "@vaadin/vaadin-usage-statistics",
        "workbox-core",
        "workbox-precaching",
        "workbox-routing",
        "workbox-strategies"
      ]
    },
    plugins: [
      productionMode && brotli(),
      devMode && vaadinBundlesPlugin(),
      devMode && showRecompileReason(),
      vaadin_dev_server_settings_default.offlineEnabled && buildSWPlugin({ devMode }),
      !devMode && statsExtracterPlugin(),
      !productionMode && preserveUsageStats(),
      themePlugin({ devMode }),
      postcssLit({
        include: ["**/*.css", /.*\/.*\.css\?.*/],
        exclude: [
          `${themeFolder}/**/*.css`,
          new RegExp(`${themeFolder}/.*/.*\\.css\\?.*`),
          `${themeResourceFolder}/**/*.css`,
          new RegExp(`${themeResourceFolder}/.*/.*\\.css\\?.*`),
          new RegExp(".*/.*\\?html-proxy.*")
        ]
      }),
      {
        name: "vaadin:force-remove-html-middleware",
        configureServer(server) {
          return () => {
            server.middlewares.stack = server.middlewares.stack.filter((mw) => {
              const handleName = `${mw.handle}`;
              return !handleName.includes("viteHtmlFallbackMiddleware");
            });
          };
        }
      },
      hasExportedWebComponents && {
        name: "vaadin:inject-entrypoints-to-web-component-html",
        transformIndexHtml: {
          order: "pre",
          handler(_html, { path: path2, server }) {
            if (path2 !== "/web-component.html") {
              return;
            }
            return [
              {
                tag: "script",
                attrs: { type: "module", src: `/generated/vaadin-web-component.ts` },
                injectTo: "head"
              }
            ];
          }
        }
      },
      {
        name: "vaadin:inject-entrypoints-to-index-html",
        transformIndexHtml: {
          order: "pre",
          handler(_html, { path: path2, server }) {
            if (path2 !== "/index.html") {
              return;
            }
            const scripts = [];
            if (devMode) {
              scripts.push({
                tag: "script",
                attrs: { type: "module", src: `/generated/vite-devmode.ts` },
                injectTo: "head"
              });
            }
            scripts.push({
              tag: "script",
              attrs: { type: "module", src: "/generated/vaadin.ts" },
              injectTo: "head"
            });
            return scripts;
          }
        }
      },
      checker({
        typescript: true
      }),
      productionMode && visualizer({ brotliSize: true, filename: bundleSizeFile })
    ]
  };
};
var overrideVaadinConfig = (customConfig2) => {
  return defineConfig((env) => mergeConfig(vaadinConfig(env), customConfig2(env)));
};
function getVersion(module) {
  const packageJson = path.resolve(nodeModulesFolder, module, "package.json");
  return JSON.parse(readFileSync4(packageJson, { encoding: "utf-8" })).version;
}
function getCvdlName(module) {
  const packageJson = path.resolve(nodeModulesFolder, module, "package.json");
  return JSON.parse(readFileSync4(packageJson, { encoding: "utf-8" })).cvdlName;
}

// vite.config.ts
var customConfig = (env) => ({
  // Here you can add custom Vite parameters
  // https://vitejs.dev/config/
});
var vite_config_default = overrideVaadinConfig(customConfig);
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5nZW5lcmF0ZWQudHMiLCAiYnVpbGQvcGx1Z2lucy9hcHBsaWNhdGlvbi10aGVtZS1wbHVnaW4vdGhlbWUtaGFuZGxlLmpzIiwgImJ1aWxkL3BsdWdpbnMvYXBwbGljYXRpb24tdGhlbWUtcGx1Z2luL3RoZW1lLWdlbmVyYXRvci5qcyIsICJidWlsZC9wbHVnaW5zL2FwcGxpY2F0aW9uLXRoZW1lLXBsdWdpbi90aGVtZS1jb3B5LmpzIiwgImJ1aWxkL3BsdWdpbnMvdGhlbWUtbG9hZGVyL3RoZW1lLWxvYWRlci11dGlscy5qcyIsICJidWlsZC92YWFkaW4tZGV2LXNlcnZlci1zZXR0aW5ncy5qc29uIiwgImJ1aWxkL3BsdWdpbnMvcm9sbHVwLXBsdWdpbi1wb3N0Y3NzLWxpdC1jdXN0b20vcm9sbHVwLXBsdWdpbi1wb3N0Y3NzLWxpdC5qcyIsICJ2aXRlLmNvbmZpZy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXEptaXhfcGFyc2VyXFxcXHBhcnNpbmdfd3BkXFxcXHBhcnNpbmdfd3BkXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxKbWl4X3BhcnNlclxcXFxwYXJzaW5nX3dwZFxcXFxwYXJzaW5nX3dwZFxcXFx2aXRlLmdlbmVyYXRlZC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovSm1peF9wYXJzZXIvcGFyc2luZ193cGQvcGFyc2luZ193cGQvdml0ZS5nZW5lcmF0ZWQudHNcIjsvKipcbiAqIE5PVElDRTogdGhpcyBpcyBhbiBhdXRvLWdlbmVyYXRlZCBmaWxlXG4gKlxuICogVGhpcyBmaWxlIGhhcyBiZWVuIGdlbmVyYXRlZCBieSB0aGUgYGZsb3c6cHJlcGFyZS1mcm9udGVuZGAgbWF2ZW4gZ29hbC5cbiAqIFRoaXMgZmlsZSB3aWxsIGJlIG92ZXJ3cml0dGVuIG9uIGV2ZXJ5IHJ1bi4gQW55IGN1c3RvbSBjaGFuZ2VzIHNob3VsZCBiZSBtYWRlIHRvIHZpdGUuY29uZmlnLnRzXG4gKi9cbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgZXhpc3RzU3luYywgbWtkaXJTeW5jLCByZWFkZGlyU3luYywgcmVhZEZpbGVTeW5jLCB3cml0ZUZpbGVTeW5jIH0gZnJvbSAnZnMnO1xuaW1wb3J0IHsgY3JlYXRlSGFzaCB9IGZyb20gJ2NyeXB0byc7XG5pbXBvcnQgKiBhcyBuZXQgZnJvbSAnbmV0JztcblxuaW1wb3J0IHsgcHJvY2Vzc1RoZW1lUmVzb3VyY2VzIH0gZnJvbSAnLi9idWlsZC9wbHVnaW5zL2FwcGxpY2F0aW9uLXRoZW1lLXBsdWdpbi90aGVtZS1oYW5kbGUuanMnO1xuaW1wb3J0IHsgcmV3cml0ZUNzc1VybHMgfSBmcm9tICcuL2J1aWxkL3BsdWdpbnMvdGhlbWUtbG9hZGVyL3RoZW1lLWxvYWRlci11dGlscy5qcyc7XG5pbXBvcnQgc2V0dGluZ3MgZnJvbSAnLi9idWlsZC92YWFkaW4tZGV2LXNlcnZlci1zZXR0aW5ncy5qc29uJztcbmltcG9ydCB7XG4gIEFzc2V0SW5mbyxcbiAgQ2h1bmtJbmZvLFxuICBkZWZpbmVDb25maWcsXG4gIG1lcmdlQ29uZmlnLFxuICBPdXRwdXRPcHRpb25zLFxuICBQbHVnaW5PcHRpb24sXG4gIFJlc29sdmVkQ29uZmlnLFxuICBVc2VyQ29uZmlnRm5cbn0gZnJvbSAndml0ZSc7XG5pbXBvcnQgeyBnZXRNYW5pZmVzdCB9IGZyb20gJ3dvcmtib3gtYnVpbGQnO1xuXG5pbXBvcnQgKiBhcyByb2xsdXAgZnJvbSAncm9sbHVwJztcbmltcG9ydCBicm90bGkgZnJvbSAncm9sbHVwLXBsdWdpbi1icm90bGknO1xuaW1wb3J0IHJlcGxhY2UgZnJvbSAnQHJvbGx1cC9wbHVnaW4tcmVwbGFjZSc7XG5pbXBvcnQgY2hlY2tlciBmcm9tICd2aXRlLXBsdWdpbi1jaGVja2VyJztcbmltcG9ydCBwb3N0Y3NzTGl0IGZyb20gJy4vYnVpbGQvcGx1Z2lucy9yb2xsdXAtcGx1Z2luLXBvc3Rjc3MtbGl0LWN1c3RvbS9yb2xsdXAtcGx1Z2luLXBvc3Rjc3MtbGl0LmpzJztcblxuaW1wb3J0IHsgY3JlYXRlUmVxdWlyZSB9IGZyb20gJ21vZHVsZSc7XG5cbmltcG9ydCB7IHZpc3VhbGl6ZXIgfSBmcm9tICdyb2xsdXAtcGx1Z2luLXZpc3VhbGl6ZXInO1xuXG4vLyBNYWtlIGByZXF1aXJlYCBjb21wYXRpYmxlIHdpdGggRVMgbW9kdWxlc1xuY29uc3QgcmVxdWlyZSA9IGNyZWF0ZVJlcXVpcmUoaW1wb3J0Lm1ldGEudXJsKTtcblxuY29uc3QgYXBwU2hlbGxVcmwgPSAnLic7XG5cbmNvbnN0IGZyb250ZW5kRm9sZGVyID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgc2V0dGluZ3MuZnJvbnRlbmRGb2xkZXIpO1xuY29uc3QgdGhlbWVGb2xkZXIgPSBwYXRoLnJlc29sdmUoZnJvbnRlbmRGb2xkZXIsIHNldHRpbmdzLnRoZW1lRm9sZGVyKTtcbmNvbnN0IGZyb250ZW5kQnVuZGxlRm9sZGVyID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgc2V0dGluZ3MuZnJvbnRlbmRCdW5kbGVPdXRwdXQpO1xuY29uc3QgZGV2QnVuZGxlRm9sZGVyID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgc2V0dGluZ3MuZGV2QnVuZGxlT3V0cHV0KTtcbmNvbnN0IGRldkJ1bmRsZSA9ICEhcHJvY2Vzcy5lbnYuZGV2QnVuZGxlO1xuY29uc3QgamFyUmVzb3VyY2VzRm9sZGVyID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgc2V0dGluZ3MuamFyUmVzb3VyY2VzRm9sZGVyKTtcbmNvbnN0IHRoZW1lUmVzb3VyY2VGb2xkZXIgPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBzZXR0aW5ncy50aGVtZVJlc291cmNlRm9sZGVyKTtcbmNvbnN0IHByb2plY3RQYWNrYWdlSnNvbkZpbGUgPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAncGFja2FnZS5qc29uJyk7XG5cbmNvbnN0IGJ1aWxkT3V0cHV0Rm9sZGVyID0gZGV2QnVuZGxlID8gZGV2QnVuZGxlRm9sZGVyIDogZnJvbnRlbmRCdW5kbGVGb2xkZXI7XG5jb25zdCBzdGF0c0ZvbGRlciA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIGRldkJ1bmRsZSA/IHNldHRpbmdzLmRldkJ1bmRsZVN0YXRzT3V0cHV0IDogc2V0dGluZ3Muc3RhdHNPdXRwdXQpO1xuY29uc3Qgc3RhdHNGaWxlID0gcGF0aC5yZXNvbHZlKHN0YXRzRm9sZGVyLCAnc3RhdHMuanNvbicpO1xuY29uc3QgYnVuZGxlU2l6ZUZpbGUgPSBwYXRoLnJlc29sdmUoc3RhdHNGb2xkZXIsICdidW5kbGUtc2l6ZS5odG1sJyk7XG5jb25zdCBub2RlTW9kdWxlc0ZvbGRlciA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdub2RlX21vZHVsZXMnKTtcbmNvbnN0IHdlYkNvbXBvbmVudFRhZ3MgPSAnJztcblxuY29uc3QgcHJvamVjdEluZGV4SHRtbCA9IHBhdGgucmVzb2x2ZShmcm9udGVuZEZvbGRlciwgJ2luZGV4Lmh0bWwnKTtcblxuY29uc3QgcHJvamVjdFN0YXRpY0Fzc2V0c0ZvbGRlcnMgPSBbXG4gIHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnLCAnbWFpbicsICdyZXNvdXJjZXMnLCAnTUVUQS1JTkYnLCAncmVzb3VyY2VzJyksXG4gIHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnLCAnbWFpbicsICdyZXNvdXJjZXMnLCAnc3RhdGljJyksXG4gIGZyb250ZW5kRm9sZGVyXG5dO1xuXG4vLyBGb2xkZXJzIGluIHRoZSBwcm9qZWN0IHdoaWNoIGNhbiBjb250YWluIGFwcGxpY2F0aW9uIHRoZW1lc1xuY29uc3QgdGhlbWVQcm9qZWN0Rm9sZGVycyA9IHByb2plY3RTdGF0aWNBc3NldHNGb2xkZXJzLm1hcCgoZm9sZGVyKSA9PiBwYXRoLnJlc29sdmUoZm9sZGVyLCBzZXR0aW5ncy50aGVtZUZvbGRlcikpO1xuXG5jb25zdCB0aGVtZU9wdGlvbnMgPSB7XG4gIGRldk1vZGU6IGZhbHNlLFxuICB1c2VEZXZCdW5kbGU6IGRldkJ1bmRsZSxcbiAgLy8gVGhlIGZvbGxvd2luZyBtYXRjaGVzIGZvbGRlciAnZnJvbnRlbmQvZ2VuZXJhdGVkL3RoZW1lcy8nXG4gIC8vIChub3QgJ2Zyb250ZW5kL3RoZW1lcycpIGZvciB0aGVtZSBpbiBKQVIgdGhhdCBpcyBjb3BpZWQgdGhlcmVcbiAgdGhlbWVSZXNvdXJjZUZvbGRlcjogcGF0aC5yZXNvbHZlKHRoZW1lUmVzb3VyY2VGb2xkZXIsIHNldHRpbmdzLnRoZW1lRm9sZGVyKSxcbiAgdGhlbWVQcm9qZWN0Rm9sZGVyczogdGhlbWVQcm9qZWN0Rm9sZGVycyxcbiAgcHJvamVjdFN0YXRpY0Fzc2V0c091dHB1dEZvbGRlcjogZGV2QnVuZGxlXG4gICAgPyBwYXRoLnJlc29sdmUoZGV2QnVuZGxlRm9sZGVyLCAnLi4vYXNzZXRzJylcbiAgICA6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIHNldHRpbmdzLnN0YXRpY091dHB1dCksXG4gIGZyb250ZW5kR2VuZXJhdGVkRm9sZGVyOiBwYXRoLnJlc29sdmUoZnJvbnRlbmRGb2xkZXIsIHNldHRpbmdzLmdlbmVyYXRlZEZvbGRlcilcbn07XG5cbmNvbnN0IGhhc0V4cG9ydGVkV2ViQ29tcG9uZW50cyA9IGV4aXN0c1N5bmMocGF0aC5yZXNvbHZlKGZyb250ZW5kRm9sZGVyLCAnd2ViLWNvbXBvbmVudC5odG1sJykpO1xuXG4vLyBCbG9jayBkZWJ1ZyBhbmQgdHJhY2UgbG9ncy5cbmNvbnNvbGUudHJhY2UgPSAoKSA9PiB7fTtcbmNvbnNvbGUuZGVidWcgPSAoKSA9PiB7fTtcblxuZnVuY3Rpb24gaW5qZWN0TWFuaWZlc3RUb1NXUGx1Z2luKCk6IHJvbGx1cC5QbHVnaW4ge1xuICBjb25zdCByZXdyaXRlTWFuaWZlc3RJbmRleEh0bWxVcmwgPSAobWFuaWZlc3QpID0+IHtcbiAgICBjb25zdCBpbmRleEVudHJ5ID0gbWFuaWZlc3QuZmluZCgoZW50cnkpID0+IGVudHJ5LnVybCA9PT0gJ2luZGV4Lmh0bWwnKTtcbiAgICBpZiAoaW5kZXhFbnRyeSkge1xuICAgICAgaW5kZXhFbnRyeS51cmwgPSBhcHBTaGVsbFVybDtcbiAgICB9XG5cbiAgICByZXR1cm4geyBtYW5pZmVzdCwgd2FybmluZ3M6IFtdIH07XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAndmFhZGluOmluamVjdC1tYW5pZmVzdC10by1zdycsXG4gICAgYXN5bmMgdHJhbnNmb3JtKGNvZGUsIGlkKSB7XG4gICAgICBpZiAoL3N3XFwuKHRzfGpzKSQvLnRlc3QoaWQpKSB7XG4gICAgICAgIGNvbnN0IHsgbWFuaWZlc3RFbnRyaWVzIH0gPSBhd2FpdCBnZXRNYW5pZmVzdCh7XG4gICAgICAgICAgZ2xvYkRpcmVjdG9yeTogYnVpbGRPdXRwdXRGb2xkZXIsXG4gICAgICAgICAgZ2xvYlBhdHRlcm5zOiBbJyoqLyonXSxcbiAgICAgICAgICBnbG9iSWdub3JlczogWycqKi8qLmJyJ10sXG4gICAgICAgICAgbWFuaWZlc3RUcmFuc2Zvcm1zOiBbcmV3cml0ZU1hbmlmZXN0SW5kZXhIdG1sVXJsXSxcbiAgICAgICAgICBtYXhpbXVtRmlsZVNpemVUb0NhY2hlSW5CeXRlczogMTAwICogMTAyNCAqIDEwMjQgLy8gMTAwbWIsXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBjb2RlLnJlcGxhY2UoJ3NlbGYuX19XQl9NQU5JRkVTVCcsIEpTT04uc3RyaW5naWZ5KG1hbmlmZXN0RW50cmllcykpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gYnVpbGRTV1BsdWdpbihvcHRzKTogUGx1Z2luT3B0aW9uIHtcbiAgbGV0IGNvbmZpZzogUmVzb2x2ZWRDb25maWc7XG4gIGNvbnN0IGRldk1vZGUgPSBvcHRzLmRldk1vZGU7XG5cbiAgY29uc3Qgc3dPYmogPSB7fTtcblxuICBhc3luYyBmdW5jdGlvbiBidWlsZChhY3Rpb246ICdnZW5lcmF0ZScgfCAnd3JpdGUnLCBhZGRpdGlvbmFsUGx1Z2luczogcm9sbHVwLlBsdWdpbltdID0gW10pIHtcbiAgICBjb25zdCBpbmNsdWRlZFBsdWdpbk5hbWVzID0gW1xuICAgICAgJ3ZpdGU6ZXNidWlsZCcsXG4gICAgICAncm9sbHVwLXBsdWdpbi1keW5hbWljLWltcG9ydC12YXJpYWJsZXMnLFxuICAgICAgJ3ZpdGU6ZXNidWlsZC10cmFuc3BpbGUnLFxuICAgICAgJ3ZpdGU6dGVyc2VyJ1xuICAgIF07XG4gICAgY29uc3QgcGx1Z2luczogcm9sbHVwLlBsdWdpbltdID0gY29uZmlnLnBsdWdpbnMuZmlsdGVyKChwKSA9PiB7XG4gICAgICByZXR1cm4gaW5jbHVkZWRQbHVnaW5OYW1lcy5pbmNsdWRlcyhwLm5hbWUpO1xuICAgIH0pO1xuICAgIGNvbnN0IHJlc29sdmVyID0gY29uZmlnLmNyZWF0ZVJlc29sdmVyKCk7XG4gICAgY29uc3QgcmVzb2x2ZVBsdWdpbjogcm9sbHVwLlBsdWdpbiA9IHtcbiAgICAgIG5hbWU6ICdyZXNvbHZlcicsXG4gICAgICByZXNvbHZlSWQoc291cmNlLCBpbXBvcnRlciwgX29wdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuIHJlc29sdmVyKHNvdXJjZSwgaW1wb3J0ZXIpO1xuICAgICAgfVxuICAgIH07XG4gICAgcGx1Z2lucy51bnNoaWZ0KHJlc29sdmVQbHVnaW4pOyAvLyBQdXQgcmVzb2x2ZSBmaXJzdFxuICAgIHBsdWdpbnMucHVzaChcbiAgICAgIHJlcGxhY2Uoe1xuICAgICAgICB2YWx1ZXM6IHtcbiAgICAgICAgICAncHJvY2Vzcy5lbnYuTk9ERV9FTlYnOiBKU09OLnN0cmluZ2lmeShjb25maWcubW9kZSksXG4gICAgICAgICAgLi4uY29uZmlnLmRlZmluZVxuICAgICAgICB9LFxuICAgICAgICBwcmV2ZW50QXNzaWdubWVudDogdHJ1ZVxuICAgICAgfSlcbiAgICApO1xuICAgIGlmIChhZGRpdGlvbmFsUGx1Z2lucykge1xuICAgICAgcGx1Z2lucy5wdXNoKC4uLmFkZGl0aW9uYWxQbHVnaW5zKTtcbiAgICB9XG4gICAgY29uc3QgYnVuZGxlID0gYXdhaXQgcm9sbHVwLnJvbGx1cCh7XG4gICAgICBpbnB1dDogcGF0aC5yZXNvbHZlKHNldHRpbmdzLmNsaWVudFNlcnZpY2VXb3JrZXJTb3VyY2UpLFxuICAgICAgcGx1Z2luc1xuICAgIH0pO1xuXG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBhd2FpdCBidW5kbGVbYWN0aW9uXSh7XG4gICAgICAgIGZpbGU6IHBhdGgucmVzb2x2ZShidWlsZE91dHB1dEZvbGRlciwgJ3N3LmpzJyksXG4gICAgICAgIGZvcm1hdDogJ2VzJyxcbiAgICAgICAgZXhwb3J0czogJ25vbmUnLFxuICAgICAgICBzb3VyY2VtYXA6IGNvbmZpZy5jb21tYW5kID09PSAnc2VydmUnIHx8IGNvbmZpZy5idWlsZC5zb3VyY2VtYXAsXG4gICAgICAgIGlubGluZUR5bmFtaWNJbXBvcnRzOiB0cnVlXG4gICAgICB9KTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgYXdhaXQgYnVuZGxlLmNsb3NlKCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAndmFhZGluOmJ1aWxkLXN3JyxcbiAgICBlbmZvcmNlOiAncG9zdCcsXG4gICAgYXN5bmMgY29uZmlnUmVzb2x2ZWQocmVzb2x2ZWRDb25maWcpIHtcbiAgICAgIGNvbmZpZyA9IHJlc29sdmVkQ29uZmlnO1xuICAgIH0sXG4gICAgYXN5bmMgYnVpbGRTdGFydCgpIHtcbiAgICAgIGlmIChkZXZNb2RlKSB7XG4gICAgICAgIGNvbnN0IHsgb3V0cHV0IH0gPSBhd2FpdCBidWlsZCgnZ2VuZXJhdGUnKTtcbiAgICAgICAgc3dPYmouY29kZSA9IG91dHB1dFswXS5jb2RlO1xuICAgICAgICBzd09iai5tYXAgPSBvdXRwdXRbMF0ubWFwO1xuICAgICAgfVxuICAgIH0sXG4gICAgYXN5bmMgbG9hZChpZCkge1xuICAgICAgaWYgKGlkLmVuZHNXaXRoKCdzdy5qcycpKSB7XG4gICAgICAgIHJldHVybiAnJztcbiAgICAgIH1cbiAgICB9LFxuICAgIGFzeW5jIHRyYW5zZm9ybShfY29kZSwgaWQpIHtcbiAgICAgIGlmIChpZC5lbmRzV2l0aCgnc3cuanMnKSkge1xuICAgICAgICByZXR1cm4gc3dPYmo7XG4gICAgICB9XG4gICAgfSxcbiAgICBhc3luYyBjbG9zZUJ1bmRsZSgpIHtcbiAgICAgIGlmICghZGV2TW9kZSkge1xuICAgICAgICBhd2FpdCBidWlsZCgnd3JpdGUnLCBbaW5qZWN0TWFuaWZlc3RUb1NXUGx1Z2luKCksIGJyb3RsaSgpXSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xufVxuXG5mdW5jdGlvbiBzdGF0c0V4dHJhY3RlclBsdWdpbigpOiBQbHVnaW5PcHRpb24ge1xuICBmdW5jdGlvbiBjb2xsZWN0VGhlbWVKc29uc0luRnJvbnRlbmQodGhlbWVKc29uQ29udGVudHM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4sIHRoZW1lTmFtZTogc3RyaW5nKSB7XG4gICAgY29uc3QgdGhlbWVKc29uID0gcGF0aC5yZXNvbHZlKGZyb250ZW5kRm9sZGVyLCBzZXR0aW5ncy50aGVtZUZvbGRlciwgdGhlbWVOYW1lLCAndGhlbWUuanNvbicpO1xuICAgIGlmIChleGlzdHNTeW5jKHRoZW1lSnNvbikpIHtcbiAgICAgIGNvbnN0IHRoZW1lSnNvbkNvbnRlbnQgPSByZWFkRmlsZVN5bmModGhlbWVKc29uLCB7IGVuY29kaW5nOiAndXRmLTgnIH0pLnJlcGxhY2UoL1xcclxcbi9nLCAnXFxuJyk7XG4gICAgICB0aGVtZUpzb25Db250ZW50c1t0aGVtZU5hbWVdID0gdGhlbWVKc29uQ29udGVudDtcbiAgICAgIGNvbnN0IHRoZW1lSnNvbk9iamVjdCA9IEpTT04ucGFyc2UodGhlbWVKc29uQ29udGVudCk7XG4gICAgICBpZiAodGhlbWVKc29uT2JqZWN0LnBhcmVudCkge1xuICAgICAgICBjb2xsZWN0VGhlbWVKc29uc0luRnJvbnRlbmQodGhlbWVKc29uQ29udGVudHMsIHRoZW1lSnNvbk9iamVjdC5wYXJlbnQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgbmFtZTogJ3ZhYWRpbjpzdGF0cycsXG4gICAgZW5mb3JjZTogJ3Bvc3QnLFxuICAgIGFzeW5jIHdyaXRlQnVuZGxlKG9wdGlvbnM6IE91dHB1dE9wdGlvbnMsIGJ1bmRsZTogeyBbZmlsZU5hbWU6IHN0cmluZ106IEFzc2V0SW5mbyB8IENodW5rSW5mbyB9KSB7XG4gICAgICBjb25zdCBtb2R1bGVzID0gT2JqZWN0LnZhbHVlcyhidW5kbGUpLmZsYXRNYXAoKGIpID0+IChiLm1vZHVsZXMgPyBPYmplY3Qua2V5cyhiLm1vZHVsZXMpIDogW10pKTtcbiAgICAgIGNvbnN0IG5vZGVNb2R1bGVzRm9sZGVycyA9IG1vZHVsZXNcbiAgICAgICAgLm1hcCgoaWQpID0+IGlkLnJlcGxhY2UoL1xcXFwvZywgJy8nKSlcbiAgICAgICAgLmZpbHRlcigoaWQpID0+IGlkLnN0YXJ0c1dpdGgobm9kZU1vZHVsZXNGb2xkZXIucmVwbGFjZSgvXFxcXC9nLCAnLycpKSlcbiAgICAgICAgLm1hcCgoaWQpID0+IGlkLnN1YnN0cmluZyhub2RlTW9kdWxlc0ZvbGRlci5sZW5ndGggKyAxKSk7XG4gICAgICBjb25zdCBucG1Nb2R1bGVzID0gbm9kZU1vZHVsZXNGb2xkZXJzXG4gICAgICAgIC5tYXAoKGlkKSA9PiBpZC5yZXBsYWNlKC9cXFxcL2csICcvJykpXG4gICAgICAgIC5tYXAoKGlkKSA9PiB7XG4gICAgICAgICAgY29uc3QgcGFydHMgPSBpZC5zcGxpdCgnLycpO1xuICAgICAgICAgIGlmIChpZC5zdGFydHNXaXRoKCdAJykpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXJ0c1swXSArICcvJyArIHBhcnRzWzFdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gcGFydHNbMF07XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAuc29ydCgpXG4gICAgICAgIC5maWx0ZXIoKHZhbHVlLCBpbmRleCwgc2VsZikgPT4gc2VsZi5pbmRleE9mKHZhbHVlKSA9PT0gaW5kZXgpO1xuICAgICAgY29uc3QgbnBtTW9kdWxlQW5kVmVyc2lvbiA9IE9iamVjdC5mcm9tRW50cmllcyhucG1Nb2R1bGVzLm1hcCgobW9kdWxlKSA9PiBbbW9kdWxlLCBnZXRWZXJzaW9uKG1vZHVsZSldKSk7XG4gICAgICBjb25zdCBjdmRscyA9IE9iamVjdC5mcm9tRW50cmllcyhcbiAgICAgICAgbnBtTW9kdWxlc1xuICAgICAgICAgIC5maWx0ZXIoKG1vZHVsZSkgPT4gZ2V0Q3ZkbE5hbWUobW9kdWxlKSAhPSBudWxsKVxuICAgICAgICAgIC5tYXAoKG1vZHVsZSkgPT4gW21vZHVsZSwgeyBuYW1lOiBnZXRDdmRsTmFtZShtb2R1bGUpLCB2ZXJzaW9uOiBnZXRWZXJzaW9uKG1vZHVsZSkgfV0pXG4gICAgICApO1xuXG4gICAgICBta2RpclN5bmMocGF0aC5kaXJuYW1lKHN0YXRzRmlsZSksIHsgcmVjdXJzaXZlOiB0cnVlIH0pO1xuICAgICAgY29uc3QgcHJvamVjdFBhY2thZ2VKc29uID0gSlNPTi5wYXJzZShyZWFkRmlsZVN5bmMocHJvamVjdFBhY2thZ2VKc29uRmlsZSwgeyBlbmNvZGluZzogJ3V0Zi04JyB9KSk7XG5cbiAgICAgIGNvbnN0IGVudHJ5U2NyaXB0cyA9IE9iamVjdC52YWx1ZXMoYnVuZGxlKVxuICAgICAgICAuZmlsdGVyKChidW5kbGUpID0+IGJ1bmRsZS5pc0VudHJ5KVxuICAgICAgICAubWFwKChidW5kbGUpID0+IGJ1bmRsZS5maWxlTmFtZSk7XG5cbiAgICAgIGNvbnN0IGdlbmVyYXRlZEluZGV4SHRtbCA9IHBhdGgucmVzb2x2ZShidWlsZE91dHB1dEZvbGRlciwgJ2luZGV4Lmh0bWwnKTtcbiAgICAgIGNvbnN0IGN1c3RvbUluZGV4RGF0YTogc3RyaW5nID0gcmVhZEZpbGVTeW5jKHByb2plY3RJbmRleEh0bWwsIHsgZW5jb2Rpbmc6ICd1dGYtOCcgfSk7XG4gICAgICBjb25zdCBnZW5lcmF0ZWRJbmRleERhdGE6IHN0cmluZyA9IHJlYWRGaWxlU3luYyhnZW5lcmF0ZWRJbmRleEh0bWwsIHtcbiAgICAgICAgZW5jb2Rpbmc6ICd1dGYtOCdcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBjdXN0b21JbmRleFJvd3MgPSBuZXcgU2V0KGN1c3RvbUluZGV4RGF0YS5zcGxpdCgvW1xcclxcbl0vKS5maWx0ZXIoKHJvdykgPT4gcm93LnRyaW0oKSAhPT0gJycpKTtcbiAgICAgIGNvbnN0IGdlbmVyYXRlZEluZGV4Um93cyA9IGdlbmVyYXRlZEluZGV4RGF0YS5zcGxpdCgvW1xcclxcbl0vKS5maWx0ZXIoKHJvdykgPT4gcm93LnRyaW0oKSAhPT0gJycpO1xuXG4gICAgICBjb25zdCByb3dzR2VuZXJhdGVkOiBzdHJpbmdbXSA9IFtdO1xuICAgICAgZ2VuZXJhdGVkSW5kZXhSb3dzLmZvckVhY2goKHJvdykgPT4ge1xuICAgICAgICBpZiAoIWN1c3RvbUluZGV4Um93cy5oYXMocm93KSkge1xuICAgICAgICAgIHJvd3NHZW5lcmF0ZWQucHVzaChyb3cpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgLy9BZnRlciBkZXYtYnVuZGxlIGJ1aWxkIGFkZCB1c2VkIEZsb3cgZnJvbnRlbmQgaW1wb3J0cyBKc01vZHVsZS9KYXZhU2NyaXB0L0Nzc0ltcG9ydFxuXG4gICAgICBjb25zdCBwYXJzZUltcG9ydHMgPSAoZmlsZW5hbWU6IHN0cmluZywgcmVzdWx0OiBTZXQ8c3RyaW5nPik6IHZvaWQgPT4ge1xuICAgICAgICBjb25zdCBjb250ZW50OiBzdHJpbmcgPSByZWFkRmlsZVN5bmMoZmlsZW5hbWUsIHsgZW5jb2Rpbmc6ICd1dGYtOCcgfSk7XG4gICAgICAgIGNvbnN0IGxpbmVzID0gY29udGVudC5zcGxpdCgnXFxuJyk7XG4gICAgICAgIGNvbnN0IHN0YXRpY0ltcG9ydHMgPSBsaW5lc1xuICAgICAgICAgIC5maWx0ZXIoKGxpbmUpID0+IGxpbmUuc3RhcnRzV2l0aCgnaW1wb3J0ICcpKVxuICAgICAgICAgIC5tYXAoKGxpbmUpID0+IGxpbmUuc3Vic3RyaW5nKGxpbmUuaW5kZXhPZihcIidcIikgKyAxLCBsaW5lLmxhc3RJbmRleE9mKFwiJ1wiKSkpXG4gICAgICAgICAgLm1hcCgobGluZSkgPT4gKGxpbmUuaW5jbHVkZXMoJz8nKSA/IGxpbmUuc3Vic3RyaW5nKDAsIGxpbmUubGFzdEluZGV4T2YoJz8nKSkgOiBsaW5lKSk7XG4gICAgICAgIGNvbnN0IGR5bmFtaWNJbXBvcnRzID0gbGluZXNcbiAgICAgICAgICAuZmlsdGVyKChsaW5lKSA9PiBsaW5lLmluY2x1ZGVzKCdpbXBvcnQoJykpXG4gICAgICAgICAgLm1hcCgobGluZSkgPT4gbGluZS5yZXBsYWNlKC8uKmltcG9ydFxcKC8sICcnKSlcbiAgICAgICAgICAubWFwKChsaW5lKSA9PiBsaW5lLnNwbGl0KC8nLylbMV0pXG4gICAgICAgICAgLm1hcCgobGluZSkgPT4gKGxpbmUuaW5jbHVkZXMoJz8nKSA/IGxpbmUuc3Vic3RyaW5nKDAsIGxpbmUubGFzdEluZGV4T2YoJz8nKSkgOiBsaW5lKSk7XG5cbiAgICAgICAgc3RhdGljSW1wb3J0cy5mb3JFYWNoKChzdGF0aWNJbXBvcnQpID0+IHJlc3VsdC5hZGQoc3RhdGljSW1wb3J0KSk7XG5cbiAgICAgICAgZHluYW1pY0ltcG9ydHMubWFwKChkeW5hbWljSW1wb3J0KSA9PiB7XG4gICAgICAgICAgY29uc3QgaW1wb3J0ZWRGaWxlID0gcGF0aC5yZXNvbHZlKHBhdGguZGlybmFtZShmaWxlbmFtZSksIGR5bmFtaWNJbXBvcnQpO1xuICAgICAgICAgIHBhcnNlSW1wb3J0cyhpbXBvcnRlZEZpbGUsIHJlc3VsdCk7XG4gICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgY29uc3QgZ2VuZXJhdGVkSW1wb3J0c1NldCA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuICAgICAgcGFyc2VJbXBvcnRzKFxuICAgICAgICBwYXRoLnJlc29sdmUodGhlbWVPcHRpb25zLmZyb250ZW5kR2VuZXJhdGVkRm9sZGVyLCAnZmxvdycsICdnZW5lcmF0ZWQtZmxvdy1pbXBvcnRzLmpzJyksXG4gICAgICAgIGdlbmVyYXRlZEltcG9ydHNTZXRcbiAgICAgICk7XG4gICAgICBjb25zdCBnZW5lcmF0ZWRJbXBvcnRzID0gQXJyYXkuZnJvbShnZW5lcmF0ZWRJbXBvcnRzU2V0KS5zb3J0KCk7XG5cbiAgICAgIGNvbnN0IGZyb250ZW5kRmlsZXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcblxuICAgICAgY29uc3QgcHJvamVjdEZpbGVFeHRlbnNpb25zID0gWycuanMnLCAnLmpzLm1hcCcsICcudHMnLCAnLnRzLm1hcCcsICcudHN4JywgJy50c3gubWFwJywgJy5jc3MnLCAnLmNzcy5tYXAnXTtcblxuICAgICAgY29uc3QgaXNUaGVtZUNvbXBvbmVudHNSZXNvdXJjZSA9IChpZDogc3RyaW5nKSA9PlxuICAgICAgICAgIGlkLnN0YXJ0c1dpdGgodGhlbWVPcHRpb25zLmZyb250ZW5kR2VuZXJhdGVkRm9sZGVyLnJlcGxhY2UoL1xcXFwvZywgJy8nKSlcbiAgICAgICAgICAgICAgJiYgaWQubWF0Y2goLy4qXFwvamFyLXJlc291cmNlc1xcL3RoZW1lc1xcL1teXFwvXStcXC9jb21wb25lbnRzXFwvLyk7XG5cbiAgICAgIGNvbnN0IGlzR2VuZXJhdGVkV2ViQ29tcG9uZW50UmVzb3VyY2UgPSAoaWQ6IHN0cmluZykgPT5cbiAgICAgICAgICBpZC5zdGFydHNXaXRoKHRoZW1lT3B0aW9ucy5mcm9udGVuZEdlbmVyYXRlZEZvbGRlci5yZXBsYWNlKC9cXFxcL2csICcvJykpXG4gICAgICAgICAgICAgICYmIGlkLm1hdGNoKC8uKlxcL2Zsb3dcXC93ZWItY29tcG9uZW50c1xcLy8pO1xuXG4gICAgICBjb25zdCBpc0Zyb250ZW5kUmVzb3VyY2VDb2xsZWN0ZWQgPSAoaWQ6IHN0cmluZykgPT5cbiAgICAgICAgICAhaWQuc3RhcnRzV2l0aCh0aGVtZU9wdGlvbnMuZnJvbnRlbmRHZW5lcmF0ZWRGb2xkZXIucmVwbGFjZSgvXFxcXC9nLCAnLycpKVxuICAgICAgICAgIHx8IGlzVGhlbWVDb21wb25lbnRzUmVzb3VyY2UoaWQpIFxuICAgICAgICAgIHx8IGlzR2VuZXJhdGVkV2ViQ29tcG9uZW50UmVzb3VyY2UoaWQpO1xuXG4gICAgICAvLyBjb2xsZWN0cyBwcm9qZWN0J3MgZnJvbnRlbmQgcmVzb3VyY2VzIGluIGZyb250ZW5kIGZvbGRlciwgZXhjbHVkaW5nXG4gICAgICAvLyAnZ2VuZXJhdGVkJyBzdWItZm9sZGVyLCBleGNlcHQgZm9yIGxlZ2FjeSBzaGFkb3cgRE9NIHN0eWxlc2hlZXRzXG4gICAgICAvLyBwYWNrYWdlZCBpbiBgdGhlbWUvY29tcG9uZW50cy9gIGZvbGRlclxuICAgICAgLy8gYW5kIGdlbmVyYXRlZCB3ZWIgY29tcG9uZW50IHJlc291cmNlcyBpbiBgZmxvdy93ZWItY29tcG9uZW50c2AgZm9sZGVyLlxuICAgICAgbW9kdWxlc1xuICAgICAgICAubWFwKChpZCkgPT4gaWQucmVwbGFjZSgvXFxcXC9nLCAnLycpKVxuICAgICAgICAuZmlsdGVyKChpZCkgPT4gaWQuc3RhcnRzV2l0aChmcm9udGVuZEZvbGRlci5yZXBsYWNlKC9cXFxcL2csICcvJykpKVxuICAgICAgICAuZmlsdGVyKGlzRnJvbnRlbmRSZXNvdXJjZUNvbGxlY3RlZClcbiAgICAgICAgLm1hcCgoaWQpID0+IGlkLnN1YnN0cmluZyhmcm9udGVuZEZvbGRlci5sZW5ndGggKyAxKSlcbiAgICAgICAgLm1hcCgobGluZTogc3RyaW5nKSA9PiAobGluZS5pbmNsdWRlcygnPycpID8gbGluZS5zdWJzdHJpbmcoMCwgbGluZS5sYXN0SW5kZXhPZignPycpKSA6IGxpbmUpKVxuICAgICAgICAuZm9yRWFjaCgobGluZTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgLy8gXFxyXFxuIGZyb20gd2luZG93cyBtYWRlIGZpbGVzIG1heSBiZSB1c2VkIHNvIGNoYW5nZSB0byBcXG5cbiAgICAgICAgICBjb25zdCBmaWxlUGF0aCA9IHBhdGgucmVzb2x2ZShmcm9udGVuZEZvbGRlciwgbGluZSk7XG4gICAgICAgICAgaWYgKHByb2plY3RGaWxlRXh0ZW5zaW9ucy5pbmNsdWRlcyhwYXRoLmV4dG5hbWUoZmlsZVBhdGgpKSkge1xuICAgICAgICAgICAgY29uc3QgZmlsZUJ1ZmZlciA9IHJlYWRGaWxlU3luYyhmaWxlUGF0aCwgeyBlbmNvZGluZzogJ3V0Zi04JyB9KS5yZXBsYWNlKC9cXHJcXG4vZywgJ1xcbicpO1xuICAgICAgICAgICAgZnJvbnRlbmRGaWxlc1tsaW5lXSA9IGNyZWF0ZUhhc2goJ3NoYTI1NicpLnVwZGF0ZShmaWxlQnVmZmVyLCAndXRmOCcpLmRpZ2VzdCgnaGV4Jyk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgLy8gY29sbGVjdHMgZnJvbnRlbmQgcmVzb3VyY2VzIGZyb20gdGhlIEpBUnNcbiAgICAgIGdlbmVyYXRlZEltcG9ydHNcbiAgICAgICAgLmZpbHRlcigobGluZTogc3RyaW5nKSA9PiBsaW5lLmluY2x1ZGVzKCdnZW5lcmF0ZWQvamFyLXJlc291cmNlcycpKVxuICAgICAgICAuZm9yRWFjaCgobGluZTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgbGV0IGZpbGVuYW1lID0gbGluZS5zdWJzdHJpbmcobGluZS5pbmRleE9mKCdnZW5lcmF0ZWQnKSk7XG4gICAgICAgICAgLy8gXFxyXFxuIGZyb20gd2luZG93cyBtYWRlIGZpbGVzIG1heSBiZSB1c2VkIHJvIHJlbW92ZSB0byBiZSBvbmx5IFxcblxuICAgICAgICAgIGNvbnN0IGZpbGVCdWZmZXIgPSByZWFkRmlsZVN5bmMocGF0aC5yZXNvbHZlKGZyb250ZW5kRm9sZGVyLCBmaWxlbmFtZSksIHsgZW5jb2Rpbmc6ICd1dGYtOCcgfSkucmVwbGFjZShcbiAgICAgICAgICAgIC9cXHJcXG4vZyxcbiAgICAgICAgICAgICdcXG4nXG4gICAgICAgICAgKTtcbiAgICAgICAgICBjb25zdCBoYXNoID0gY3JlYXRlSGFzaCgnc2hhMjU2JykudXBkYXRlKGZpbGVCdWZmZXIsICd1dGY4JykuZGlnZXN0KCdoZXgnKTtcblxuICAgICAgICAgIGNvbnN0IGZpbGVLZXkgPSBsaW5lLnN1YnN0cmluZyhsaW5lLmluZGV4T2YoJ2phci1yZXNvdXJjZXMvJykgKyAxNCk7XG4gICAgICAgICAgZnJvbnRlbmRGaWxlc1tmaWxlS2V5XSA9IGhhc2g7XG4gICAgICAgIH0pO1xuICAgICAgLy8gY29sbGVjdHMgYW5kIGhhc2ggcmVzdCBvZiB0aGUgRnJvbnRlbmQgcmVzb3VyY2VzIGV4Y2x1ZGluZyBmaWxlcyBpbiAvZ2VuZXJhdGVkLyBhbmQgL3RoZW1lcy8gXG4gICAgICAvLyBhbmQgZmlsZXMgYWxyZWFkeSBpbiBmcm9udGVuZEZpbGVzLlxuICAgICAgbGV0IGZyb250ZW5kRm9sZGVyQWxpYXMgPSBcIkZyb250ZW5kXCI7XG4gICAgICBnZW5lcmF0ZWRJbXBvcnRzXG4gICAgICAgIC5maWx0ZXIoKGxpbmU6IHN0cmluZykgPT4gbGluZS5zdGFydHNXaXRoKGZyb250ZW5kRm9sZGVyQWxpYXMgKyAnLycpKVxuICAgICAgICAuZmlsdGVyKChsaW5lOiBzdHJpbmcpID0+ICFsaW5lLnN0YXJ0c1dpdGgoZnJvbnRlbmRGb2xkZXJBbGlhcyArICcvZ2VuZXJhdGVkLycpKVxuICAgICAgICAuZmlsdGVyKChsaW5lOiBzdHJpbmcpID0+ICFsaW5lLnN0YXJ0c1dpdGgoZnJvbnRlbmRGb2xkZXJBbGlhcyArICcvdGhlbWVzLycpKVxuICAgICAgICAubWFwKChsaW5lKSA9PiBsaW5lLnN1YnN0cmluZyhmcm9udGVuZEZvbGRlckFsaWFzLmxlbmd0aCArIDEpKVxuICAgICAgICAuZmlsdGVyKChsaW5lOiBzdHJpbmcpID0+ICFmcm9udGVuZEZpbGVzW2xpbmVdKVxuICAgICAgICAuZm9yRWFjaCgobGluZTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgY29uc3QgZmlsZVBhdGggPSBwYXRoLnJlc29sdmUoZnJvbnRlbmRGb2xkZXIsIGxpbmUpO1xuICAgICAgICAgIGlmIChwcm9qZWN0RmlsZUV4dGVuc2lvbnMuaW5jbHVkZXMocGF0aC5leHRuYW1lKGZpbGVQYXRoKSkgJiYgZXhpc3RzU3luYyhmaWxlUGF0aCkpIHtcbiAgICAgICAgICAgIGNvbnN0IGZpbGVCdWZmZXIgPSByZWFkRmlsZVN5bmMoZmlsZVBhdGgsIHsgZW5jb2Rpbmc6ICd1dGYtOCcgfSkucmVwbGFjZSgvXFxyXFxuL2csICdcXG4nKTtcbiAgICAgICAgICAgIGZyb250ZW5kRmlsZXNbbGluZV0gPSBjcmVhdGVIYXNoKCdzaGEyNTYnKS51cGRhdGUoZmlsZUJ1ZmZlciwgJ3V0ZjgnKS5kaWdlc3QoJ2hleCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7ICAgICAgICBcbiAgICAgIC8vIElmIGEgaW5kZXgudHMgZXhpc3RzIGhhc2ggaXQgdG8gYmUgYWJsZSB0byBzZWUgaWYgaXQgY2hhbmdlcy5cbiAgICAgIGlmIChleGlzdHNTeW5jKHBhdGgucmVzb2x2ZShmcm9udGVuZEZvbGRlciwgJ2luZGV4LnRzJykpKSB7XG4gICAgICAgIGNvbnN0IGZpbGVCdWZmZXIgPSByZWFkRmlsZVN5bmMocGF0aC5yZXNvbHZlKGZyb250ZW5kRm9sZGVyLCAnaW5kZXgudHMnKSwgeyBlbmNvZGluZzogJ3V0Zi04JyB9KS5yZXBsYWNlKFxuICAgICAgICAgIC9cXHJcXG4vZyxcbiAgICAgICAgICAnXFxuJ1xuICAgICAgICApO1xuICAgICAgICBmcm9udGVuZEZpbGVzW2BpbmRleC50c2BdID0gY3JlYXRlSGFzaCgnc2hhMjU2JykudXBkYXRlKGZpbGVCdWZmZXIsICd1dGY4JykuZGlnZXN0KCdoZXgnKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgdGhlbWVKc29uQ29udGVudHM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgICAgIGNvbnN0IHRoZW1lc0ZvbGRlciA9IHBhdGgucmVzb2x2ZShqYXJSZXNvdXJjZXNGb2xkZXIsICd0aGVtZXMnKTtcbiAgICAgIGlmIChleGlzdHNTeW5jKHRoZW1lc0ZvbGRlcikpIHtcbiAgICAgICAgcmVhZGRpclN5bmModGhlbWVzRm9sZGVyKS5mb3JFYWNoKCh0aGVtZUZvbGRlcikgPT4ge1xuICAgICAgICAgIGNvbnN0IHRoZW1lSnNvbiA9IHBhdGgucmVzb2x2ZSh0aGVtZXNGb2xkZXIsIHRoZW1lRm9sZGVyLCAndGhlbWUuanNvbicpO1xuICAgICAgICAgIGlmIChleGlzdHNTeW5jKHRoZW1lSnNvbikpIHtcbiAgICAgICAgICAgIHRoZW1lSnNvbkNvbnRlbnRzW3BhdGguYmFzZW5hbWUodGhlbWVGb2xkZXIpXSA9IHJlYWRGaWxlU3luYyh0aGVtZUpzb24sIHsgZW5jb2Rpbmc6ICd1dGYtOCcgfSkucmVwbGFjZShcbiAgICAgICAgICAgICAgL1xcclxcbi9nLFxuICAgICAgICAgICAgICAnXFxuJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBjb2xsZWN0VGhlbWVKc29uc0luRnJvbnRlbmQodGhlbWVKc29uQ29udGVudHMsIHNldHRpbmdzLnRoZW1lTmFtZSk7XG5cbiAgICAgIGxldCB3ZWJDb21wb25lbnRzOiBzdHJpbmdbXSA9IFtdO1xuICAgICAgaWYgKHdlYkNvbXBvbmVudFRhZ3MpIHtcbiAgICAgICAgd2ViQ29tcG9uZW50cyA9IHdlYkNvbXBvbmVudFRhZ3Muc3BsaXQoJzsnKTtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc3RhdHMgPSB7XG4gICAgICAgIHBhY2thZ2VKc29uRGVwZW5kZW5jaWVzOiBwcm9qZWN0UGFja2FnZUpzb24uZGVwZW5kZW5jaWVzLFxuICAgICAgICBucG1Nb2R1bGVzOiBucG1Nb2R1bGVBbmRWZXJzaW9uLFxuICAgICAgICBidW5kbGVJbXBvcnRzOiBnZW5lcmF0ZWRJbXBvcnRzLFxuICAgICAgICBmcm9udGVuZEhhc2hlczogZnJvbnRlbmRGaWxlcyxcbiAgICAgICAgdGhlbWVKc29uQ29udGVudHM6IHRoZW1lSnNvbkNvbnRlbnRzLFxuICAgICAgICBlbnRyeVNjcmlwdHMsXG4gICAgICAgIHdlYkNvbXBvbmVudHMsXG4gICAgICAgIGN2ZGxNb2R1bGVzOiBjdmRscyxcbiAgICAgICAgcGFja2FnZUpzb25IYXNoOiBwcm9qZWN0UGFja2FnZUpzb24/LnZhYWRpbj8uaGFzaCxcbiAgICAgICAgaW5kZXhIdG1sR2VuZXJhdGVkOiByb3dzR2VuZXJhdGVkXG4gICAgICB9O1xuICAgICAgd3JpdGVGaWxlU3luYyhzdGF0c0ZpbGUsIEpTT04uc3RyaW5naWZ5KHN0YXRzLCBudWxsLCAxKSk7XG4gICAgfVxuICB9O1xufVxuZnVuY3Rpb24gdmFhZGluQnVuZGxlc1BsdWdpbigpOiBQbHVnaW5PcHRpb24ge1xuICB0eXBlIEV4cG9ydEluZm8gPVxuICAgIHwgc3RyaW5nXG4gICAgfCB7XG4gICAgICAgIG5hbWVzcGFjZT86IHN0cmluZztcbiAgICAgICAgc291cmNlOiBzdHJpbmc7XG4gICAgICB9O1xuXG4gIHR5cGUgRXhwb3NlSW5mbyA9IHtcbiAgICBleHBvcnRzOiBFeHBvcnRJbmZvW107XG4gIH07XG5cbiAgdHlwZSBQYWNrYWdlSW5mbyA9IHtcbiAgICB2ZXJzaW9uOiBzdHJpbmc7XG4gICAgZXhwb3NlczogUmVjb3JkPHN0cmluZywgRXhwb3NlSW5mbz47XG4gIH07XG5cbiAgdHlwZSBCdW5kbGVKc29uID0ge1xuICAgIHBhY2thZ2VzOiBSZWNvcmQ8c3RyaW5nLCBQYWNrYWdlSW5mbz47XG4gIH07XG5cbiAgY29uc3QgZGlzYWJsZWRNZXNzYWdlID0gJ1ZhYWRpbiBjb21wb25lbnQgZGVwZW5kZW5jeSBidW5kbGVzIGFyZSBkaXNhYmxlZC4nO1xuXG4gIGNvbnN0IG1vZHVsZXNEaXJlY3RvcnkgPSBub2RlTW9kdWxlc0ZvbGRlci5yZXBsYWNlKC9cXFxcL2csICcvJyk7XG5cbiAgbGV0IHZhYWRpbkJ1bmRsZUpzb246IEJ1bmRsZUpzb247XG5cbiAgZnVuY3Rpb24gcGFyc2VNb2R1bGVJZChpZDogc3RyaW5nKTogeyBwYWNrYWdlTmFtZTogc3RyaW5nOyBtb2R1bGVQYXRoOiBzdHJpbmcgfSB7XG4gICAgY29uc3QgW3Njb3BlLCBzY29wZWRQYWNrYWdlTmFtZV0gPSBpZC5zcGxpdCgnLycsIDMpO1xuICAgIGNvbnN0IHBhY2thZ2VOYW1lID0gc2NvcGUuc3RhcnRzV2l0aCgnQCcpID8gYCR7c2NvcGV9LyR7c2NvcGVkUGFja2FnZU5hbWV9YCA6IHNjb3BlO1xuICAgIGNvbnN0IG1vZHVsZVBhdGggPSBgLiR7aWQuc3Vic3RyaW5nKHBhY2thZ2VOYW1lLmxlbmd0aCl9YDtcbiAgICByZXR1cm4ge1xuICAgICAgcGFja2FnZU5hbWUsXG4gICAgICBtb2R1bGVQYXRoXG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEV4cG9ydHMoaWQ6IHN0cmluZyk6IHN0cmluZ1tdIHwgdW5kZWZpbmVkIHtcbiAgICBjb25zdCB7IHBhY2thZ2VOYW1lLCBtb2R1bGVQYXRoIH0gPSBwYXJzZU1vZHVsZUlkKGlkKTtcbiAgICBjb25zdCBwYWNrYWdlSW5mbyA9IHZhYWRpbkJ1bmRsZUpzb24ucGFja2FnZXNbcGFja2FnZU5hbWVdO1xuXG4gICAgaWYgKCFwYWNrYWdlSW5mbykgcmV0dXJuO1xuXG4gICAgY29uc3QgZXhwb3NlSW5mbzogRXhwb3NlSW5mbyA9IHBhY2thZ2VJbmZvLmV4cG9zZXNbbW9kdWxlUGF0aF07XG4gICAgaWYgKCFleHBvc2VJbmZvKSByZXR1cm47XG5cbiAgICBjb25zdCBleHBvcnRzU2V0ID0gbmV3IFNldDxzdHJpbmc+KCk7XG4gICAgZm9yIChjb25zdCBlIG9mIGV4cG9zZUluZm8uZXhwb3J0cykge1xuICAgICAgaWYgKHR5cGVvZiBlID09PSAnc3RyaW5nJykge1xuICAgICAgICBleHBvcnRzU2V0LmFkZChlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHsgbmFtZXNwYWNlLCBzb3VyY2UgfSA9IGU7XG4gICAgICAgIGlmIChuYW1lc3BhY2UpIHtcbiAgICAgICAgICBleHBvcnRzU2V0LmFkZChuYW1lc3BhY2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IHNvdXJjZUV4cG9ydHMgPSBnZXRFeHBvcnRzKHNvdXJjZSk7XG4gICAgICAgICAgaWYgKHNvdXJjZUV4cG9ydHMpIHtcbiAgICAgICAgICAgIHNvdXJjZUV4cG9ydHMuZm9yRWFjaCgoZSkgPT4gZXhwb3J0c1NldC5hZGQoZSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gQXJyYXkuZnJvbShleHBvcnRzU2V0KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEV4cG9ydEJpbmRpbmcoYmluZGluZzogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGJpbmRpbmcgPT09ICdkZWZhdWx0JyA/ICdfZGVmYXVsdCBhcyBkZWZhdWx0JyA6IGJpbmRpbmc7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRJbXBvcnRBc3NpZ21lbnQoYmluZGluZzogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGJpbmRpbmcgPT09ICdkZWZhdWx0JyA/ICdkZWZhdWx0OiBfZGVmYXVsdCcgOiBiaW5kaW5nO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAndmFhZGluOmJ1bmRsZXMnLFxuICAgIGVuZm9yY2U6ICdwcmUnLFxuICAgIGFwcGx5KGNvbmZpZywgeyBjb21tYW5kIH0pIHtcbiAgICAgIGlmIChjb21tYW5kICE9PSAnc2VydmUnKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHZhYWRpbkJ1bmRsZUpzb25QYXRoID0gcmVxdWlyZS5yZXNvbHZlKCdAdmFhZGluL2J1bmRsZXMvdmFhZGluLWJ1bmRsZS5qc29uJyk7XG4gICAgICAgIHZhYWRpbkJ1bmRsZUpzb24gPSBKU09OLnBhcnNlKHJlYWRGaWxlU3luYyh2YWFkaW5CdW5kbGVKc29uUGF0aCwgeyBlbmNvZGluZzogJ3V0ZjgnIH0pKTtcbiAgICAgIH0gY2F0Y2ggKGU6IHVua25vd24pIHtcbiAgICAgICAgaWYgKHR5cGVvZiBlID09PSAnb2JqZWN0JyAmJiAoZSBhcyB7IGNvZGU6IHN0cmluZyB9KS5jb2RlID09PSAnTU9EVUxFX05PVF9GT1VORCcpIHtcbiAgICAgICAgICB2YWFkaW5CdW5kbGVKc29uID0geyBwYWNrYWdlczoge30gfTtcbiAgICAgICAgICBjb25zb2xlLmluZm8oYEB2YWFkaW4vYnVuZGxlcyBucG0gcGFja2FnZSBpcyBub3QgZm91bmQsICR7ZGlzYWJsZWRNZXNzYWdlfWApO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHZlcnNpb25NaXNtYXRjaGVzOiBBcnJheTx7IG5hbWU6IHN0cmluZzsgYnVuZGxlZFZlcnNpb246IHN0cmluZzsgaW5zdGFsbGVkVmVyc2lvbjogc3RyaW5nIH0+ID0gW107XG4gICAgICBmb3IgKGNvbnN0IFtuYW1lLCBwYWNrYWdlSW5mb10gb2YgT2JqZWN0LmVudHJpZXModmFhZGluQnVuZGxlSnNvbi5wYWNrYWdlcykpIHtcbiAgICAgICAgbGV0IGluc3RhbGxlZFZlcnNpb246IHN0cmluZyB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25zdCB7IHZlcnNpb246IGJ1bmRsZWRWZXJzaW9uIH0gPSBwYWNrYWdlSW5mbztcbiAgICAgICAgICBjb25zdCBpbnN0YWxsZWRQYWNrYWdlSnNvbkZpbGUgPSBwYXRoLnJlc29sdmUobW9kdWxlc0RpcmVjdG9yeSwgbmFtZSwgJ3BhY2thZ2UuanNvbicpO1xuICAgICAgICAgIGNvbnN0IHBhY2thZ2VKc29uID0gSlNPTi5wYXJzZShyZWFkRmlsZVN5bmMoaW5zdGFsbGVkUGFja2FnZUpzb25GaWxlLCB7IGVuY29kaW5nOiAndXRmOCcgfSkpO1xuICAgICAgICAgIGluc3RhbGxlZFZlcnNpb24gPSBwYWNrYWdlSnNvbi52ZXJzaW9uO1xuICAgICAgICAgIGlmIChpbnN0YWxsZWRWZXJzaW9uICYmIGluc3RhbGxlZFZlcnNpb24gIT09IGJ1bmRsZWRWZXJzaW9uKSB7XG4gICAgICAgICAgICB2ZXJzaW9uTWlzbWF0Y2hlcy5wdXNoKHtcbiAgICAgICAgICAgICAgbmFtZSxcbiAgICAgICAgICAgICAgYnVuZGxlZFZlcnNpb24sXG4gICAgICAgICAgICAgIGluc3RhbGxlZFZlcnNpb25cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoXykge1xuICAgICAgICAgIC8vIGlnbm9yZSBwYWNrYWdlIG5vdCBmb3VuZFxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodmVyc2lvbk1pc21hdGNoZXMubGVuZ3RoKSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbyhgQHZhYWRpbi9idW5kbGVzIGhhcyB2ZXJzaW9uIG1pc21hdGNoZXMgd2l0aCBpbnN0YWxsZWQgcGFja2FnZXMsICR7ZGlzYWJsZWRNZXNzYWdlfWApO1xuICAgICAgICBjb25zb2xlLmluZm8oYFBhY2thZ2VzIHdpdGggdmVyc2lvbiBtaXNtYXRjaGVzOiAke0pTT04uc3RyaW5naWZ5KHZlcnNpb25NaXNtYXRjaGVzLCB1bmRlZmluZWQsIDIpfWApO1xuICAgICAgICB2YWFkaW5CdW5kbGVKc29uID0geyBwYWNrYWdlczoge30gfTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIGFzeW5jIGNvbmZpZyhjb25maWcpIHtcbiAgICAgIHJldHVybiBtZXJnZUNvbmZpZyhcbiAgICAgICAge1xuICAgICAgICAgIG9wdGltaXplRGVwczoge1xuICAgICAgICAgICAgZXhjbHVkZTogW1xuICAgICAgICAgICAgICAvLyBWYWFkaW4gYnVuZGxlXG4gICAgICAgICAgICAgICdAdmFhZGluL2J1bmRsZXMnLFxuICAgICAgICAgICAgICAuLi5PYmplY3Qua2V5cyh2YWFkaW5CdW5kbGVKc29uLnBhY2thZ2VzKSxcbiAgICAgICAgICAgICAgJ0B2YWFkaW4vdmFhZGluLW1hdGVyaWFsLXN0eWxlcydcbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGNvbmZpZ1xuICAgICAgKTtcbiAgICB9LFxuICAgIGxvYWQocmF3SWQpIHtcbiAgICAgIGNvbnN0IFtwYXRoLCBwYXJhbXNdID0gcmF3SWQuc3BsaXQoJz8nKTtcbiAgICAgIGlmICghcGF0aC5zdGFydHNXaXRoKG1vZHVsZXNEaXJlY3RvcnkpKSByZXR1cm47XG5cbiAgICAgIGNvbnN0IGlkID0gcGF0aC5zdWJzdHJpbmcobW9kdWxlc0RpcmVjdG9yeS5sZW5ndGggKyAxKTtcbiAgICAgIGNvbnN0IGJpbmRpbmdzID0gZ2V0RXhwb3J0cyhpZCk7XG4gICAgICBpZiAoYmluZGluZ3MgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuXG4gICAgICBjb25zdCBjYWNoZVN1ZmZpeCA9IHBhcmFtcyA/IGA/JHtwYXJhbXN9YCA6ICcnO1xuICAgICAgY29uc3QgYnVuZGxlUGF0aCA9IGBAdmFhZGluL2J1bmRsZXMvdmFhZGluLmpzJHtjYWNoZVN1ZmZpeH1gO1xuXG4gICAgICByZXR1cm4gYGltcG9ydCB7IGluaXQgYXMgVmFhZGluQnVuZGxlSW5pdCwgZ2V0IGFzIFZhYWRpbkJ1bmRsZUdldCB9IGZyb20gJyR7YnVuZGxlUGF0aH0nO1xuYXdhaXQgVmFhZGluQnVuZGxlSW5pdCgnZGVmYXVsdCcpO1xuY29uc3QgeyAke2JpbmRpbmdzLm1hcChnZXRJbXBvcnRBc3NpZ21lbnQpLmpvaW4oJywgJyl9IH0gPSAoYXdhaXQgVmFhZGluQnVuZGxlR2V0KCcuL25vZGVfbW9kdWxlcy8ke2lkfScpKSgpO1xuZXhwb3J0IHsgJHtiaW5kaW5ncy5tYXAoZ2V0RXhwb3J0QmluZGluZykuam9pbignLCAnKX0gfTtgO1xuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gdGhlbWVQbHVnaW4ob3B0cyk6IFBsdWdpbk9wdGlvbiB7XG4gIGNvbnN0IGZ1bGxUaGVtZU9wdGlvbnMgPSB7IC4uLnRoZW1lT3B0aW9ucywgZGV2TW9kZTogb3B0cy5kZXZNb2RlIH07XG4gIHJldHVybiB7XG4gICAgbmFtZTogJ3ZhYWRpbjp0aGVtZScsXG4gICAgY29uZmlnKCkge1xuICAgICAgcHJvY2Vzc1RoZW1lUmVzb3VyY2VzKGZ1bGxUaGVtZU9wdGlvbnMsIGNvbnNvbGUpO1xuICAgIH0sXG4gICAgY29uZmlndXJlU2VydmVyKHNlcnZlcikge1xuICAgICAgZnVuY3Rpb24gaGFuZGxlVGhlbWVGaWxlQ3JlYXRlRGVsZXRlKHRoZW1lRmlsZSwgc3RhdHMpIHtcbiAgICAgICAgaWYgKHRoZW1lRmlsZS5zdGFydHNXaXRoKHRoZW1lRm9sZGVyKSkge1xuICAgICAgICAgIGNvbnN0IGNoYW5nZWQgPSBwYXRoLnJlbGF0aXZlKHRoZW1lRm9sZGVyLCB0aGVtZUZpbGUpO1xuICAgICAgICAgIGNvbnNvbGUuZGVidWcoJ1RoZW1lIGZpbGUgJyArICghIXN0YXRzID8gJ2NyZWF0ZWQnIDogJ2RlbGV0ZWQnKSwgY2hhbmdlZCk7XG4gICAgICAgICAgcHJvY2Vzc1RoZW1lUmVzb3VyY2VzKGZ1bGxUaGVtZU9wdGlvbnMsIGNvbnNvbGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBzZXJ2ZXIud2F0Y2hlci5vbignYWRkJywgaGFuZGxlVGhlbWVGaWxlQ3JlYXRlRGVsZXRlKTtcbiAgICAgIHNlcnZlci53YXRjaGVyLm9uKCd1bmxpbmsnLCBoYW5kbGVUaGVtZUZpbGVDcmVhdGVEZWxldGUpO1xuICAgIH0sXG4gICAgaGFuZGxlSG90VXBkYXRlKGNvbnRleHQpIHtcbiAgICAgIGNvbnN0IGNvbnRleHRQYXRoID0gcGF0aC5yZXNvbHZlKGNvbnRleHQuZmlsZSk7XG4gICAgICBjb25zdCB0aGVtZVBhdGggPSBwYXRoLnJlc29sdmUodGhlbWVGb2xkZXIpO1xuICAgICAgaWYgKGNvbnRleHRQYXRoLnN0YXJ0c1dpdGgodGhlbWVQYXRoKSkge1xuICAgICAgICBjb25zdCBjaGFuZ2VkID0gcGF0aC5yZWxhdGl2ZSh0aGVtZVBhdGgsIGNvbnRleHRQYXRoKTtcblxuICAgICAgICBjb25zb2xlLmRlYnVnKCdUaGVtZSBmaWxlIGNoYW5nZWQnLCBjaGFuZ2VkKTtcblxuICAgICAgICBpZiAoY2hhbmdlZC5zdGFydHNXaXRoKHNldHRpbmdzLnRoZW1lTmFtZSkpIHtcbiAgICAgICAgICBwcm9jZXNzVGhlbWVSZXNvdXJjZXMoZnVsbFRoZW1lT3B0aW9ucywgY29uc29sZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGFzeW5jIHJlc29sdmVJZChpZCwgaW1wb3J0ZXIpIHtcbiAgICAgIC8vIGZvcmNlIHRoZW1lIGdlbmVyYXRpb24gaWYgZ2VuZXJhdGVkIHRoZW1lIHNvdXJjZXMgZG9lcyBub3QgeWV0IGV4aXN0XG4gICAgICAvLyB0aGlzIG1heSBoYXBwZW4gZm9yIGV4YW1wbGUgZHVyaW5nIEphdmEgaG90IHJlbG9hZCB3aGVuIHVwZGF0aW5nXG4gICAgICAvLyBAVGhlbWUgYW5ub3RhdGlvbiB2YWx1ZVxuICAgICAgaWYgKFxuICAgICAgICBwYXRoLnJlc29sdmUodGhlbWVPcHRpb25zLmZyb250ZW5kR2VuZXJhdGVkRm9sZGVyLCAndGhlbWUuanMnKSA9PT0gaW1wb3J0ZXIgJiZcbiAgICAgICAgIWV4aXN0c1N5bmMocGF0aC5yZXNvbHZlKHRoZW1lT3B0aW9ucy5mcm9udGVuZEdlbmVyYXRlZEZvbGRlciwgaWQpKVxuICAgICAgKSB7XG4gICAgICAgIGNvbnNvbGUuZGVidWcoJ0dlbmVyYXRlIHRoZW1lIGZpbGUgJyArIGlkICsgJyBub3QgZXhpc3RpbmcuIFByb2Nlc3NpbmcgdGhlbWUgcmVzb3VyY2UnKTtcbiAgICAgICAgcHJvY2Vzc1RoZW1lUmVzb3VyY2VzKGZ1bGxUaGVtZU9wdGlvbnMsIGNvbnNvbGUpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoIWlkLnN0YXJ0c1dpdGgoc2V0dGluZ3MudGhlbWVGb2xkZXIpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgZm9yIChjb25zdCBsb2NhdGlvbiBvZiBbdGhlbWVSZXNvdXJjZUZvbGRlciwgZnJvbnRlbmRGb2xkZXJdKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IHRoaXMucmVzb2x2ZShwYXRoLnJlc29sdmUobG9jYXRpb24sIGlkKSk7XG4gICAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBhc3luYyB0cmFuc2Zvcm0ocmF3LCBpZCwgb3B0aW9ucykge1xuICAgICAgLy8gcmV3cml0ZSB1cmxzIGZvciB0aGUgYXBwbGljYXRpb24gdGhlbWUgY3NzIGZpbGVzXG4gICAgICBjb25zdCBbYmFyZUlkLCBxdWVyeV0gPSBpZC5zcGxpdCgnPycpO1xuICAgICAgaWYgKFxuICAgICAgICAoIWJhcmVJZD8uc3RhcnRzV2l0aCh0aGVtZUZvbGRlcikgJiYgIWJhcmVJZD8uc3RhcnRzV2l0aCh0aGVtZU9wdGlvbnMudGhlbWVSZXNvdXJjZUZvbGRlcikpIHx8XG4gICAgICAgICFiYXJlSWQ/LmVuZHNXaXRoKCcuY3NzJylcbiAgICAgICkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCBbdGhlbWVOYW1lXSA9IGJhcmVJZC5zdWJzdHJpbmcodGhlbWVGb2xkZXIubGVuZ3RoICsgMSkuc3BsaXQoJy8nKTtcbiAgICAgIHJldHVybiByZXdyaXRlQ3NzVXJscyhyYXcsIHBhdGguZGlybmFtZShiYXJlSWQpLCBwYXRoLnJlc29sdmUodGhlbWVGb2xkZXIsIHRoZW1lTmFtZSksIGNvbnNvbGUsIG9wdHMpO1xuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gcnVuV2F0Y2hEb2cod2F0Y2hEb2dQb3J0LCB3YXRjaERvZ0hvc3QpIHtcbiAgY29uc3QgY2xpZW50ID0gbmV0LlNvY2tldCgpO1xuICBjbGllbnQuc2V0RW5jb2RpbmcoJ3V0ZjgnKTtcbiAgY2xpZW50Lm9uKCdlcnJvcicsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICBjb25zb2xlLmxvZygnV2F0Y2hkb2cgY29ubmVjdGlvbiBlcnJvci4gVGVybWluYXRpbmcgdml0ZSBwcm9jZXNzLi4uJywgZXJyKTtcbiAgICBjbGllbnQuZGVzdHJveSgpO1xuICAgIHByb2Nlc3MuZXhpdCgwKTtcbiAgfSk7XG4gIGNsaWVudC5vbignY2xvc2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgY2xpZW50LmRlc3Ryb3koKTtcbiAgICBydW5XYXRjaERvZyh3YXRjaERvZ1BvcnQsIHdhdGNoRG9nSG9zdCk7XG4gIH0pO1xuXG4gIGNsaWVudC5jb25uZWN0KHdhdGNoRG9nUG9ydCwgd2F0Y2hEb2dIb3N0IHx8ICdsb2NhbGhvc3QnKTtcbn1cblxuY29uc3QgYWxsb3dlZEZyb250ZW5kRm9sZGVycyA9IFtmcm9udGVuZEZvbGRlciwgbm9kZU1vZHVsZXNGb2xkZXJdO1xuXG5mdW5jdGlvbiBzaG93UmVjb21waWxlUmVhc29uKCk6IFBsdWdpbk9wdGlvbiB7XG4gIHJldHVybiB7XG4gICAgbmFtZTogJ3ZhYWRpbjp3aHkteW91LWNvbXBpbGUnLFxuICAgIGhhbmRsZUhvdFVwZGF0ZShjb250ZXh0KSB7XG4gICAgICBjb25zb2xlLmxvZygnUmVjb21waWxpbmcgYmVjYXVzZScsIGNvbnRleHQuZmlsZSwgJ2NoYW5nZWQnKTtcbiAgICB9XG4gIH07XG59XG5cbmNvbnN0IERFVl9NT0RFX1NUQVJUX1JFR0VYUCA9IC9cXC9cXCpbXFwqIV1cXHMrdmFhZGluLWRldi1tb2RlOnN0YXJ0LztcbmNvbnN0IERFVl9NT0RFX0NPREVfUkVHRVhQID0gL1xcL1xcKltcXCohXVxccyt2YWFkaW4tZGV2LW1vZGU6c3RhcnQoW1xcc1xcU10qKXZhYWRpbi1kZXYtbW9kZTplbmRcXHMrXFwqXFwqXFwvL2k7XG5cbmZ1bmN0aW9uIHByZXNlcnZlVXNhZ2VTdGF0cygpIHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAndmFhZGluOnByZXNlcnZlLXVzYWdlLXN0YXRzJyxcblxuICAgIHRyYW5zZm9ybShzcmM6IHN0cmluZywgaWQ6IHN0cmluZykge1xuICAgICAgaWYgKGlkLmluY2x1ZGVzKCd2YWFkaW4tdXNhZ2Utc3RhdGlzdGljcycpKSB7XG4gICAgICAgIGlmIChzcmMuaW5jbHVkZXMoJ3ZhYWRpbi1kZXYtbW9kZTpzdGFydCcpKSB7XG4gICAgICAgICAgY29uc3QgbmV3U3JjID0gc3JjLnJlcGxhY2UoREVWX01PREVfU1RBUlRfUkVHRVhQLCAnLyohIHZhYWRpbi1kZXYtbW9kZTpzdGFydCcpO1xuICAgICAgICAgIGlmIChuZXdTcmMgPT09IHNyYykge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignQ29tbWVudCByZXBsYWNlbWVudCBmYWlsZWQgdG8gY2hhbmdlIGFueXRoaW5nJyk7XG4gICAgICAgICAgfSBlbHNlIGlmICghbmV3U3JjLm1hdGNoKERFVl9NT0RFX0NPREVfUkVHRVhQKSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignTmV3IGNvbW1lbnQgZmFpbHMgdG8gbWF0Y2ggb3JpZ2luYWwgcmVnZXhwJyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB7IGNvZGU6IG5ld1NyYyB9O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4geyBjb2RlOiBzcmMgfTtcbiAgICB9XG4gIH07XG59XG5cbmV4cG9ydCBjb25zdCB2YWFkaW5Db25maWc6IFVzZXJDb25maWdGbiA9IChlbnYpID0+IHtcbiAgY29uc3QgZGV2TW9kZSA9IGVudi5tb2RlID09PSAnZGV2ZWxvcG1lbnQnO1xuICBjb25zdCBwcm9kdWN0aW9uTW9kZSA9ICFkZXZNb2RlICYmICFkZXZCdW5kbGVcblxuICBpZiAoZGV2TW9kZSAmJiBwcm9jZXNzLmVudi53YXRjaERvZ1BvcnQpIHtcbiAgICAvLyBPcGVuIGEgY29ubmVjdGlvbiB3aXRoIHRoZSBKYXZhIGRldi1tb2RlIGhhbmRsZXIgaW4gb3JkZXIgdG8gZmluaXNoXG4gICAgLy8gdml0ZSB3aGVuIGl0IGV4aXRzIG9yIGNyYXNoZXMuXG4gICAgcnVuV2F0Y2hEb2cocHJvY2Vzcy5lbnYud2F0Y2hEb2dQb3J0LCBwcm9jZXNzLmVudi53YXRjaERvZ0hvc3QpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICByb290OiBmcm9udGVuZEZvbGRlcixcbiAgICBiYXNlOiAnJyxcbiAgICBwdWJsaWNEaXI6IGZhbHNlLFxuICAgIHJlc29sdmU6IHtcbiAgICAgIGFsaWFzOiB7XG4gICAgICAgICdAdmFhZGluL2Zsb3ctZnJvbnRlbmQnOiBqYXJSZXNvdXJjZXNGb2xkZXIsXG4gICAgICAgIEZyb250ZW5kOiBmcm9udGVuZEZvbGRlclxuICAgICAgfSxcbiAgICAgIHByZXNlcnZlU3ltbGlua3M6IHRydWVcbiAgICB9LFxuICAgIGRlZmluZToge1xuICAgICAgT0ZGTElORV9QQVRIOiBzZXR0aW5ncy5vZmZsaW5lUGF0aCxcbiAgICAgIFZJVEVfRU5BQkxFRDogJ3RydWUnXG4gICAgfSxcbiAgICBzZXJ2ZXI6IHtcbiAgICAgIGhvc3Q6ICcxMjcuMC4wLjEnLFxuICAgICAgc3RyaWN0UG9ydDogdHJ1ZSxcbiAgICAgIGZzOiB7XG4gICAgICAgIGFsbG93OiBhbGxvd2VkRnJvbnRlbmRGb2xkZXJzXG4gICAgICB9XG4gICAgfSxcbiAgICBidWlsZDoge1xuICAgICAgb3V0RGlyOiBidWlsZE91dHB1dEZvbGRlcixcbiAgICAgIGVtcHR5T3V0RGlyOiBkZXZCdW5kbGUsXG4gICAgICBhc3NldHNEaXI6ICdWQUFESU4vYnVpbGQnLFxuICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICBpbnB1dDoge1xuICAgICAgICAgIGluZGV4aHRtbDogcHJvamVjdEluZGV4SHRtbCxcblxuICAgICAgICAgIC4uLihoYXNFeHBvcnRlZFdlYkNvbXBvbmVudHMgPyB7IHdlYmNvbXBvbmVudGh0bWw6IHBhdGgucmVzb2x2ZShmcm9udGVuZEZvbGRlciwgJ3dlYi1jb21wb25lbnQuaHRtbCcpIH0gOiB7fSlcbiAgICAgICAgfSxcbiAgICAgICAgb253YXJuOiAod2FybmluZzogcm9sbHVwLlJvbGx1cFdhcm5pbmcsIGRlZmF1bHRIYW5kbGVyOiByb2xsdXAuV2FybmluZ0hhbmRsZXIpID0+IHtcbiAgICAgICAgICBjb25zdCBpZ25vcmVFdmFsV2FybmluZyA9IFtcbiAgICAgICAgICAgICdnZW5lcmF0ZWQvamFyLXJlc291cmNlcy9GbG93Q2xpZW50LmpzJyxcbiAgICAgICAgICAgICdnZW5lcmF0ZWQvamFyLXJlc291cmNlcy92YWFkaW4tc3ByZWFkc2hlZXQvc3ByZWFkc2hlZXQtZXhwb3J0LmpzJyxcbiAgICAgICAgICAgICdAdmFhZGluL2NoYXJ0cy9zcmMvaGVscGVycy5qcydcbiAgICAgICAgICBdO1xuICAgICAgICAgIGlmICh3YXJuaW5nLmNvZGUgPT09ICdFVkFMJyAmJiB3YXJuaW5nLmlkICYmICEhaWdub3JlRXZhbFdhcm5pbmcuZmluZCgoaWQpID0+IHdhcm5pbmcuaWQuZW5kc1dpdGgoaWQpKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBkZWZhdWx0SGFuZGxlcih3YXJuaW5nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgb3B0aW1pemVEZXBzOiB7XG4gICAgICBlbnRyaWVzOiBbXG4gICAgICAgIC8vIFByZS1zY2FuIGVudHJ5cG9pbnRzIGluIFZpdGUgdG8gYXZvaWQgcmVsb2FkaW5nIG9uIGZpcnN0IG9wZW5cbiAgICAgICAgJ2dlbmVyYXRlZC92YWFkaW4udHMnXG4gICAgICBdLFxuICAgICAgZXhjbHVkZTogW1xuICAgICAgICAnQHZhYWRpbi9yb3V0ZXInLFxuICAgICAgICAnQHZhYWRpbi92YWFkaW4tbGljZW5zZS1jaGVja2VyJyxcbiAgICAgICAgJ0B2YWFkaW4vdmFhZGluLXVzYWdlLXN0YXRpc3RpY3MnLFxuICAgICAgICAnd29ya2JveC1jb3JlJyxcbiAgICAgICAgJ3dvcmtib3gtcHJlY2FjaGluZycsXG4gICAgICAgICd3b3JrYm94LXJvdXRpbmcnLFxuICAgICAgICAnd29ya2JveC1zdHJhdGVnaWVzJ1xuICAgICAgXVxuICAgIH0sXG4gICAgcGx1Z2luczogW1xuICAgICAgcHJvZHVjdGlvbk1vZGUgJiYgYnJvdGxpKCksXG4gICAgICBkZXZNb2RlICYmIHZhYWRpbkJ1bmRsZXNQbHVnaW4oKSxcbiAgICAgIGRldk1vZGUgJiYgc2hvd1JlY29tcGlsZVJlYXNvbigpLFxuICAgICAgc2V0dGluZ3Mub2ZmbGluZUVuYWJsZWQgJiYgYnVpbGRTV1BsdWdpbih7IGRldk1vZGUgfSksXG4gICAgICAhZGV2TW9kZSAmJiBzdGF0c0V4dHJhY3RlclBsdWdpbigpLFxuICAgICAgIXByb2R1Y3Rpb25Nb2RlICYmIHByZXNlcnZlVXNhZ2VTdGF0cygpLFxuICAgICAgdGhlbWVQbHVnaW4oeyBkZXZNb2RlIH0pLFxuICAgICAgcG9zdGNzc0xpdCh7XG4gICAgICAgIGluY2x1ZGU6IFsnKiovKi5jc3MnLCAvLipcXC8uKlxcLmNzc1xcPy4qL10sXG4gICAgICAgIGV4Y2x1ZGU6IFtcbiAgICAgICAgICBgJHt0aGVtZUZvbGRlcn0vKiovKi5jc3NgLFxuICAgICAgICAgIG5ldyBSZWdFeHAoYCR7dGhlbWVGb2xkZXJ9Ly4qLy4qXFxcXC5jc3NcXFxcPy4qYCksXG4gICAgICAgICAgYCR7dGhlbWVSZXNvdXJjZUZvbGRlcn0vKiovKi5jc3NgLFxuICAgICAgICAgIG5ldyBSZWdFeHAoYCR7dGhlbWVSZXNvdXJjZUZvbGRlcn0vLiovLipcXFxcLmNzc1xcXFw/LipgKSxcbiAgICAgICAgICBuZXcgUmVnRXhwKCcuKi8uKlxcXFw/aHRtbC1wcm94eS4qJylcbiAgICAgICAgXVxuICAgICAgfSksXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICd2YWFkaW46Zm9yY2UtcmVtb3ZlLWh0bWwtbWlkZGxld2FyZScsXG4gICAgICAgIGNvbmZpZ3VyZVNlcnZlcihzZXJ2ZXIpIHtcbiAgICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgc2VydmVyLm1pZGRsZXdhcmVzLnN0YWNrID0gc2VydmVyLm1pZGRsZXdhcmVzLnN0YWNrLmZpbHRlcigobXcpID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgaGFuZGxlTmFtZSA9IGAke213LmhhbmRsZX1gO1xuICAgICAgICAgICAgICByZXR1cm4gIWhhbmRsZU5hbWUuaW5jbHVkZXMoJ3ZpdGVIdG1sRmFsbGJhY2tNaWRkbGV3YXJlJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9O1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIGhhc0V4cG9ydGVkV2ViQ29tcG9uZW50cyAmJiB7XG4gICAgICAgIG5hbWU6ICd2YWFkaW46aW5qZWN0LWVudHJ5cG9pbnRzLXRvLXdlYi1jb21wb25lbnQtaHRtbCcsXG4gICAgICAgIHRyYW5zZm9ybUluZGV4SHRtbDoge1xuICAgICAgICAgIG9yZGVyOiAncHJlJyxcbiAgICAgICAgICBoYW5kbGVyKF9odG1sLCB7IHBhdGgsIHNlcnZlciB9KSB7XG4gICAgICAgICAgICBpZiAocGF0aCAhPT0gJy93ZWItY29tcG9uZW50Lmh0bWwnKSB7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRhZzogJ3NjcmlwdCcsXG4gICAgICAgICAgICAgICAgYXR0cnM6IHsgdHlwZTogJ21vZHVsZScsIHNyYzogYC9nZW5lcmF0ZWQvdmFhZGluLXdlYi1jb21wb25lbnQudHNgIH0sXG4gICAgICAgICAgICAgICAgaW5qZWN0VG86ICdoZWFkJ1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ3ZhYWRpbjppbmplY3QtZW50cnlwb2ludHMtdG8taW5kZXgtaHRtbCcsXG4gICAgICAgIHRyYW5zZm9ybUluZGV4SHRtbDoge1xuICAgICAgICAgIG9yZGVyOiAncHJlJyxcbiAgICAgICAgICBoYW5kbGVyKF9odG1sLCB7IHBhdGgsIHNlcnZlciB9KSB7XG4gICAgICAgICAgICBpZiAocGF0aCAhPT0gJy9pbmRleC5odG1sJykge1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IHNjcmlwdHMgPSBbXTtcblxuICAgICAgICAgICAgaWYgKGRldk1vZGUpIHtcbiAgICAgICAgICAgICAgc2NyaXB0cy5wdXNoKHtcbiAgICAgICAgICAgICAgICB0YWc6ICdzY3JpcHQnLFxuICAgICAgICAgICAgICAgIGF0dHJzOiB7IHR5cGU6ICdtb2R1bGUnLCBzcmM6IGAvZ2VuZXJhdGVkL3ZpdGUtZGV2bW9kZS50c2AgfSxcbiAgICAgICAgICAgICAgICBpbmplY3RUbzogJ2hlYWQnXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2NyaXB0cy5wdXNoKHtcbiAgICAgICAgICAgICAgdGFnOiAnc2NyaXB0JyxcbiAgICAgICAgICAgICAgYXR0cnM6IHsgdHlwZTogJ21vZHVsZScsIHNyYzogJy9nZW5lcmF0ZWQvdmFhZGluLnRzJyB9LFxuICAgICAgICAgICAgICBpbmplY3RUbzogJ2hlYWQnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBzY3JpcHRzO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGNoZWNrZXIoe1xuICAgICAgICB0eXBlc2NyaXB0OiB0cnVlXG4gICAgICB9KSxcbiAgICAgIHByb2R1Y3Rpb25Nb2RlICYmIHZpc3VhbGl6ZXIoeyBicm90bGlTaXplOiB0cnVlLCBmaWxlbmFtZTogYnVuZGxlU2l6ZUZpbGUgfSlcbiAgICBdXG4gIH07XG59O1xuXG5leHBvcnQgY29uc3Qgb3ZlcnJpZGVWYWFkaW5Db25maWcgPSAoY3VzdG9tQ29uZmlnOiBVc2VyQ29uZmlnRm4pID0+IHtcbiAgcmV0dXJuIGRlZmluZUNvbmZpZygoZW52KSA9PiBtZXJnZUNvbmZpZyh2YWFkaW5Db25maWcoZW52KSwgY3VzdG9tQ29uZmlnKGVudikpKTtcbn07XG5mdW5jdGlvbiBnZXRWZXJzaW9uKG1vZHVsZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3QgcGFja2FnZUpzb24gPSBwYXRoLnJlc29sdmUobm9kZU1vZHVsZXNGb2xkZXIsIG1vZHVsZSwgJ3BhY2thZ2UuanNvbicpO1xuICByZXR1cm4gSlNPTi5wYXJzZShyZWFkRmlsZVN5bmMocGFja2FnZUpzb24sIHsgZW5jb2Rpbmc6ICd1dGYtOCcgfSkpLnZlcnNpb247XG59XG5mdW5jdGlvbiBnZXRDdmRsTmFtZShtb2R1bGU6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IHBhY2thZ2VKc29uID0gcGF0aC5yZXNvbHZlKG5vZGVNb2R1bGVzRm9sZGVyLCBtb2R1bGUsICdwYWNrYWdlLmpzb24nKTtcbiAgcmV0dXJuIEpTT04ucGFyc2UocmVhZEZpbGVTeW5jKHBhY2thZ2VKc29uLCB7IGVuY29kaW5nOiAndXRmLTgnIH0pKS5jdmRsTmFtZTtcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcSm1peF9wYXJzZXJcXFxccGFyc2luZ193cGRcXFxccGFyc2luZ193cGRcXFxcYnVpbGRcXFxccGx1Z2luc1xcXFxhcHBsaWNhdGlvbi10aGVtZS1wbHVnaW5cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXEptaXhfcGFyc2VyXFxcXHBhcnNpbmdfd3BkXFxcXHBhcnNpbmdfd3BkXFxcXGJ1aWxkXFxcXHBsdWdpbnNcXFxcYXBwbGljYXRpb24tdGhlbWUtcGx1Z2luXFxcXHRoZW1lLWhhbmRsZS5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovSm1peF9wYXJzZXIvcGFyc2luZ193cGQvcGFyc2luZ193cGQvYnVpbGQvcGx1Z2lucy9hcHBsaWNhdGlvbi10aGVtZS1wbHVnaW4vdGhlbWUtaGFuZGxlLmpzXCI7LypcbiAqIENvcHlyaWdodCAyMDAwLTIwMjMgVmFhZGluIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdFxuICogdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2ZcbiAqIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUXG4gKiBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGVcbiAqIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyXG4gKiB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKipcbiAqIFRoaXMgZmlsZSBjb250YWlucyBmdW5jdGlvbnMgZm9yIGxvb2sgdXAgYW5kIGhhbmRsZSB0aGUgdGhlbWUgcmVzb3VyY2VzXG4gKiBmb3IgYXBwbGljYXRpb24gdGhlbWUgcGx1Z2luLlxuICovXG5pbXBvcnQgeyBleGlzdHNTeW5jLCByZWFkRmlsZVN5bmMgfSBmcm9tICdmcyc7XG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgeyB3cml0ZVRoZW1lRmlsZXMgfSBmcm9tICcuL3RoZW1lLWdlbmVyYXRvci5qcyc7XG5pbXBvcnQgeyBjb3B5U3RhdGljQXNzZXRzLCBjb3B5VGhlbWVSZXNvdXJjZXMgfSBmcm9tICcuL3RoZW1lLWNvcHkuanMnO1xuXG4vLyBtYXRjaGVzIHRoZW1lIG5hbWUgaW4gJy4vdGhlbWUtbXktdGhlbWUuZ2VuZXJhdGVkLmpzJ1xuY29uc3QgbmFtZVJlZ2V4ID0gL3RoZW1lLSguKilcXC5nZW5lcmF0ZWRcXC5qcy87XG5cbmxldCBwcmV2VGhlbWVOYW1lID0gdW5kZWZpbmVkO1xubGV0IGZpcnN0VGhlbWVOYW1lID0gdW5kZWZpbmVkO1xuXG4vKipcbiAqIExvb2tzIHVwIGZvciBhIHRoZW1lIHJlc291cmNlcyBpbiBhIGN1cnJlbnQgcHJvamVjdCBhbmQgaW4gamFyIGRlcGVuZGVuY2llcyxcbiAqIGNvcGllcyB0aGUgZm91bmQgcmVzb3VyY2VzIGFuZCBnZW5lcmF0ZXMvdXBkYXRlcyBtZXRhIGRhdGEgZm9yIHdlYnBhY2tcbiAqIGNvbXBpbGF0aW9uLlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIGFwcGxpY2F0aW9uIHRoZW1lIHBsdWdpbiBtYW5kYXRvcnkgb3B0aW9ucyxcbiAqIEBzZWUge0BsaW5rIEFwcGxpY2F0aW9uVGhlbWVQbHVnaW59XG4gKlxuICogQHBhcmFtIGxvZ2dlciBhcHBsaWNhdGlvbiB0aGVtZSBwbHVnaW4gbG9nZ2VyXG4gKi9cbmZ1bmN0aW9uIHByb2Nlc3NUaGVtZVJlc291cmNlcyhvcHRpb25zLCBsb2dnZXIpIHtcbiAgY29uc3QgdGhlbWVOYW1lID0gZXh0cmFjdFRoZW1lTmFtZShvcHRpb25zLmZyb250ZW5kR2VuZXJhdGVkRm9sZGVyKTtcbiAgaWYgKHRoZW1lTmFtZSkge1xuICAgIGlmICghcHJldlRoZW1lTmFtZSAmJiAhZmlyc3RUaGVtZU5hbWUpIHtcbiAgICAgIGZpcnN0VGhlbWVOYW1lID0gdGhlbWVOYW1lO1xuICAgIH0gZWxzZSBpZiAoXG4gICAgICAocHJldlRoZW1lTmFtZSAmJiBwcmV2VGhlbWVOYW1lICE9PSB0aGVtZU5hbWUgJiYgZmlyc3RUaGVtZU5hbWUgIT09IHRoZW1lTmFtZSkgfHxcbiAgICAgICghcHJldlRoZW1lTmFtZSAmJiBmaXJzdFRoZW1lTmFtZSAhPT0gdGhlbWVOYW1lKVxuICAgICkge1xuICAgICAgLy8gV2FybmluZyBtZXNzYWdlIGlzIHNob3duIHRvIHRoZSBkZXZlbG9wZXIgd2hlbjpcbiAgICAgIC8vIDEuIEhlIGlzIHN3aXRjaGluZyB0byBhbnkgdGhlbWUsIHdoaWNoIGlzIGRpZmZlciBmcm9tIG9uZSBiZWluZyBzZXQgdXBcbiAgICAgIC8vIG9uIGFwcGxpY2F0aW9uIHN0YXJ0dXAsIGJ5IGNoYW5naW5nIHRoZW1lIG5hbWUgaW4gYEBUaGVtZSgpYFxuICAgICAgLy8gMi4gSGUgcmVtb3ZlcyBvciBjb21tZW50cyBvdXQgYEBUaGVtZSgpYCB0byBzZWUgaG93IHRoZSBhcHBcbiAgICAgIC8vIGxvb2tzIGxpa2Ugd2l0aG91dCB0aGVtaW5nLCBhbmQgdGhlbiBhZ2FpbiBicmluZ3MgYEBUaGVtZSgpYCBiYWNrXG4gICAgICAvLyB3aXRoIGEgdGhlbWVOYW1lIHdoaWNoIGlzIGRpZmZlciBmcm9tIG9uZSBiZWluZyBzZXQgdXAgb24gYXBwbGljYXRpb25cbiAgICAgIC8vIHN0YXJ0dXAuXG4gICAgICBjb25zdCB3YXJuaW5nID0gYEF0dGVudGlvbjogQWN0aXZlIHRoZW1lIGlzIHN3aXRjaGVkIHRvICcke3RoZW1lTmFtZX0nLmA7XG4gICAgICBjb25zdCBkZXNjcmlwdGlvbiA9IGBcbiAgICAgIE5vdGUgdGhhdCBhZGRpbmcgbmV3IHN0eWxlIHNoZWV0IGZpbGVzIHRvICcvdGhlbWVzLyR7dGhlbWVOYW1lfS9jb21wb25lbnRzJywgXG4gICAgICBtYXkgbm90IGJlIHRha2VuIGludG8gZWZmZWN0IHVudGlsIHRoZSBuZXh0IGFwcGxpY2F0aW9uIHJlc3RhcnQuXG4gICAgICBDaGFuZ2VzIHRvIGFscmVhZHkgZXhpc3Rpbmcgc3R5bGUgc2hlZXQgZmlsZXMgYXJlIGJlaW5nIHJlbG9hZGVkIGFzIGJlZm9yZS5gO1xuICAgICAgbG9nZ2VyLndhcm4oJyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKionKTtcbiAgICAgIGxvZ2dlci53YXJuKHdhcm5pbmcpO1xuICAgICAgbG9nZ2VyLndhcm4oZGVzY3JpcHRpb24pO1xuICAgICAgbG9nZ2VyLndhcm4oJyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKionKTtcbiAgICB9XG4gICAgcHJldlRoZW1lTmFtZSA9IHRoZW1lTmFtZTtcblxuICAgIGZpbmRUaGVtZUZvbGRlckFuZEhhbmRsZVRoZW1lKHRoZW1lTmFtZSwgb3B0aW9ucywgbG9nZ2VyKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBUaGlzIGlzIG5lZWRlZCBpbiB0aGUgc2l0dWF0aW9uIHRoYXQgdGhlIHVzZXIgZGVjaWRlcyB0byBjb21tZW50IG9yXG4gICAgLy8gcmVtb3ZlIHRoZSBAVGhlbWUoLi4uKSBjb21wbGV0ZWx5IHRvIHNlZSBob3cgdGhlIGFwcGxpY2F0aW9uIGxvb2tzXG4gICAgLy8gd2l0aG91dCBhbnkgdGhlbWUuIFRoZW4gd2hlbiB0aGUgdXNlciBicmluZ3MgYmFjayBvbmUgb2YgdGhlIHRoZW1lcyxcbiAgICAvLyB0aGUgcHJldmlvdXMgdGhlbWUgc2hvdWxkIGJlIHVuZGVmaW5lZCB0byBlbmFibGUgdXMgdG8gZGV0ZWN0IHRoZSBjaGFuZ2UuXG4gICAgcHJldlRoZW1lTmFtZSA9IHVuZGVmaW5lZDtcbiAgICBsb2dnZXIuZGVidWcoJ1NraXBwaW5nIFZhYWRpbiBhcHBsaWNhdGlvbiB0aGVtZSBoYW5kbGluZy4nKTtcbiAgICBsb2dnZXIudHJhY2UoJ01vc3QgbGlrZWx5IG5vIEBUaGVtZSBhbm5vdGF0aW9uIGZvciBhcHBsaWNhdGlvbiBvciBvbmx5IHRoZW1lQ2xhc3MgdXNlZC4nKTtcbiAgfVxufVxuXG4vKipcbiAqIFNlYXJjaCBmb3IgdGhlIGdpdmVuIHRoZW1lIGluIHRoZSBwcm9qZWN0IGFuZCByZXNvdXJjZSBmb2xkZXJzLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0aGVtZU5hbWUgbmFtZSBvZiB0aGVtZSB0byBmaW5kXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyBhcHBsaWNhdGlvbiB0aGVtZSBwbHVnaW4gbWFuZGF0b3J5IG9wdGlvbnMsXG4gKiBAc2VlIHtAbGluayBBcHBsaWNhdGlvblRoZW1lUGx1Z2lufVxuICogQHBhcmFtIGxvZ2dlciBhcHBsaWNhdGlvbiB0aGVtZSBwbHVnaW4gbG9nZ2VyXG4gKiBAcmV0dXJuIHRydWUgb3IgZmFsc2UgZm9yIGlmIHRoZW1lIHdhcyBmb3VuZFxuICovXG5mdW5jdGlvbiBmaW5kVGhlbWVGb2xkZXJBbmRIYW5kbGVUaGVtZSh0aGVtZU5hbWUsIG9wdGlvbnMsIGxvZ2dlcikge1xuICBsZXQgdGhlbWVGb3VuZCA9IGZhbHNlO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG9wdGlvbnMudGhlbWVQcm9qZWN0Rm9sZGVycy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHRoZW1lUHJvamVjdEZvbGRlciA9IG9wdGlvbnMudGhlbWVQcm9qZWN0Rm9sZGVyc1tpXTtcbiAgICBpZiAoZXhpc3RzU3luYyh0aGVtZVByb2plY3RGb2xkZXIpKSB7XG4gICAgICBsb2dnZXIuZGVidWcoXCJTZWFyY2hpbmcgdGhlbWVzIGZvbGRlciAnXCIgKyB0aGVtZVByb2plY3RGb2xkZXIgKyBcIicgZm9yIHRoZW1lICdcIiArIHRoZW1lTmFtZSArIFwiJ1wiKTtcbiAgICAgIGNvbnN0IGhhbmRsZWQgPSBoYW5kbGVUaGVtZXModGhlbWVOYW1lLCB0aGVtZVByb2plY3RGb2xkZXIsIG9wdGlvbnMsIGxvZ2dlcik7XG4gICAgICBpZiAoaGFuZGxlZCkge1xuICAgICAgICBpZiAodGhlbWVGb3VuZCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgIFwiRm91bmQgdGhlbWUgZmlsZXMgaW4gJ1wiICtcbiAgICAgICAgICAgICAgdGhlbWVQcm9qZWN0Rm9sZGVyICtcbiAgICAgICAgICAgICAgXCInIGFuZCAnXCIgK1xuICAgICAgICAgICAgICB0aGVtZUZvdW5kICtcbiAgICAgICAgICAgICAgXCInLiBUaGVtZSBzaG91bGQgb25seSBiZSBhdmFpbGFibGUgaW4gb25lIGZvbGRlclwiXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgICBsb2dnZXIuZGVidWcoXCJGb3VuZCB0aGVtZSBmaWxlcyBmcm9tICdcIiArIHRoZW1lUHJvamVjdEZvbGRlciArIFwiJ1wiKTtcbiAgICAgICAgdGhlbWVGb3VuZCA9IHRoZW1lUHJvamVjdEZvbGRlcjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAoZXhpc3RzU3luYyhvcHRpb25zLnRoZW1lUmVzb3VyY2VGb2xkZXIpKSB7XG4gICAgaWYgKHRoZW1lRm91bmQgJiYgZXhpc3RzU3luYyhyZXNvbHZlKG9wdGlvbnMudGhlbWVSZXNvdXJjZUZvbGRlciwgdGhlbWVOYW1lKSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgXCJUaGVtZSAnXCIgK1xuICAgICAgICAgIHRoZW1lTmFtZSArXG4gICAgICAgICAgXCInc2hvdWxkIG5vdCBleGlzdCBpbnNpZGUgYSBqYXIgYW5kIGluIHRoZSBwcm9qZWN0IGF0IHRoZSBzYW1lIHRpbWVcXG5cIiArXG4gICAgICAgICAgJ0V4dGVuZGluZyBhbm90aGVyIHRoZW1lIGlzIHBvc3NpYmxlIGJ5IGFkZGluZyB7IFwicGFyZW50XCI6IFwibXktcGFyZW50LXRoZW1lXCIgfSBlbnRyeSB0byB0aGUgdGhlbWUuanNvbiBmaWxlIGluc2lkZSB5b3VyIHRoZW1lIGZvbGRlci4nXG4gICAgICApO1xuICAgIH1cbiAgICBsb2dnZXIuZGVidWcoXG4gICAgICBcIlNlYXJjaGluZyB0aGVtZSBqYXIgcmVzb3VyY2UgZm9sZGVyICdcIiArIG9wdGlvbnMudGhlbWVSZXNvdXJjZUZvbGRlciArIFwiJyBmb3IgdGhlbWUgJ1wiICsgdGhlbWVOYW1lICsgXCInXCJcbiAgICApO1xuICAgIGhhbmRsZVRoZW1lcyh0aGVtZU5hbWUsIG9wdGlvbnMudGhlbWVSZXNvdXJjZUZvbGRlciwgb3B0aW9ucywgbG9nZ2VyKTtcbiAgICB0aGVtZUZvdW5kID0gdHJ1ZTtcbiAgfVxuICByZXR1cm4gdGhlbWVGb3VuZDtcbn1cblxuLyoqXG4gKiBDb3BpZXMgc3RhdGljIHJlc291cmNlcyBmb3IgdGhlbWUgYW5kIGdlbmVyYXRlcy93cml0ZXMgdGhlXG4gKiBbdGhlbWUtbmFtZV0uZ2VuZXJhdGVkLmpzIGZvciB3ZWJwYWNrIHRvIGhhbmRsZS5cbiAqXG4gKiBOb3RlISBJZiBhIHBhcmVudCB0aGVtZSBpcyBkZWZpbmVkIGl0IHdpbGwgYWxzbyBiZSBoYW5kbGVkIGhlcmUgc28gdGhhdCB0aGUgcGFyZW50IHRoZW1lIGdlbmVyYXRlZCBmaWxlIGlzXG4gKiBnZW5lcmF0ZWQgaW4gYWR2YW5jZSBvZiB0aGUgdGhlbWUgZ2VuZXJhdGVkIGZpbGUuXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHRoZW1lTmFtZSBuYW1lIG9mIHRoZW1lIHRvIGhhbmRsZVxuICogQHBhcmFtIHtzdHJpbmd9IHRoZW1lc0ZvbGRlciBmb2xkZXIgY29udGFpbmluZyBhcHBsaWNhdGlvbiB0aGVtZSBmb2xkZXJzXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyBhcHBsaWNhdGlvbiB0aGVtZSBwbHVnaW4gbWFuZGF0b3J5IG9wdGlvbnMsXG4gKiBAc2VlIHtAbGluayBBcHBsaWNhdGlvblRoZW1lUGx1Z2lufVxuICogQHBhcmFtIHtvYmplY3R9IGxvZ2dlciBwbHVnaW4gbG9nZ2VyIGluc3RhbmNlXG4gKlxuICogQHRocm93cyBFcnJvciBpZiBwYXJlbnQgdGhlbWUgZGVmaW5lZCwgYnV0IGNhbid0IGxvY2F0ZSBwYXJlbnQgdGhlbWVcbiAqXG4gKiBAcmV0dXJucyB0cnVlIGlmIHRoZW1lIHdhcyBmb3VuZCBlbHNlIGZhbHNlLlxuICovXG5mdW5jdGlvbiBoYW5kbGVUaGVtZXModGhlbWVOYW1lLCB0aGVtZXNGb2xkZXIsIG9wdGlvbnMsIGxvZ2dlcikge1xuICBjb25zdCB0aGVtZUZvbGRlciA9IHJlc29sdmUodGhlbWVzRm9sZGVyLCB0aGVtZU5hbWUpO1xuICBpZiAoZXhpc3RzU3luYyh0aGVtZUZvbGRlcikpIHtcbiAgICBsb2dnZXIuZGVidWcoJ0ZvdW5kIHRoZW1lICcsIHRoZW1lTmFtZSwgJyBpbiBmb2xkZXIgJywgdGhlbWVGb2xkZXIpO1xuXG4gICAgY29uc3QgdGhlbWVQcm9wZXJ0aWVzID0gZ2V0VGhlbWVQcm9wZXJ0aWVzKHRoZW1lRm9sZGVyKTtcblxuICAgIC8vIElmIHRoZW1lIGhhcyBwYXJlbnQgaGFuZGxlIHBhcmVudCB0aGVtZSBpbW1lZGlhdGVseS5cbiAgICBpZiAodGhlbWVQcm9wZXJ0aWVzLnBhcmVudCkge1xuICAgICAgY29uc3QgZm91bmQgPSBmaW5kVGhlbWVGb2xkZXJBbmRIYW5kbGVUaGVtZSh0aGVtZVByb3BlcnRpZXMucGFyZW50LCBvcHRpb25zLCBsb2dnZXIpO1xuICAgICAgaWYgKCFmb3VuZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgXCJDb3VsZCBub3QgbG9jYXRlIGZpbGVzIGZvciBkZWZpbmVkIHBhcmVudCB0aGVtZSAnXCIgK1xuICAgICAgICAgICAgdGhlbWVQcm9wZXJ0aWVzLnBhcmVudCArXG4gICAgICAgICAgICBcIicuXFxuXCIgK1xuICAgICAgICAgICAgJ1BsZWFzZSB2ZXJpZnkgdGhhdCBkZXBlbmRlbmN5IGlzIGFkZGVkIG9yIHRoZW1lIGZvbGRlciBleGlzdHMuJ1xuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgICBjb3B5U3RhdGljQXNzZXRzKHRoZW1lTmFtZSwgdGhlbWVQcm9wZXJ0aWVzLCBvcHRpb25zLnByb2plY3RTdGF0aWNBc3NldHNPdXRwdXRGb2xkZXIsIGxvZ2dlcik7XG4gICAgY29weVRoZW1lUmVzb3VyY2VzKHRoZW1lRm9sZGVyLCBvcHRpb25zLnByb2plY3RTdGF0aWNBc3NldHNPdXRwdXRGb2xkZXIsIGxvZ2dlcik7XG5cbiAgICB3cml0ZVRoZW1lRmlsZXModGhlbWVGb2xkZXIsIHRoZW1lTmFtZSwgdGhlbWVQcm9wZXJ0aWVzLCBvcHRpb25zKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGdldFRoZW1lUHJvcGVydGllcyh0aGVtZUZvbGRlcikge1xuICBjb25zdCB0aGVtZVByb3BlcnR5RmlsZSA9IHJlc29sdmUodGhlbWVGb2xkZXIsICd0aGVtZS5qc29uJyk7XG4gIGlmICghZXhpc3RzU3luYyh0aGVtZVByb3BlcnR5RmlsZSkpIHtcbiAgICByZXR1cm4ge307XG4gIH1cbiAgY29uc3QgdGhlbWVQcm9wZXJ0eUZpbGVBc1N0cmluZyA9IHJlYWRGaWxlU3luYyh0aGVtZVByb3BlcnR5RmlsZSk7XG4gIGlmICh0aGVtZVByb3BlcnR5RmlsZUFzU3RyaW5nLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiB7fTtcbiAgfVxuICByZXR1cm4gSlNPTi5wYXJzZSh0aGVtZVByb3BlcnR5RmlsZUFzU3RyaW5nKTtcbn1cblxuLyoqXG4gKiBFeHRyYWN0cyBjdXJyZW50IHRoZW1lIG5hbWUgZnJvbSBhdXRvLWdlbmVyYXRlZCAndGhlbWUuanMnIGZpbGUgbG9jYXRlZCBvbiBhXG4gKiBnaXZlbiBmb2xkZXIuXG4gKiBAcGFyYW0gZnJvbnRlbmRHZW5lcmF0ZWRGb2xkZXIgZm9sZGVyIGluIHByb2plY3QgY29udGFpbmluZyAndGhlbWUuanMnIGZpbGVcbiAqIEByZXR1cm5zIHtzdHJpbmd9IGN1cnJlbnQgdGhlbWUgbmFtZVxuICovXG5mdW5jdGlvbiBleHRyYWN0VGhlbWVOYW1lKGZyb250ZW5kR2VuZXJhdGVkRm9sZGVyKSB7XG4gIGlmICghZnJvbnRlbmRHZW5lcmF0ZWRGb2xkZXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBcIkNvdWxkbid0IGV4dHJhY3QgdGhlbWUgbmFtZSBmcm9tICd0aGVtZS5qcycsXCIgK1xuICAgICAgICAnIGJlY2F1c2UgdGhlIHBhdGggdG8gZm9sZGVyIGNvbnRhaW5pbmcgdGhpcyBmaWxlIGlzIGVtcHR5LiBQbGVhc2Ugc2V0JyArXG4gICAgICAgICcgdGhlIGEgY29ycmVjdCBmb2xkZXIgcGF0aCBpbiBBcHBsaWNhdGlvblRoZW1lUGx1Z2luIGNvbnN0cnVjdG9yJyArXG4gICAgICAgICcgcGFyYW1ldGVycy4nXG4gICAgKTtcbiAgfVxuICBjb25zdCBnZW5lcmF0ZWRUaGVtZUZpbGUgPSByZXNvbHZlKGZyb250ZW5kR2VuZXJhdGVkRm9sZGVyLCAndGhlbWUuanMnKTtcbiAgaWYgKGV4aXN0c1N5bmMoZ2VuZXJhdGVkVGhlbWVGaWxlKSkge1xuICAgIC8vIHJlYWQgdGhlbWUgbmFtZSBmcm9tIHRoZSAnZ2VuZXJhdGVkL3RoZW1lLmpzJyBhcyB0aGVyZSB3ZSBhbHdheXNcbiAgICAvLyBtYXJrIHRoZSB1c2VkIHRoZW1lIGZvciB3ZWJwYWNrIHRvIGhhbmRsZS5cbiAgICBjb25zdCB0aGVtZU5hbWUgPSBuYW1lUmVnZXguZXhlYyhyZWFkRmlsZVN5bmMoZ2VuZXJhdGVkVGhlbWVGaWxlLCB7IGVuY29kaW5nOiAndXRmOCcgfSkpWzFdO1xuICAgIGlmICghdGhlbWVOYW1lKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBwYXJzZSB0aGVtZSBuYW1lIGZyb20gJ1wiICsgZ2VuZXJhdGVkVGhlbWVGaWxlICsgXCInLlwiKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoZW1lTmFtZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbn1cblxuLyoqXG4gKiBGaW5kcyBhbGwgdGhlIHBhcmVudCB0aGVtZXMgbG9jYXRlZCBpbiB0aGUgcHJvamVjdCB0aGVtZXMgZm9sZGVycyBhbmQgaW5cbiAqIHRoZSBKQVIgZGVwZW5kZW5jaWVzIHdpdGggcmVzcGVjdCB0byB0aGUgZ2l2ZW4gY3VzdG9tIHRoZW1lIHdpdGhcbiAqIHtAY29kZSB0aGVtZU5hbWV9LlxuICogQHBhcmFtIHtzdHJpbmd9IHRoZW1lTmFtZSBnaXZlbiBjdXN0b20gdGhlbWUgbmFtZSB0byBsb29rIHBhcmVudHMgZm9yXG4gKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyBhcHBsaWNhdGlvbiB0aGVtZSBwbHVnaW4gbWFuZGF0b3J5IG9wdGlvbnMsXG4gKiBAc2VlIHtAbGluayBBcHBsaWNhdGlvblRoZW1lUGx1Z2lufVxuICogQHJldHVybnMge3N0cmluZ1tdfSBhcnJheSBvZiBwYXRocyB0byBmb3VuZCBwYXJlbnQgdGhlbWVzIHdpdGggcmVzcGVjdCB0byB0aGVcbiAqIGdpdmVuIGN1c3RvbSB0aGVtZVxuICovXG5mdW5jdGlvbiBmaW5kUGFyZW50VGhlbWVzKHRoZW1lTmFtZSwgb3B0aW9ucykge1xuICBjb25zdCBleGlzdGluZ1RoZW1lRm9sZGVycyA9IFtvcHRpb25zLnRoZW1lUmVzb3VyY2VGb2xkZXIsIC4uLm9wdGlvbnMudGhlbWVQcm9qZWN0Rm9sZGVyc10uZmlsdGVyKChmb2xkZXIpID0+XG4gICAgZXhpc3RzU3luYyhmb2xkZXIpXG4gICk7XG4gIHJldHVybiBjb2xsZWN0UGFyZW50VGhlbWVzKHRoZW1lTmFtZSwgZXhpc3RpbmdUaGVtZUZvbGRlcnMsIGZhbHNlKTtcbn1cblxuZnVuY3Rpb24gY29sbGVjdFBhcmVudFRoZW1lcyh0aGVtZU5hbWUsIHRoZW1lRm9sZGVycywgaXNQYXJlbnQpIHtcbiAgbGV0IGZvdW5kUGFyZW50VGhlbWVzID0gW107XG4gIHRoZW1lRm9sZGVycy5mb3JFYWNoKChmb2xkZXIpID0+IHtcbiAgICBjb25zdCB0aGVtZUZvbGRlciA9IHJlc29sdmUoZm9sZGVyLCB0aGVtZU5hbWUpO1xuICAgIGlmIChleGlzdHNTeW5jKHRoZW1lRm9sZGVyKSkge1xuICAgICAgY29uc3QgdGhlbWVQcm9wZXJ0aWVzID0gZ2V0VGhlbWVQcm9wZXJ0aWVzKHRoZW1lRm9sZGVyKTtcblxuICAgICAgaWYgKHRoZW1lUHJvcGVydGllcy5wYXJlbnQpIHtcbiAgICAgICAgZm91bmRQYXJlbnRUaGVtZXMucHVzaCguLi5jb2xsZWN0UGFyZW50VGhlbWVzKHRoZW1lUHJvcGVydGllcy5wYXJlbnQsIHRoZW1lRm9sZGVycywgdHJ1ZSkpO1xuICAgICAgICBpZiAoIWZvdW5kUGFyZW50VGhlbWVzLmxlbmd0aCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgIFwiQ291bGQgbm90IGxvY2F0ZSBmaWxlcyBmb3IgZGVmaW5lZCBwYXJlbnQgdGhlbWUgJ1wiICtcbiAgICAgICAgICAgICAgdGhlbWVQcm9wZXJ0aWVzLnBhcmVudCArXG4gICAgICAgICAgICAgIFwiJy5cXG5cIiArXG4gICAgICAgICAgICAgICdQbGVhc2UgdmVyaWZ5IHRoYXQgZGVwZW5kZW5jeSBpcyBhZGRlZCBvciB0aGVtZSBmb2xkZXIgZXhpc3RzLidcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBBZGQgYSB0aGVtZSBwYXRoIHRvIHJlc3VsdCBjb2xsZWN0aW9uIG9ubHkgaWYgYSBnaXZlbiB0aGVtZU5hbWVcbiAgICAgIC8vIGlzIHN1cHBvc2VkIHRvIGJlIGEgcGFyZW50IHRoZW1lXG4gICAgICBpZiAoaXNQYXJlbnQpIHtcbiAgICAgICAgZm91bmRQYXJlbnRUaGVtZXMucHVzaCh0aGVtZUZvbGRlcik7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGZvdW5kUGFyZW50VGhlbWVzO1xufVxuXG5leHBvcnQgeyBwcm9jZXNzVGhlbWVSZXNvdXJjZXMsIGV4dHJhY3RUaGVtZU5hbWUsIGZpbmRQYXJlbnRUaGVtZXMgfTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcSm1peF9wYXJzZXJcXFxccGFyc2luZ193cGRcXFxccGFyc2luZ193cGRcXFxcYnVpbGRcXFxccGx1Z2luc1xcXFxhcHBsaWNhdGlvbi10aGVtZS1wbHVnaW5cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXEptaXhfcGFyc2VyXFxcXHBhcnNpbmdfd3BkXFxcXHBhcnNpbmdfd3BkXFxcXGJ1aWxkXFxcXHBsdWdpbnNcXFxcYXBwbGljYXRpb24tdGhlbWUtcGx1Z2luXFxcXHRoZW1lLWdlbmVyYXRvci5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovSm1peF9wYXJzZXIvcGFyc2luZ193cGQvcGFyc2luZ193cGQvYnVpbGQvcGx1Z2lucy9hcHBsaWNhdGlvbi10aGVtZS1wbHVnaW4vdGhlbWUtZ2VuZXJhdG9yLmpzXCI7LypcbiAqIENvcHlyaWdodCAyMDAwLTIwMjQgVmFhZGluIEx0ZC5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdFxuICogdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2ZcbiAqIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLCBXSVRIT1VUXG4gKiBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuIFNlZSB0aGVcbiAqIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kIGxpbWl0YXRpb25zIHVuZGVyXG4gKiB0aGUgTGljZW5zZS5cbiAqL1xuXG4vKipcbiAqIFRoaXMgZmlsZSBoYW5kbGVzIHRoZSBnZW5lcmF0aW9uIG9mIHRoZSAnW3RoZW1lLW5hbWVdLmpzJyB0b1xuICogdGhlIHRoZW1lcy9bdGhlbWUtbmFtZV0gZm9sZGVyIGFjY29yZGluZyB0byBwcm9wZXJ0aWVzIGZyb20gJ3RoZW1lLmpzb24nLlxuICovXG5pbXBvcnQgeyBnbG9iU3luYyB9IGZyb20gJ2dsb2InO1xuaW1wb3J0IHsgcmVzb2x2ZSwgYmFzZW5hbWUgfSBmcm9tICdwYXRoJztcbmltcG9ydCB7IGV4aXN0c1N5bmMsIHJlYWRGaWxlU3luYywgd3JpdGVGaWxlU3luYyB9IGZyb20gJ2ZzJztcbmltcG9ydCB7IGNoZWNrTW9kdWxlcyB9IGZyb20gJy4vdGhlbWUtY29weS5qcyc7XG5cbi8vIFNwZWNpYWwgZm9sZGVyIGluc2lkZSBhIHRoZW1lIGZvciBjb21wb25lbnQgdGhlbWVzIHRoYXQgZ28gaW5zaWRlIHRoZSBjb21wb25lbnQgc2hhZG93IHJvb3RcbmNvbnN0IHRoZW1lQ29tcG9uZW50c0ZvbGRlciA9ICdjb21wb25lbnRzJztcbi8vIFRoZSBjb250ZW50cyBvZiBhIGdsb2JhbCBDU1MgZmlsZSB3aXRoIHRoaXMgbmFtZSBpbiBhIHRoZW1lIGlzIGFsd2F5cyBhZGRlZCB0b1xuLy8gdGhlIGRvY3VtZW50LiBFLmcuIEBmb250LWZhY2UgbXVzdCBiZSBpbiB0aGlzXG5jb25zdCBkb2N1bWVudENzc0ZpbGVuYW1lID0gJ2RvY3VtZW50LmNzcyc7XG4vLyBzdHlsZXMuY3NzIGlzIHRoZSBvbmx5IGVudHJ5cG9pbnQgY3NzIGZpbGUgd2l0aCBkb2N1bWVudC5jc3MuIEV2ZXJ5dGhpbmcgZWxzZSBzaG91bGQgYmUgaW1wb3J0ZWQgdXNpbmcgY3NzIEBpbXBvcnRcbmNvbnN0IHN0eWxlc0Nzc0ZpbGVuYW1lID0gJ3N0eWxlcy5jc3MnO1xuXG5jb25zdCBDU1NJTVBPUlRfQ09NTUVOVCA9ICdDU1NJbXBvcnQgZW5kJztcbmNvbnN0IGhlYWRlckltcG9ydCA9IGBpbXBvcnQgJ2NvbnN0cnVjdC1zdHlsZS1zaGVldHMtcG9seWZpbGwnO1xuYDtcblxuLyoqXG4gKiBHZW5lcmF0ZSB0aGUgW3RoZW1lTmFtZV0uanMgZmlsZSBmb3IgdGhlbWVGb2xkZXIgd2hpY2ggY29sbGVjdHMgYWxsIHJlcXVpcmVkIGluZm9ybWF0aW9uIGZyb20gdGhlIGZvbGRlci5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGhlbWVGb2xkZXIgZm9sZGVyIG9mIHRoZSB0aGVtZVxuICogQHBhcmFtIHtzdHJpbmd9IHRoZW1lTmFtZSBuYW1lIG9mIHRoZSBoYW5kbGVkIHRoZW1lXG4gKiBAcGFyYW0ge0pTT059IHRoZW1lUHJvcGVydGllcyBjb250ZW50IG9mIHRoZW1lLmpzb25cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIGJ1aWxkIG9wdGlvbnMgKGUuZy4gcHJvZCBvciBkZXYgbW9kZSlcbiAqIEByZXR1cm5zIHtzdHJpbmd9IHRoZW1lIGZpbGUgY29udGVudFxuICovXG5mdW5jdGlvbiB3cml0ZVRoZW1lRmlsZXModGhlbWVGb2xkZXIsIHRoZW1lTmFtZSwgdGhlbWVQcm9wZXJ0aWVzLCBvcHRpb25zKSB7XG4gIGNvbnN0IHByb2R1Y3Rpb25Nb2RlID0gIW9wdGlvbnMuZGV2TW9kZTtcbiAgY29uc3QgdXNlRGV2U2VydmVyT3JJblByb2R1Y3Rpb25Nb2RlID0gIW9wdGlvbnMudXNlRGV2QnVuZGxlO1xuICBjb25zdCBvdXRwdXRGb2xkZXIgPSBvcHRpb25zLmZyb250ZW5kR2VuZXJhdGVkRm9sZGVyO1xuICBjb25zdCBzdHlsZXMgPSByZXNvbHZlKHRoZW1lRm9sZGVyLCBzdHlsZXNDc3NGaWxlbmFtZSk7XG4gIGNvbnN0IGRvY3VtZW50Q3NzRmlsZSA9IHJlc29sdmUodGhlbWVGb2xkZXIsIGRvY3VtZW50Q3NzRmlsZW5hbWUpO1xuICBjb25zdCBhdXRvSW5qZWN0Q29tcG9uZW50cyA9IHRoZW1lUHJvcGVydGllcy5hdXRvSW5qZWN0Q29tcG9uZW50cyA/PyB0cnVlO1xuICBjb25zdCBnbG9iYWxGaWxlbmFtZSA9ICd0aGVtZS0nICsgdGhlbWVOYW1lICsgJy5nbG9iYWwuZ2VuZXJhdGVkLmpzJztcbiAgY29uc3QgY29tcG9uZW50c0ZpbGVuYW1lID0gJ3RoZW1lLScgKyB0aGVtZU5hbWUgKyAnLmNvbXBvbmVudHMuZ2VuZXJhdGVkLmpzJztcbiAgY29uc3QgdGhlbWVGaWxlbmFtZSA9ICd0aGVtZS0nICsgdGhlbWVOYW1lICsgJy5nZW5lcmF0ZWQuanMnO1xuXG4gIGxldCB0aGVtZUZpbGVDb250ZW50ID0gaGVhZGVySW1wb3J0O1xuICBsZXQgZ2xvYmFsSW1wb3J0Q29udGVudCA9ICcvLyBXaGVuIHRoaXMgZmlsZSBpcyBpbXBvcnRlZCwgZ2xvYmFsIHN0eWxlcyBhcmUgYXV0b21hdGljYWxseSBhcHBsaWVkXFxuJztcbiAgbGV0IGNvbXBvbmVudHNGaWxlQ29udGVudCA9ICcnO1xuICB2YXIgY29tcG9uZW50c0ZpbGVzO1xuXG4gIGlmIChhdXRvSW5qZWN0Q29tcG9uZW50cykge1xuICAgIGNvbXBvbmVudHNGaWxlcyA9IGdsb2JTeW5jKCcqLmNzcycsIHtcbiAgICAgIGN3ZDogcmVzb2x2ZSh0aGVtZUZvbGRlciwgdGhlbWVDb21wb25lbnRzRm9sZGVyKSxcbiAgICAgIG5vZGlyOiB0cnVlXG4gICAgfSk7XG5cbiAgICBpZiAoY29tcG9uZW50c0ZpbGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbXBvbmVudHNGaWxlQ29udGVudCArPVxuICAgICAgICBcImltcG9ydCB7IHVuc2FmZUNTUywgcmVnaXN0ZXJTdHlsZXMgfSBmcm9tICdAdmFhZGluL3ZhYWRpbi10aGVtYWJsZS1taXhpbi9yZWdpc3Rlci1zdHlsZXMnO1xcblwiO1xuICAgIH1cbiAgfVxuXG4gIGlmICh0aGVtZVByb3BlcnRpZXMucGFyZW50KSB7XG4gICAgdGhlbWVGaWxlQ29udGVudCArPSBgaW1wb3J0IHsgYXBwbHlUaGVtZSBhcyBhcHBseUJhc2VUaGVtZSB9IGZyb20gJy4vdGhlbWUtJHt0aGVtZVByb3BlcnRpZXMucGFyZW50fS5nZW5lcmF0ZWQuanMnO1xcbmA7XG4gIH1cblxuICB0aGVtZUZpbGVDb250ZW50ICs9IGBpbXBvcnQgeyBpbmplY3RHbG9iYWxDc3MgfSBmcm9tICdGcm9udGVuZC9nZW5lcmF0ZWQvamFyLXJlc291cmNlcy90aGVtZS11dGlsLmpzJztcXG5gO1xuICB0aGVtZUZpbGVDb250ZW50ICs9IGBpbXBvcnQgJy4vJHtjb21wb25lbnRzRmlsZW5hbWV9JztcXG5gO1xuXG4gIHRoZW1lRmlsZUNvbnRlbnQgKz0gYGxldCBuZWVkc1JlbG9hZE9uQ2hhbmdlcyA9IGZhbHNlO1xcbmA7XG4gIGNvbnN0IGltcG9ydHMgPSBbXTtcbiAgY29uc3QgY29tcG9uZW50Q3NzSW1wb3J0cyA9IFtdO1xuICBjb25zdCBnbG9iYWxGaWxlQ29udGVudCA9IFtdO1xuICBjb25zdCBnbG9iYWxDc3NDb2RlID0gW107XG4gIGNvbnN0IHNoYWRvd09ubHlDc3MgPSBbXTtcbiAgY29uc3QgY29tcG9uZW50Q3NzQ29kZSA9IFtdO1xuICBjb25zdCBwYXJlbnRUaGVtZSA9IHRoZW1lUHJvcGVydGllcy5wYXJlbnQgPyAnYXBwbHlCYXNlVGhlbWUodGFyZ2V0KTtcXG4nIDogJyc7XG4gIGNvbnN0IHBhcmVudFRoZW1lR2xvYmFsSW1wb3J0ID0gdGhlbWVQcm9wZXJ0aWVzLnBhcmVudFxuICAgID8gYGltcG9ydCAnLi90aGVtZS0ke3RoZW1lUHJvcGVydGllcy5wYXJlbnR9Lmdsb2JhbC5nZW5lcmF0ZWQuanMnO1xcbmBcbiAgICA6ICcnO1xuXG4gIGNvbnN0IHRoZW1lSWRlbnRpZmllciA9ICdfdmFhZGludGhlbWVfJyArIHRoZW1lTmFtZSArICdfJztcbiAgY29uc3QgbHVtb0Nzc0ZsYWcgPSAnX3ZhYWRpbnRoZW1lbHVtb2ltcG9ydHNfJztcbiAgY29uc3QgZ2xvYmFsQ3NzRmxhZyA9IHRoZW1lSWRlbnRpZmllciArICdnbG9iYWxDc3MnO1xuICBjb25zdCBjb21wb25lbnRDc3NGbGFnID0gdGhlbWVJZGVudGlmaWVyICsgJ2NvbXBvbmVudENzcyc7XG5cbiAgaWYgKCFleGlzdHNTeW5jKHN0eWxlcykpIHtcbiAgICBpZiAocHJvZHVjdGlvbk1vZGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgc3R5bGVzLmNzcyBmaWxlIGlzIG1pc3NpbmcgYW5kIGlzIG5lZWRlZCBmb3IgJyR7dGhlbWVOYW1lfScgaW4gZm9sZGVyICcke3RoZW1lRm9sZGVyfSdgKTtcbiAgICB9XG4gICAgd3JpdGVGaWxlU3luYyhcbiAgICAgIHN0eWxlcyxcbiAgICAgICcvKiBJbXBvcnQgeW91ciBhcHBsaWNhdGlvbiBnbG9iYWwgY3NzIGZpbGVzIGhlcmUgb3IgYWRkIHRoZSBzdHlsZXMgZGlyZWN0bHkgdG8gdGhpcyBmaWxlICovJyxcbiAgICAgICd1dGY4J1xuICAgICk7XG4gIH1cblxuICAvLyBzdHlsZXMuY3NzIHdpbGwgYWx3YXlzIGJlIGF2YWlsYWJsZSBhcyB3ZSB3cml0ZSBvbmUgaWYgaXQgZG9lc24ndCBleGlzdC5cbiAgbGV0IGZpbGVuYW1lID0gYmFzZW5hbWUoc3R5bGVzKTtcbiAgbGV0IHZhcmlhYmxlID0gY2FtZWxDYXNlKGZpbGVuYW1lKTtcblxuICAvKiBMVU1PICovXG4gIGNvbnN0IGx1bW9JbXBvcnRzID0gdGhlbWVQcm9wZXJ0aWVzLmx1bW9JbXBvcnRzIHx8IFsnY29sb3InLCAndHlwb2dyYXBoeSddO1xuICBpZiAobHVtb0ltcG9ydHMpIHtcbiAgICBsdW1vSW1wb3J0cy5mb3JFYWNoKChsdW1vSW1wb3J0KSA9PiB7XG4gICAgICBpbXBvcnRzLnB1c2goYGltcG9ydCB7ICR7bHVtb0ltcG9ydH0gfSBmcm9tICdAdmFhZGluL3ZhYWRpbi1sdW1vLXN0eWxlcy8ke2x1bW9JbXBvcnR9LmpzJztcXG5gKTtcbiAgICAgIGlmIChsdW1vSW1wb3J0ID09PSAndXRpbGl0eScgfHwgbHVtb0ltcG9ydCA9PT0gJ2JhZGdlJyB8fCBsdW1vSW1wb3J0ID09PSAndHlwb2dyYXBoeScgfHwgbHVtb0ltcG9ydCA9PT0gJ2NvbG9yJykge1xuICAgICAgICAvLyBJbmplY3QgaW50byBtYWluIGRvY3VtZW50IHRoZSBzYW1lIHdheSBhcyBvdGhlciBMdW1vIHN0eWxlcyBhcmUgaW5qZWN0ZWRcbiAgICAgICAgLy8gTHVtbyBpbXBvcnRzIGdvIHRvIHRoZSB0aGVtZSBnbG9iYWwgaW1wb3J0cyBmaWxlIHRvIHByZXZlbnQgc3R5bGUgbGVha3NcbiAgICAgICAgLy8gd2hlbiB0aGUgdGhlbWUgaXMgYXBwbGllZCB0byBhbiBlbWJlZGRlZCBjb21wb25lbnRcbiAgICAgICAgZ2xvYmFsRmlsZUNvbnRlbnQucHVzaChgaW1wb3J0ICdAdmFhZGluL3ZhYWRpbi1sdW1vLXN0eWxlcy8ke2x1bW9JbXBvcnR9LWdsb2JhbC5qcyc7XFxuYCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBsdW1vSW1wb3J0cy5mb3JFYWNoKChsdW1vSW1wb3J0KSA9PiB7XG4gICAgICAvLyBMdW1vIGlzIGluamVjdGVkIHRvIHRoZSBkb2N1bWVudCBieSBMdW1vIGl0c2VsZlxuICAgICAgc2hhZG93T25seUNzcy5wdXNoKGByZW1vdmVycy5wdXNoKGluamVjdEdsb2JhbENzcygke2x1bW9JbXBvcnR9LmNzc1RleHQsICcnLCB0YXJnZXQsIHRydWUpKTtcXG5gKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qIFRoZW1lICovXG4gIGlmICh1c2VEZXZTZXJ2ZXJPckluUHJvZHVjdGlvbk1vZGUpIHtcbiAgICBnbG9iYWxGaWxlQ29udGVudC5wdXNoKHBhcmVudFRoZW1lR2xvYmFsSW1wb3J0KTtcbiAgICBnbG9iYWxGaWxlQ29udGVudC5wdXNoKGBpbXBvcnQgJ3RoZW1lcy8ke3RoZW1lTmFtZX0vJHtmaWxlbmFtZX0nO1xcbmApO1xuXG4gICAgaW1wb3J0cy5wdXNoKGBpbXBvcnQgJHt2YXJpYWJsZX0gZnJvbSAndGhlbWVzLyR7dGhlbWVOYW1lfS8ke2ZpbGVuYW1lfT9pbmxpbmUnO1xcbmApO1xuICAgIHNoYWRvd09ubHlDc3MucHVzaChgcmVtb3ZlcnMucHVzaChpbmplY3RHbG9iYWxDc3MoJHt2YXJpYWJsZX0udG9TdHJpbmcoKSwgJycsIHRhcmdldCkpO1xcbiAgICBgKTtcbiAgfVxuICBpZiAoZXhpc3RzU3luYyhkb2N1bWVudENzc0ZpbGUpKSB7XG4gICAgZmlsZW5hbWUgPSBiYXNlbmFtZShkb2N1bWVudENzc0ZpbGUpO1xuICAgIHZhcmlhYmxlID0gY2FtZWxDYXNlKGZpbGVuYW1lKTtcblxuICAgIGlmICh1c2VEZXZTZXJ2ZXJPckluUHJvZHVjdGlvbk1vZGUpIHtcbiAgICAgIGdsb2JhbEZpbGVDb250ZW50LnB1c2goYGltcG9ydCAndGhlbWVzLyR7dGhlbWVOYW1lfS8ke2ZpbGVuYW1lfSc7XFxuYCk7XG5cbiAgICAgIGltcG9ydHMucHVzaChgaW1wb3J0ICR7dmFyaWFibGV9IGZyb20gJ3RoZW1lcy8ke3RoZW1lTmFtZX0vJHtmaWxlbmFtZX0/aW5saW5lJztcXG5gKTtcbiAgICAgIHNoYWRvd09ubHlDc3MucHVzaChgcmVtb3ZlcnMucHVzaChpbmplY3RHbG9iYWxDc3MoJHt2YXJpYWJsZX0udG9TdHJpbmcoKSwnJywgZG9jdW1lbnQpKTtcXG4gICAgYCk7XG4gICAgfVxuICB9XG5cbiAgbGV0IGkgPSAwO1xuICBpZiAodGhlbWVQcm9wZXJ0aWVzLmRvY3VtZW50Q3NzKSB7XG4gICAgY29uc3QgbWlzc2luZ01vZHVsZXMgPSBjaGVja01vZHVsZXModGhlbWVQcm9wZXJ0aWVzLmRvY3VtZW50Q3NzKTtcbiAgICBpZiAobWlzc2luZ01vZHVsZXMubGVuZ3RoID4gMCkge1xuICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgIFwiTWlzc2luZyBucG0gbW9kdWxlcyBvciBmaWxlcyAnXCIgK1xuICAgICAgICAgIG1pc3NpbmdNb2R1bGVzLmpvaW4oXCInLCAnXCIpICtcbiAgICAgICAgICBcIicgZm9yIGRvY3VtZW50Q3NzIG1hcmtlZCBpbiAndGhlbWUuanNvbicuXFxuXCIgK1xuICAgICAgICAgIFwiSW5zdGFsbCBvciB1cGRhdGUgcGFja2FnZShzKSBieSBhZGRpbmcgYSBATnBtUGFja2FnZSBhbm5vdGF0aW9uIG9yIGluc3RhbGwgaXQgdXNpbmcgJ25wbS9wbnBtL2J1biBpJ1wiXG4gICAgICApO1xuICAgIH1cbiAgICB0aGVtZVByb3BlcnRpZXMuZG9jdW1lbnRDc3MuZm9yRWFjaCgoY3NzSW1wb3J0KSA9PiB7XG4gICAgICBjb25zdCB2YXJpYWJsZSA9ICdtb2R1bGUnICsgaSsrO1xuICAgICAgaW1wb3J0cy5wdXNoKGBpbXBvcnQgJHt2YXJpYWJsZX0gZnJvbSAnJHtjc3NJbXBvcnR9P2lubGluZSc7XFxuYCk7XG4gICAgICAvLyBEdWUgdG8gY2hyb21lIGJ1ZyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD0zMzY4NzYgZm9udC1mYWNlIHdpbGwgbm90IHdvcmtcbiAgICAgIC8vIGluc2lkZSBzaGFkb3dSb290IHNvIHdlIG5lZWQgdG8gaW5qZWN0IGl0IHRoZXJlIGFsc28uXG4gICAgICBnbG9iYWxDc3NDb2RlLnB1c2goYGlmKHRhcmdldCAhPT0gZG9jdW1lbnQpIHtcbiAgICAgICAgcmVtb3ZlcnMucHVzaChpbmplY3RHbG9iYWxDc3MoJHt2YXJpYWJsZX0udG9TdHJpbmcoKSwgJycsIHRhcmdldCkpO1xuICAgIH1cXG4gICAgYCk7XG4gICAgICBnbG9iYWxDc3NDb2RlLnB1c2goXG4gICAgICAgIGByZW1vdmVycy5wdXNoKGluamVjdEdsb2JhbENzcygke3ZhcmlhYmxlfS50b1N0cmluZygpLCAnJHtDU1NJTVBPUlRfQ09NTUVOVH0nLCBkb2N1bWVudCkpO1xcbiAgICBgXG4gICAgICApO1xuICAgIH0pO1xuICB9XG4gIGlmICh0aGVtZVByb3BlcnRpZXMuaW1wb3J0Q3NzKSB7XG4gICAgY29uc3QgbWlzc2luZ01vZHVsZXMgPSBjaGVja01vZHVsZXModGhlbWVQcm9wZXJ0aWVzLmltcG9ydENzcyk7XG4gICAgaWYgKG1pc3NpbmdNb2R1bGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRocm93IEVycm9yKFxuICAgICAgICBcIk1pc3NpbmcgbnBtIG1vZHVsZXMgb3IgZmlsZXMgJ1wiICtcbiAgICAgICAgICBtaXNzaW5nTW9kdWxlcy5qb2luKFwiJywgJ1wiKSArXG4gICAgICAgICAgXCInIGZvciBpbXBvcnRDc3MgbWFya2VkIGluICd0aGVtZS5qc29uJy5cXG5cIiArXG4gICAgICAgICAgXCJJbnN0YWxsIG9yIHVwZGF0ZSBwYWNrYWdlKHMpIGJ5IGFkZGluZyBhIEBOcG1QYWNrYWdlIGFubm90YXRpb24gb3IgaW5zdGFsbCBpdCB1c2luZyAnbnBtL3BucG0vYnVuIGknXCJcbiAgICAgICk7XG4gICAgfVxuICAgIHRoZW1lUHJvcGVydGllcy5pbXBvcnRDc3MuZm9yRWFjaCgoY3NzUGF0aCkgPT4ge1xuICAgICAgY29uc3QgdmFyaWFibGUgPSAnbW9kdWxlJyArIGkrKztcbiAgICAgIGdsb2JhbEZpbGVDb250ZW50LnB1c2goYGltcG9ydCAnJHtjc3NQYXRofSc7XFxuYCk7XG4gICAgICBpbXBvcnRzLnB1c2goYGltcG9ydCAke3ZhcmlhYmxlfSBmcm9tICcke2Nzc1BhdGh9P2lubGluZSc7XFxuYCk7XG4gICAgICBzaGFkb3dPbmx5Q3NzLnB1c2goYHJlbW92ZXJzLnB1c2goaW5qZWN0R2xvYmFsQ3NzKCR7dmFyaWFibGV9LnRvU3RyaW5nKCksICcke0NTU0lNUE9SVF9DT01NRU5UfScsIHRhcmdldCkpO1xcbmApO1xuICAgIH0pO1xuICB9XG5cbiAgaWYgKGF1dG9JbmplY3RDb21wb25lbnRzKSB7XG4gICAgY29tcG9uZW50c0ZpbGVzLmZvckVhY2goKGNvbXBvbmVudENzcykgPT4ge1xuICAgICAgY29uc3QgZmlsZW5hbWUgPSBiYXNlbmFtZShjb21wb25lbnRDc3MpO1xuICAgICAgY29uc3QgdGFnID0gZmlsZW5hbWUucmVwbGFjZSgnLmNzcycsICcnKTtcbiAgICAgIGNvbnN0IHZhcmlhYmxlID0gY2FtZWxDYXNlKGZpbGVuYW1lKTtcbiAgICAgIGNvbXBvbmVudENzc0ltcG9ydHMucHVzaChcbiAgICAgICAgYGltcG9ydCAke3ZhcmlhYmxlfSBmcm9tICd0aGVtZXMvJHt0aGVtZU5hbWV9LyR7dGhlbWVDb21wb25lbnRzRm9sZGVyfS8ke2ZpbGVuYW1lfT9pbmxpbmUnO1xcbmBcbiAgICAgICk7XG4gICAgICAvLyBEb24ndCBmb3JtYXQgYXMgdGhlIGdlbmVyYXRlZCBmaWxlIGZvcm1hdHRpbmcgd2lsbCBnZXQgd29ua3khXG4gICAgICBjb25zdCBjb21wb25lbnRTdHJpbmcgPSBgcmVnaXN0ZXJTdHlsZXMoXG4gICAgICAgICcke3RhZ30nLFxuICAgICAgICB1bnNhZmVDU1MoJHt2YXJpYWJsZX0udG9TdHJpbmcoKSlcbiAgICAgICk7XG4gICAgICBgO1xuICAgICAgY29tcG9uZW50Q3NzQ29kZS5wdXNoKGNvbXBvbmVudFN0cmluZyk7XG4gICAgfSk7XG4gIH1cblxuICB0aGVtZUZpbGVDb250ZW50ICs9IGltcG9ydHMuam9pbignJyk7XG5cbiAgLy8gRG9uJ3QgZm9ybWF0IGFzIHRoZSBnZW5lcmF0ZWQgZmlsZSBmb3JtYXR0aW5nIHdpbGwgZ2V0IHdvbmt5IVxuICAvLyBJZiB0YXJnZXRzIGNoZWNrIHRoYXQgd2Ugb25seSByZWdpc3RlciB0aGUgc3R5bGUgcGFydHMgb25jZSwgY2hlY2tzIGV4aXN0IGZvciBnbG9iYWwgY3NzIGFuZCBjb21wb25lbnQgY3NzXG4gIGNvbnN0IHRoZW1lRmlsZUFwcGx5ID0gYFxuICBsZXQgdGhlbWVSZW1vdmVycyA9IG5ldyBXZWFrTWFwKCk7XG4gIGxldCB0YXJnZXRzID0gW107XG5cbiAgZXhwb3J0IGNvbnN0IGFwcGx5VGhlbWUgPSAodGFyZ2V0KSA9PiB7XG4gICAgY29uc3QgcmVtb3ZlcnMgPSBbXTtcbiAgICBpZiAodGFyZ2V0ICE9PSBkb2N1bWVudCkge1xuICAgICAgJHtzaGFkb3dPbmx5Q3NzLmpvaW4oJycpfVxuICAgIH1cbiAgICAke3BhcmVudFRoZW1lfVxuICAgICR7Z2xvYmFsQ3NzQ29kZS5qb2luKCcnKX1cblxuICAgIGlmIChpbXBvcnQubWV0YS5ob3QpIHtcbiAgICAgIHRhcmdldHMucHVzaChuZXcgV2Vha1JlZih0YXJnZXQpKTtcbiAgICAgIHRoZW1lUmVtb3ZlcnMuc2V0KHRhcmdldCwgcmVtb3ZlcnMpO1xuICAgIH1cblxuICB9XG4gIFxuYDtcbiAgY29tcG9uZW50c0ZpbGVDb250ZW50ICs9IGBcbiR7Y29tcG9uZW50Q3NzSW1wb3J0cy5qb2luKCcnKX1cblxuaWYgKCFkb2N1bWVudFsnJHtjb21wb25lbnRDc3NGbGFnfSddKSB7XG4gICR7Y29tcG9uZW50Q3NzQ29kZS5qb2luKCcnKX1cbiAgZG9jdW1lbnRbJyR7Y29tcG9uZW50Q3NzRmxhZ30nXSA9IHRydWU7XG59XG5cbmlmIChpbXBvcnQubWV0YS5ob3QpIHtcbiAgaW1wb3J0Lm1ldGEuaG90LmFjY2VwdCgobW9kdWxlKSA9PiB7XG4gICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICB9KTtcbn1cblxuYDtcblxuICB0aGVtZUZpbGVDb250ZW50ICs9IHRoZW1lRmlsZUFwcGx5O1xuICB0aGVtZUZpbGVDb250ZW50ICs9IGBcbmlmIChpbXBvcnQubWV0YS5ob3QpIHtcbiAgaW1wb3J0Lm1ldGEuaG90LmFjY2VwdCgobW9kdWxlKSA9PiB7XG5cbiAgICBpZiAobmVlZHNSZWxvYWRPbkNoYW5nZXMpIHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGFyZ2V0cy5mb3JFYWNoKHRhcmdldFJlZiA9PiB7XG4gICAgICAgIGNvbnN0IHRhcmdldCA9IHRhcmdldFJlZi5kZXJlZigpO1xuICAgICAgICBpZiAodGFyZ2V0KSB7XG4gICAgICAgICAgdGhlbWVSZW1vdmVycy5nZXQodGFyZ2V0KS5mb3JFYWNoKHJlbW92ZXIgPT4gcmVtb3ZlcigpKVxuICAgICAgICAgIG1vZHVsZS5hcHBseVRoZW1lKHRhcmdldCk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9KTtcblxuICBpbXBvcnQubWV0YS5ob3Qub24oJ3ZpdGU6YWZ0ZXJVcGRhdGUnLCAodXBkYXRlKSA9PiB7XG4gICAgZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoJ3ZhYWRpbi10aGVtZS11cGRhdGVkJywgeyBkZXRhaWw6IHVwZGF0ZSB9KSk7XG4gIH0pO1xufVxuXG5gO1xuXG4gIGdsb2JhbEltcG9ydENvbnRlbnQgKz0gYFxuJHtnbG9iYWxGaWxlQ29udGVudC5qb2luKCcnKX1cbmA7XG5cbiAgd3JpdGVJZkNoYW5nZWQocmVzb2x2ZShvdXRwdXRGb2xkZXIsIGdsb2JhbEZpbGVuYW1lKSwgZ2xvYmFsSW1wb3J0Q29udGVudCk7XG4gIHdyaXRlSWZDaGFuZ2VkKHJlc29sdmUob3V0cHV0Rm9sZGVyLCB0aGVtZUZpbGVuYW1lKSwgdGhlbWVGaWxlQ29udGVudCk7XG4gIHdyaXRlSWZDaGFuZ2VkKHJlc29sdmUob3V0cHV0Rm9sZGVyLCBjb21wb25lbnRzRmlsZW5hbWUpLCBjb21wb25lbnRzRmlsZUNvbnRlbnQpO1xufVxuXG5mdW5jdGlvbiB3cml0ZUlmQ2hhbmdlZChmaWxlLCBkYXRhKSB7XG4gIGlmICghZXhpc3RzU3luYyhmaWxlKSB8fCByZWFkRmlsZVN5bmMoZmlsZSwgeyBlbmNvZGluZzogJ3V0Zi04JyB9KSAhPT0gZGF0YSkge1xuICAgIHdyaXRlRmlsZVN5bmMoZmlsZSwgZGF0YSk7XG4gIH1cbn1cblxuLyoqXG4gKiBNYWtlIGdpdmVuIHN0cmluZyBpbnRvIGNhbWVsQ2FzZS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyIHN0cmluZyB0byBtYWtlIGludG8gY2FtZUNhc2VcbiAqIEByZXR1cm5zIHtzdHJpbmd9IGNhbWVsQ2FzZWQgdmVyc2lvblxuICovXG5mdW5jdGlvbiBjYW1lbENhc2Uoc3RyKSB7XG4gIHJldHVybiBzdHJcbiAgICAucmVwbGFjZSgvKD86Xlxcd3xbQS1aXXxcXGJcXHcpL2csIGZ1bmN0aW9uICh3b3JkLCBpbmRleCkge1xuICAgICAgcmV0dXJuIGluZGV4ID09PSAwID8gd29yZC50b0xvd2VyQ2FzZSgpIDogd29yZC50b1VwcGVyQ2FzZSgpO1xuICAgIH0pXG4gICAgLnJlcGxhY2UoL1xccysvZywgJycpXG4gICAgLnJlcGxhY2UoL1xcLnxcXC0vZywgJycpO1xufVxuXG5leHBvcnQgeyB3cml0ZVRoZW1lRmlsZXMgfTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcSm1peF9wYXJzZXJcXFxccGFyc2luZ193cGRcXFxccGFyc2luZ193cGRcXFxcYnVpbGRcXFxccGx1Z2luc1xcXFxhcHBsaWNhdGlvbi10aGVtZS1wbHVnaW5cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXEptaXhfcGFyc2VyXFxcXHBhcnNpbmdfd3BkXFxcXHBhcnNpbmdfd3BkXFxcXGJ1aWxkXFxcXHBsdWdpbnNcXFxcYXBwbGljYXRpb24tdGhlbWUtcGx1Z2luXFxcXHRoZW1lLWNvcHkuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L0ptaXhfcGFyc2VyL3BhcnNpbmdfd3BkL3BhcnNpbmdfd3BkL2J1aWxkL3BsdWdpbnMvYXBwbGljYXRpb24tdGhlbWUtcGx1Z2luL3RoZW1lLWNvcHkuanNcIjsvKlxuICogQ29weXJpZ2h0IDIwMDAtMjAyMyBWYWFkaW4gTHRkLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90XG4gKiB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZlxuICogdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVRcbiAqIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZVxuICogTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmQgbGltaXRhdGlvbnMgdW5kZXJcbiAqIHRoZSBMaWNlbnNlLlxuICovXG5cbi8qKlxuICogVGhpcyBjb250YWlucyBmdW5jdGlvbnMgYW5kIGZlYXR1cmVzIHVzZWQgdG8gY29weSB0aGVtZSBmaWxlcy5cbiAqL1xuXG5pbXBvcnQgeyByZWFkZGlyU3luYywgc3RhdFN5bmMsIG1rZGlyU3luYywgZXhpc3RzU3luYywgY29weUZpbGVTeW5jIH0gZnJvbSAnZnMnO1xuaW1wb3J0IHsgcmVzb2x2ZSwgYmFzZW5hbWUsIHJlbGF0aXZlLCBleHRuYW1lIH0gZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBnbG9iU3luYyB9IGZyb20gJ2dsb2InO1xuXG5jb25zdCBpZ25vcmVkRmlsZUV4dGVuc2lvbnMgPSBbJy5jc3MnLCAnLmpzJywgJy5qc29uJ107XG5cbi8qKlxuICogQ29weSB0aGVtZSBzdGF0aWMgcmVzb3VyY2VzIHRvIHN0YXRpYyBhc3NldHMgZm9sZGVyLiBBbGwgZmlsZXMgaW4gdGhlIHRoZW1lXG4gKiBmb2xkZXIgd2lsbCBiZSBjb3BpZWQgZXhjbHVkaW5nIGNzcywganMgYW5kIGpzb24gZmlsZXMgdGhhdCB3aWxsIGJlXG4gKiBoYW5kbGVkIGJ5IHdlYnBhY2sgYW5kIG5vdCBiZSBzaGFyZWQgYXMgc3RhdGljIGZpbGVzLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0aGVtZUZvbGRlciBGb2xkZXIgd2l0aCB0aGVtZSBmaWxlXG4gKiBAcGFyYW0ge3N0cmluZ30gcHJvamVjdFN0YXRpY0Fzc2V0c091dHB1dEZvbGRlciByZXNvdXJjZXMgb3V0cHV0IGZvbGRlclxuICogQHBhcmFtIHtvYmplY3R9IGxvZ2dlciBwbHVnaW4gbG9nZ2VyXG4gKi9cbmZ1bmN0aW9uIGNvcHlUaGVtZVJlc291cmNlcyh0aGVtZUZvbGRlciwgcHJvamVjdFN0YXRpY0Fzc2V0c091dHB1dEZvbGRlciwgbG9nZ2VyKSB7XG4gIGNvbnN0IHN0YXRpY0Fzc2V0c1RoZW1lRm9sZGVyID0gcmVzb2x2ZShwcm9qZWN0U3RhdGljQXNzZXRzT3V0cHV0Rm9sZGVyLCAndGhlbWVzJywgYmFzZW5hbWUodGhlbWVGb2xkZXIpKTtcbiAgY29uc3QgY29sbGVjdGlvbiA9IGNvbGxlY3RGb2xkZXJzKHRoZW1lRm9sZGVyLCBsb2dnZXIpO1xuXG4gIC8vIE9ubHkgY3JlYXRlIGFzc2V0cyBmb2xkZXIgaWYgdGhlcmUgYXJlIGZpbGVzIHRvIGNvcHkuXG4gIGlmIChjb2xsZWN0aW9uLmZpbGVzLmxlbmd0aCA+IDApIHtcbiAgICBta2RpclN5bmMoc3RhdGljQXNzZXRzVGhlbWVGb2xkZXIsIHsgcmVjdXJzaXZlOiB0cnVlIH0pO1xuICAgIC8vIGNyZWF0ZSBmb2xkZXJzIHdpdGhcbiAgICBjb2xsZWN0aW9uLmRpcmVjdG9yaWVzLmZvckVhY2goKGRpcmVjdG9yeSkgPT4ge1xuICAgICAgY29uc3QgcmVsYXRpdmVEaXJlY3RvcnkgPSByZWxhdGl2ZSh0aGVtZUZvbGRlciwgZGlyZWN0b3J5KTtcbiAgICAgIGNvbnN0IHRhcmdldERpcmVjdG9yeSA9IHJlc29sdmUoc3RhdGljQXNzZXRzVGhlbWVGb2xkZXIsIHJlbGF0aXZlRGlyZWN0b3J5KTtcblxuICAgICAgbWtkaXJTeW5jKHRhcmdldERpcmVjdG9yeSwgeyByZWN1cnNpdmU6IHRydWUgfSk7XG4gICAgfSk7XG5cbiAgICBjb2xsZWN0aW9uLmZpbGVzLmZvckVhY2goKGZpbGUpID0+IHtcbiAgICAgIGNvbnN0IHJlbGF0aXZlRmlsZSA9IHJlbGF0aXZlKHRoZW1lRm9sZGVyLCBmaWxlKTtcbiAgICAgIGNvbnN0IHRhcmdldEZpbGUgPSByZXNvbHZlKHN0YXRpY0Fzc2V0c1RoZW1lRm9sZGVyLCByZWxhdGl2ZUZpbGUpO1xuICAgICAgY29weUZpbGVJZkFic2VudE9yTmV3ZXIoZmlsZSwgdGFyZ2V0RmlsZSwgbG9nZ2VyKTtcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIENvbGxlY3QgYWxsIGZvbGRlcnMgd2l0aCBjb3B5YWJsZSBmaWxlcyBhbmQgYWxsIGZpbGVzIHRvIGJlIGNvcGllZC5cbiAqIEZvbGVkIHdpbGwgbm90IGJlIGFkZGVkIGlmIG5vIGZpbGVzIGluIGZvbGRlciBvciBzdWJmb2xkZXJzLlxuICpcbiAqIEZpbGVzIHdpbGwgbm90IGNvbnRhaW4gZmlsZXMgd2l0aCBpZ25vcmVkIGV4dGVuc2lvbnMgYW5kIGZvbGRlcnMgb25seSBjb250YWluaW5nIGlnbm9yZWQgZmlsZXMgd2lsbCBub3QgYmUgYWRkZWQuXG4gKlxuICogQHBhcmFtIGZvbGRlclRvQ29weSBmb2xkZXIgd2Ugd2lsbCBjb3B5IGZpbGVzIGZyb21cbiAqIEBwYXJhbSBsb2dnZXIgcGx1Z2luIGxvZ2dlclxuICogQHJldHVybiB7e2RpcmVjdG9yaWVzOiBbXSwgZmlsZXM6IFtdfX0gb2JqZWN0IGNvbnRhaW5pbmcgZGlyZWN0b3JpZXMgdG8gY3JlYXRlIGFuZCBmaWxlcyB0byBjb3B5XG4gKi9cbmZ1bmN0aW9uIGNvbGxlY3RGb2xkZXJzKGZvbGRlclRvQ29weSwgbG9nZ2VyKSB7XG4gIGNvbnN0IGNvbGxlY3Rpb24gPSB7IGRpcmVjdG9yaWVzOiBbXSwgZmlsZXM6IFtdIH07XG4gIGxvZ2dlci50cmFjZSgnZmlsZXMgaW4gZGlyZWN0b3J5JywgcmVhZGRpclN5bmMoZm9sZGVyVG9Db3B5KSk7XG4gIHJlYWRkaXJTeW5jKGZvbGRlclRvQ29weSkuZm9yRWFjaCgoZmlsZSkgPT4ge1xuICAgIGNvbnN0IGZpbGVUb0NvcHkgPSByZXNvbHZlKGZvbGRlclRvQ29weSwgZmlsZSk7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChzdGF0U3luYyhmaWxlVG9Db3B5KS5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgIGxvZ2dlci5kZWJ1ZygnR29pbmcgdGhyb3VnaCBkaXJlY3RvcnknLCBmaWxlVG9Db3B5KTtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gY29sbGVjdEZvbGRlcnMoZmlsZVRvQ29weSwgbG9nZ2VyKTtcbiAgICAgICAgaWYgKHJlc3VsdC5maWxlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgY29sbGVjdGlvbi5kaXJlY3Rvcmllcy5wdXNoKGZpbGVUb0NvcHkpO1xuICAgICAgICAgIGxvZ2dlci5kZWJ1ZygnQWRkaW5nIGRpcmVjdG9yeScsIGZpbGVUb0NvcHkpO1xuICAgICAgICAgIGNvbGxlY3Rpb24uZGlyZWN0b3JpZXMucHVzaC5hcHBseShjb2xsZWN0aW9uLmRpcmVjdG9yaWVzLCByZXN1bHQuZGlyZWN0b3JpZXMpO1xuICAgICAgICAgIGNvbGxlY3Rpb24uZmlsZXMucHVzaC5hcHBseShjb2xsZWN0aW9uLmZpbGVzLCByZXN1bHQuZmlsZXMpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKCFpZ25vcmVkRmlsZUV4dGVuc2lvbnMuaW5jbHVkZXMoZXh0bmFtZShmaWxlVG9Db3B5KSkpIHtcbiAgICAgICAgbG9nZ2VyLmRlYnVnKCdBZGRpbmcgZmlsZScsIGZpbGVUb0NvcHkpO1xuICAgICAgICBjb2xsZWN0aW9uLmZpbGVzLnB1c2goZmlsZVRvQ29weSk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGhhbmRsZU5vU3VjaEZpbGVFcnJvcihmaWxlVG9Db3B5LCBlcnJvciwgbG9nZ2VyKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gY29sbGVjdGlvbjtcbn1cblxuLyoqXG4gKiBDb3B5IGFueSBzdGF0aWMgbm9kZV9tb2R1bGVzIGFzc2V0cyBtYXJrZWQgaW4gdGhlbWUuanNvbiB0b1xuICogcHJvamVjdCBzdGF0aWMgYXNzZXRzIGZvbGRlci5cbiAqXG4gKiBUaGUgdGhlbWUuanNvbiBjb250ZW50IGZvciBhc3NldHMgaXMgc2V0IHVwIGFzOlxuICoge1xuICogICBhc3NldHM6IHtcbiAqICAgICBcIm5vZGVfbW9kdWxlIGlkZW50aWZpZXJcIjoge1xuICogICAgICAgXCJjb3B5LXJ1bGVcIjogXCJ0YXJnZXQvZm9sZGVyXCIsXG4gKiAgICAgfVxuICogICB9XG4gKiB9XG4gKlxuICogVGhpcyB3b3VsZCBtZWFuIHRoYXQgYW4gYXNzZXQgd291bGQgYmUgYnVpbHQgYXM6XG4gKiBcIkBmb3J0YXdlc29tZS9mb250YXdlc29tZS1mcmVlXCI6IHtcbiAqICAgXCJzdmdzL3JlZ3VsYXIvKipcIjogXCJmb3J0YXdlc29tZS9pY29uc1wiXG4gKiB9XG4gKiBXaGVyZSAnQGZvcnRhd2Vzb21lL2ZvbnRhd2Vzb21lLWZyZWUnIGlzIHRoZSBucG0gcGFja2FnZSwgJ3N2Z3MvcmVndWxhci8qKicgaXMgd2hhdCBzaG91bGQgYmUgY29waWVkXG4gKiBhbmQgJ2ZvcnRhd2Vzb21lL2ljb25zJyBpcyB0aGUgdGFyZ2V0IGRpcmVjdG9yeSB1bmRlciBwcm9qZWN0U3RhdGljQXNzZXRzT3V0cHV0Rm9sZGVyIHdoZXJlIHRoaW5nc1xuICogd2lsbCBnZXQgY29waWVkIHRvLlxuICpcbiAqIE5vdGUhIHRoZXJlIGNhbiBiZSBtdWx0aXBsZSBjb3B5LXJ1bGVzIHdpdGggdGFyZ2V0IGZvbGRlcnMgZm9yIG9uZSBucG0gcGFja2FnZSBhc3NldC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGhlbWVOYW1lIG5hbWUgb2YgdGhlIHRoZW1lIHdlIGFyZSBjb3B5aW5nIGFzc2V0cyBmb3JcbiAqIEBwYXJhbSB7anNvbn0gdGhlbWVQcm9wZXJ0aWVzIHRoZW1lIHByb3BlcnRpZXMganNvbiB3aXRoIGRhdGEgb24gYXNzZXRzXG4gKiBAcGFyYW0ge3N0cmluZ30gcHJvamVjdFN0YXRpY0Fzc2V0c091dHB1dEZvbGRlciBwcm9qZWN0IG91dHB1dCBmb2xkZXIgd2hlcmUgd2UgY29weSBhc3NldHMgdG8gdW5kZXIgdGhlbWUvW3RoZW1lTmFtZV1cbiAqIEBwYXJhbSB7b2JqZWN0fSBsb2dnZXIgcGx1Z2luIGxvZ2dlclxuICovXG5mdW5jdGlvbiBjb3B5U3RhdGljQXNzZXRzKHRoZW1lTmFtZSwgdGhlbWVQcm9wZXJ0aWVzLCBwcm9qZWN0U3RhdGljQXNzZXRzT3V0cHV0Rm9sZGVyLCBsb2dnZXIpIHtcbiAgY29uc3QgYXNzZXRzID0gdGhlbWVQcm9wZXJ0aWVzWydhc3NldHMnXTtcbiAgaWYgKCFhc3NldHMpIHtcbiAgICBsb2dnZXIuZGVidWcoJ25vIGFzc2V0cyB0byBoYW5kbGUgbm8gc3RhdGljIGFzc2V0cyB3ZXJlIGNvcGllZCcpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIG1rZGlyU3luYyhwcm9qZWN0U3RhdGljQXNzZXRzT3V0cHV0Rm9sZGVyLCB7XG4gICAgcmVjdXJzaXZlOiB0cnVlXG4gIH0pO1xuICBjb25zdCBtaXNzaW5nTW9kdWxlcyA9IGNoZWNrTW9kdWxlcyhPYmplY3Qua2V5cyhhc3NldHMpKTtcbiAgaWYgKG1pc3NpbmdNb2R1bGVzLmxlbmd0aCA+IDApIHtcbiAgICB0aHJvdyBFcnJvcihcbiAgICAgIFwiTWlzc2luZyBucG0gbW9kdWxlcyAnXCIgK1xuICAgICAgICBtaXNzaW5nTW9kdWxlcy5qb2luKFwiJywgJ1wiKSArXG4gICAgICAgIFwiJyBmb3IgYXNzZXRzIG1hcmtlZCBpbiAndGhlbWUuanNvbicuXFxuXCIgK1xuICAgICAgICBcIkluc3RhbGwgcGFja2FnZShzKSBieSBhZGRpbmcgYSBATnBtUGFja2FnZSBhbm5vdGF0aW9uIG9yIGluc3RhbGwgaXQgdXNpbmcgJ25wbS9wbnBtL2J1biBpJ1wiXG4gICAgKTtcbiAgfVxuICBPYmplY3Qua2V5cyhhc3NldHMpLmZvckVhY2goKG1vZHVsZSkgPT4ge1xuICAgIGNvbnN0IGNvcHlSdWxlcyA9IGFzc2V0c1ttb2R1bGVdO1xuICAgIE9iamVjdC5rZXlzKGNvcHlSdWxlcykuZm9yRWFjaCgoY29weVJ1bGUpID0+IHtcbiAgICAgIGNvbnN0IG5vZGVTb3VyY2VzID0gcmVzb2x2ZSgnbm9kZV9tb2R1bGVzLycsIG1vZHVsZSwgY29weVJ1bGUpO1xuICAgICAgY29uc3QgZmlsZXMgPSBnbG9iU3luYyhub2RlU291cmNlcywgeyBub2RpcjogdHJ1ZSB9KTtcbiAgICAgIGNvbnN0IHRhcmdldEZvbGRlciA9IHJlc29sdmUocHJvamVjdFN0YXRpY0Fzc2V0c091dHB1dEZvbGRlciwgJ3RoZW1lcycsIHRoZW1lTmFtZSwgY29weVJ1bGVzW2NvcHlSdWxlXSk7XG5cbiAgICAgIG1rZGlyU3luYyh0YXJnZXRGb2xkZXIsIHtcbiAgICAgICAgcmVjdXJzaXZlOiB0cnVlXG4gICAgICB9KTtcbiAgICAgIGZpbGVzLmZvckVhY2goKGZpbGUpID0+IHtcbiAgICAgICAgY29uc3QgY29weVRhcmdldCA9IHJlc29sdmUodGFyZ2V0Rm9sZGVyLCBiYXNlbmFtZShmaWxlKSk7XG4gICAgICAgIGNvcHlGaWxlSWZBYnNlbnRPck5ld2VyKGZpbGUsIGNvcHlUYXJnZXQsIGxvZ2dlcik7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGNoZWNrTW9kdWxlcyhtb2R1bGVzKSB7XG4gIGNvbnN0IG1pc3NpbmcgPSBbXTtcblxuICBtb2R1bGVzLmZvckVhY2goKG1vZHVsZSkgPT4ge1xuICAgIGlmICghZXhpc3RzU3luYyhyZXNvbHZlKCdub2RlX21vZHVsZXMvJywgbW9kdWxlKSkpIHtcbiAgICAgIG1pc3NpbmcucHVzaChtb2R1bGUpO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIG1pc3Npbmc7XG59XG5cbi8qKlxuICogQ29waWVzIGdpdmVuIGZpbGUgdG8gYSBnaXZlbiB0YXJnZXQgcGF0aCwgaWYgdGFyZ2V0IGZpbGUgZG9lc24ndCBleGlzdCBvciBpZlxuICogZmlsZSB0byBjb3B5IGlzIG5ld2VyLlxuICogQHBhcmFtIHtzdHJpbmd9IGZpbGVUb0NvcHkgcGF0aCBvZiB0aGUgZmlsZSB0byBjb3B5XG4gKiBAcGFyYW0ge3N0cmluZ30gY29weVRhcmdldCBwYXRoIG9mIHRoZSB0YXJnZXQgZmlsZVxuICogQHBhcmFtIHtvYmplY3R9IGxvZ2dlciBwbHVnaW4gbG9nZ2VyXG4gKi9cbmZ1bmN0aW9uIGNvcHlGaWxlSWZBYnNlbnRPck5ld2VyKGZpbGVUb0NvcHksIGNvcHlUYXJnZXQsIGxvZ2dlcikge1xuICB0cnkge1xuICAgIGlmICghZXhpc3RzU3luYyhjb3B5VGFyZ2V0KSB8fCBzdGF0U3luYyhjb3B5VGFyZ2V0KS5tdGltZSA8IHN0YXRTeW5jKGZpbGVUb0NvcHkpLm10aW1lKSB7XG4gICAgICBsb2dnZXIudHJhY2UoJ0NvcHlpbmc6ICcsIGZpbGVUb0NvcHksICc9PicsIGNvcHlUYXJnZXQpO1xuICAgICAgY29weUZpbGVTeW5jKGZpbGVUb0NvcHksIGNvcHlUYXJnZXQpO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBoYW5kbGVOb1N1Y2hGaWxlRXJyb3IoZmlsZVRvQ29weSwgZXJyb3IsIGxvZ2dlcik7XG4gIH1cbn1cblxuLy8gSWdub3JlcyBlcnJvcnMgZHVlIHRvIGZpbGUgbWlzc2luZyBkdXJpbmcgdGhlbWUgcHJvY2Vzc2luZ1xuLy8gVGhpcyBtYXkgaGFwcGVuIGZvciBleGFtcGxlIHdoZW4gYW4gSURFIGNyZWF0ZXMgYSB0ZW1wb3JhcnkgZmlsZVxuLy8gYW5kIHRoZW4gaW1tZWRpYXRlbHkgZGVsZXRlcyBpdFxuZnVuY3Rpb24gaGFuZGxlTm9TdWNoRmlsZUVycm9yKGZpbGUsIGVycm9yLCBsb2dnZXIpIHtcbiAgaWYgKGVycm9yLmNvZGUgPT09ICdFTk9FTlQnKSB7XG4gICAgbG9nZ2VyLndhcm4oJ0lnbm9yaW5nIG5vdCBleGlzdGluZyBmaWxlICcgKyBmaWxlICsgJy4gRmlsZSBtYXkgaGF2ZSBiZWVuIGRlbGV0ZWQgZHVyaW5nIHRoZW1lIHByb2Nlc3NpbmcuJyk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgZXJyb3I7XG4gIH1cbn1cblxuZXhwb3J0IHsgY2hlY2tNb2R1bGVzLCBjb3B5U3RhdGljQXNzZXRzLCBjb3B5VGhlbWVSZXNvdXJjZXMgfTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcSm1peF9wYXJzZXJcXFxccGFyc2luZ193cGRcXFxccGFyc2luZ193cGRcXFxcYnVpbGRcXFxccGx1Z2luc1xcXFx0aGVtZS1sb2FkZXJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXEptaXhfcGFyc2VyXFxcXHBhcnNpbmdfd3BkXFxcXHBhcnNpbmdfd3BkXFxcXGJ1aWxkXFxcXHBsdWdpbnNcXFxcdGhlbWUtbG9hZGVyXFxcXHRoZW1lLWxvYWRlci11dGlscy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovSm1peF9wYXJzZXIvcGFyc2luZ193cGQvcGFyc2luZ193cGQvYnVpbGQvcGx1Z2lucy90aGVtZS1sb2FkZXIvdGhlbWUtbG9hZGVyLXV0aWxzLmpzXCI7aW1wb3J0IHsgZXhpc3RzU3luYywgcmVhZEZpbGVTeW5jIH0gZnJvbSAnZnMnO1xuaW1wb3J0IHsgcmVzb2x2ZSwgYmFzZW5hbWUgfSBmcm9tICdwYXRoJztcbmltcG9ydCB7IGdsb2JTeW5jIH0gZnJvbSAnZ2xvYic7XG5cbi8vIENvbGxlY3QgZ3JvdXBzIFt1cmwoXSBbJ3xcIl1vcHRpb25hbCAnLi98Li4vJywgZmlsZSBwYXJ0IGFuZCBlbmQgb2YgdXJsXG5jb25zdCB1cmxNYXRjaGVyID0gLyh1cmxcXChcXHMqKShcXCd8XFxcIik/KFxcLlxcL3xcXC5cXC5cXC8pKFxcUyopKFxcMlxccypcXCkpL2c7XG5cbmZ1bmN0aW9uIGFzc2V0c0NvbnRhaW5zKGZpbGVVcmwsIHRoZW1lRm9sZGVyLCBsb2dnZXIpIHtcbiAgY29uc3QgdGhlbWVQcm9wZXJ0aWVzID0gZ2V0VGhlbWVQcm9wZXJ0aWVzKHRoZW1lRm9sZGVyKTtcbiAgaWYgKCF0aGVtZVByb3BlcnRpZXMpIHtcbiAgICBsb2dnZXIuZGVidWcoJ05vIHRoZW1lIHByb3BlcnRpZXMgZm91bmQuJyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGNvbnN0IGFzc2V0cyA9IHRoZW1lUHJvcGVydGllc1snYXNzZXRzJ107XG4gIGlmICghYXNzZXRzKSB7XG4gICAgbG9nZ2VyLmRlYnVnKCdObyBkZWZpbmVkIGFzc2V0cyBpbiB0aGVtZSBwcm9wZXJ0aWVzJyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8vIEdvIHRocm91Z2ggZWFjaCBhc3NldCBtb2R1bGVcbiAgZm9yIChsZXQgbW9kdWxlIG9mIE9iamVjdC5rZXlzKGFzc2V0cykpIHtcbiAgICBjb25zdCBjb3B5UnVsZXMgPSBhc3NldHNbbW9kdWxlXTtcbiAgICAvLyBHbyB0aHJvdWdoIGVhY2ggY29weSBydWxlXG4gICAgZm9yIChsZXQgY29weVJ1bGUgb2YgT2JqZWN0LmtleXMoY29weVJ1bGVzKSkge1xuICAgICAgLy8gaWYgZmlsZSBzdGFydHMgd2l0aCBjb3B5UnVsZSB0YXJnZXQgY2hlY2sgaWYgZmlsZSB3aXRoIHBhdGggYWZ0ZXIgY29weSB0YXJnZXQgY2FuIGJlIGZvdW5kXG4gICAgICBpZiAoZmlsZVVybC5zdGFydHNXaXRoKGNvcHlSdWxlc1tjb3B5UnVsZV0pKSB7XG4gICAgICAgIGNvbnN0IHRhcmdldEZpbGUgPSBmaWxlVXJsLnJlcGxhY2UoY29weVJ1bGVzW2NvcHlSdWxlXSwgJycpO1xuICAgICAgICBjb25zdCBmaWxlcyA9IGdsb2JTeW5jKHJlc29sdmUoJ25vZGVfbW9kdWxlcy8nLCBtb2R1bGUsIGNvcHlSdWxlKSwgeyBub2RpcjogdHJ1ZSB9KTtcblxuICAgICAgICBmb3IgKGxldCBmaWxlIG9mIGZpbGVzKSB7XG4gICAgICAgICAgaWYgKGZpbGUuZW5kc1dpdGgodGFyZ2V0RmlsZSkpIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gZ2V0VGhlbWVQcm9wZXJ0aWVzKHRoZW1lRm9sZGVyKSB7XG4gIGNvbnN0IHRoZW1lUHJvcGVydHlGaWxlID0gcmVzb2x2ZSh0aGVtZUZvbGRlciwgJ3RoZW1lLmpzb24nKTtcbiAgaWYgKCFleGlzdHNTeW5jKHRoZW1lUHJvcGVydHlGaWxlKSkge1xuICAgIHJldHVybiB7fTtcbiAgfVxuICBjb25zdCB0aGVtZVByb3BlcnR5RmlsZUFzU3RyaW5nID0gcmVhZEZpbGVTeW5jKHRoZW1lUHJvcGVydHlGaWxlKTtcbiAgaWYgKHRoZW1lUHJvcGVydHlGaWxlQXNTdHJpbmcubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG4gIHJldHVybiBKU09OLnBhcnNlKHRoZW1lUHJvcGVydHlGaWxlQXNTdHJpbmcpO1xufVxuXG5mdW5jdGlvbiByZXdyaXRlQ3NzVXJscyhzb3VyY2UsIGhhbmRsZWRSZXNvdXJjZUZvbGRlciwgdGhlbWVGb2xkZXIsIGxvZ2dlciwgb3B0aW9ucykge1xuICBzb3VyY2UgPSBzb3VyY2UucmVwbGFjZSh1cmxNYXRjaGVyLCBmdW5jdGlvbiAobWF0Y2gsIHVybCwgcXVvdGVNYXJrLCByZXBsYWNlLCBmaWxlVXJsLCBlbmRTdHJpbmcpIHtcbiAgICBsZXQgYWJzb2x1dGVQYXRoID0gcmVzb2x2ZShoYW5kbGVkUmVzb3VyY2VGb2xkZXIsIHJlcGxhY2UsIGZpbGVVcmwpO1xuICAgIGNvbnN0IGV4aXN0aW5nVGhlbWVSZXNvdXJjZSA9IGFic29sdXRlUGF0aC5zdGFydHNXaXRoKHRoZW1lRm9sZGVyKSAmJiBleGlzdHNTeW5jKGFic29sdXRlUGF0aCk7XG4gICAgaWYgKGV4aXN0aW5nVGhlbWVSZXNvdXJjZSB8fCBhc3NldHNDb250YWlucyhmaWxlVXJsLCB0aGVtZUZvbGRlciwgbG9nZ2VyKSkge1xuICAgICAgLy8gQWRkaW5nIC4vIHdpbGwgc2tpcCBjc3MtbG9hZGVyLCB3aGljaCBzaG91bGQgYmUgZG9uZSBmb3IgYXNzZXQgZmlsZXNcbiAgICAgIC8vIEluIGEgcHJvZHVjdGlvbiBidWlsZCwgdGhlIGNzcyBmaWxlIGlzIGluIFZBQURJTi9idWlsZCBhbmQgc3RhdGljIGZpbGVzIGFyZSBpbiBWQUFESU4vc3RhdGljLCBzbyAuLi9zdGF0aWMgbmVlZHMgdG8gYmUgYWRkZWRcbiAgICAgIGNvbnN0IHJlcGxhY2VtZW50ID0gb3B0aW9ucy5kZXZNb2RlID8gJy4vJyA6ICcuLi9zdGF0aWMvJztcblxuICAgICAgY29uc3Qgc2tpcExvYWRlciA9IGV4aXN0aW5nVGhlbWVSZXNvdXJjZSA/ICcnIDogcmVwbGFjZW1lbnQ7XG4gICAgICBjb25zdCBmcm9udGVuZFRoZW1lRm9sZGVyID0gc2tpcExvYWRlciArICd0aGVtZXMvJyArIGJhc2VuYW1lKHRoZW1lRm9sZGVyKTtcbiAgICAgIGxvZ2dlci5kZWJ1ZyhcbiAgICAgICAgJ1VwZGF0aW5nIHVybCBmb3IgZmlsZScsXG4gICAgICAgIFwiJ1wiICsgcmVwbGFjZSArIGZpbGVVcmwgKyBcIidcIixcbiAgICAgICAgJ3RvIHVzZScsXG4gICAgICAgIFwiJ1wiICsgZnJvbnRlbmRUaGVtZUZvbGRlciArICcvJyArIGZpbGVVcmwgKyBcIidcIlxuICAgICAgKTtcbiAgICAgIGNvbnN0IHBhdGhSZXNvbHZlZCA9IGFic29sdXRlUGF0aC5zdWJzdHJpbmcodGhlbWVGb2xkZXIubGVuZ3RoKS5yZXBsYWNlKC9cXFxcL2csICcvJyk7XG5cbiAgICAgIC8vIGtlZXAgdGhlIHVybCB0aGUgc2FtZSBleGNlcHQgcmVwbGFjZSB0aGUgLi8gb3IgLi4vIHRvIHRoZW1lcy9bdGhlbWVGb2xkZXJdXG4gICAgICByZXR1cm4gdXJsICsgKHF1b3RlTWFyayA/PyAnJykgKyBmcm9udGVuZFRoZW1lRm9sZGVyICsgcGF0aFJlc29sdmVkICsgZW5kU3RyaW5nO1xuICAgIH0gZWxzZSBpZiAob3B0aW9ucy5kZXZNb2RlKSB7XG4gICAgICBsb2dnZXIubG9nKFwiTm8gcmV3cml0ZSBmb3IgJ1wiLCBtYXRjaCwgXCInIGFzIHRoZSBmaWxlIHdhcyBub3QgZm91bmQuXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJbiBwcm9kdWN0aW9uLCB0aGUgY3NzIGlzIGluIFZBQURJTi9idWlsZCBidXQgdGhlIHRoZW1lIGZpbGVzIGFyZSBpbiAuXG4gICAgICByZXR1cm4gdXJsICsgKHF1b3RlTWFyayA/PyAnJykgKyAnLi4vLi4vJyArIGZpbGVVcmwgKyBlbmRTdHJpbmc7XG4gICAgfVxuICAgIHJldHVybiBtYXRjaDtcbiAgfSk7XG4gIHJldHVybiBzb3VyY2U7XG59XG5cbmV4cG9ydCB7IHJld3JpdGVDc3NVcmxzIH07XG4iLCAie1xuICBcImZyb250ZW5kRm9sZGVyXCI6IFwiRDovSm1peF9wYXJzZXIvcGFyc2luZ193cGQvcGFyc2luZ193cGQvZnJvbnRlbmRcIixcbiAgXCJ0aGVtZUZvbGRlclwiOiBcInRoZW1lc1wiLFxuICBcInRoZW1lUmVzb3VyY2VGb2xkZXJcIjogXCJEOi9KbWl4X3BhcnNlci9wYXJzaW5nX3dwZC9wYXJzaW5nX3dwZC9mcm9udGVuZC9nZW5lcmF0ZWQvamFyLXJlc291cmNlc1wiLFxuICBcInN0YXRpY091dHB1dFwiOiBcIkQ6L0ptaXhfcGFyc2VyL3BhcnNpbmdfd3BkL3BhcnNpbmdfd3BkL2J1aWxkL2NsYXNzZXMvTUVUQS1JTkYvVkFBRElOL3dlYmFwcC9WQUFESU4vc3RhdGljXCIsXG4gIFwiZ2VuZXJhdGVkRm9sZGVyXCI6IFwiZ2VuZXJhdGVkXCIsXG4gIFwic3RhdHNPdXRwdXRcIjogXCJEOlxcXFxKbWl4X3BhcnNlclxcXFxwYXJzaW5nX3dwZFxcXFxwYXJzaW5nX3dwZFxcXFxidWlsZFxcXFxjbGFzc2VzXFxcXE1FVEEtSU5GXFxcXFZBQURJTlxcXFxjb25maWdcIixcbiAgXCJmcm9udGVuZEJ1bmRsZU91dHB1dFwiOiBcIkQ6XFxcXEptaXhfcGFyc2VyXFxcXHBhcnNpbmdfd3BkXFxcXHBhcnNpbmdfd3BkXFxcXGJ1aWxkXFxcXGNsYXNzZXNcXFxcTUVUQS1JTkZcXFxcVkFBRElOXFxcXHdlYmFwcFwiLFxuICBcImRldkJ1bmRsZU91dHB1dFwiOiBcIkQ6L0ptaXhfcGFyc2VyL3BhcnNpbmdfd3BkL3BhcnNpbmdfd3BkL2J1aWxkL2Rldi1idW5kbGUvd2ViYXBwXCIsXG4gIFwiZGV2QnVuZGxlU3RhdHNPdXRwdXRcIjogXCJEOi9KbWl4X3BhcnNlci9wYXJzaW5nX3dwZC9wYXJzaW5nX3dwZC9idWlsZC9kZXYtYnVuZGxlL2NvbmZpZ1wiLFxuICBcImphclJlc291cmNlc0ZvbGRlclwiOiBcIkQ6L0ptaXhfcGFyc2VyL3BhcnNpbmdfd3BkL3BhcnNpbmdfd3BkL2Zyb250ZW5kL2dlbmVyYXRlZC9qYXItcmVzb3VyY2VzXCIsXG4gIFwidGhlbWVOYW1lXCI6IFwicGFyc2luZ193cGRcIixcbiAgXCJjbGllbnRTZXJ2aWNlV29ya2VyU291cmNlXCI6IFwiRDpcXFxcSm1peF9wYXJzZXJcXFxccGFyc2luZ193cGRcXFxccGFyc2luZ193cGRcXFxcYnVpbGRcXFxcc3cudHNcIixcbiAgXCJwd2FFbmFibGVkXCI6IHRydWUsXG4gIFwib2ZmbGluZUVuYWJsZWRcIjogdHJ1ZSxcbiAgXCJvZmZsaW5lUGF0aFwiOiBcIicuJ1wiXG59IiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxKbWl4X3BhcnNlclxcXFxwYXJzaW5nX3dwZFxcXFxwYXJzaW5nX3dwZFxcXFxidWlsZFxcXFxwbHVnaW5zXFxcXHJvbGx1cC1wbHVnaW4tcG9zdGNzcy1saXQtY3VzdG9tXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxKbWl4X3BhcnNlclxcXFxwYXJzaW5nX3dwZFxcXFxwYXJzaW5nX3dwZFxcXFxidWlsZFxcXFxwbHVnaW5zXFxcXHJvbGx1cC1wbHVnaW4tcG9zdGNzcy1saXQtY3VzdG9tXFxcXHJvbGx1cC1wbHVnaW4tcG9zdGNzcy1saXQuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L0ptaXhfcGFyc2VyL3BhcnNpbmdfd3BkL3BhcnNpbmdfd3BkL2J1aWxkL3BsdWdpbnMvcm9sbHVwLXBsdWdpbi1wb3N0Y3NzLWxpdC1jdXN0b20vcm9sbHVwLXBsdWdpbi1wb3N0Y3NzLWxpdC5qc1wiOy8qKlxuICogTUlUIExpY2Vuc2VcblxuQ29weXJpZ2h0IChjKSAyMDE5IFVtYmVydG8gUGVwYXRvXG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbmluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbnRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbmNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXG5jb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG5JTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbkZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbk9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG5TT0ZUV0FSRS5cbiAqL1xuLy8gVGhpcyBpcyBodHRwczovL2dpdGh1Yi5jb20vdW1ib3BlcGF0by9yb2xsdXAtcGx1Z2luLXBvc3Rjc3MtbGl0IDIuMC4wICsgaHR0cHM6Ly9naXRodWIuY29tL3VtYm9wZXBhdG8vcm9sbHVwLXBsdWdpbi1wb3N0Y3NzLWxpdC9wdWxsLzU0XG4vLyB0byBtYWtlIGl0IHdvcmsgd2l0aCBWaXRlIDNcbi8vIE9uY2UgLyBpZiBodHRwczovL2dpdGh1Yi5jb20vdW1ib3BlcGF0by9yb2xsdXAtcGx1Z2luLXBvc3Rjc3MtbGl0L3B1bGwvNTQgaXMgbWVyZ2VkIHRoaXMgc2hvdWxkIGJlIHJlbW92ZWQgYW5kIHJvbGx1cC1wbHVnaW4tcG9zdGNzcy1saXQgc2hvdWxkIGJlIHVzZWQgaW5zdGVhZFxuXG5pbXBvcnQgeyBjcmVhdGVGaWx0ZXIgfSBmcm9tICdAcm9sbHVwL3BsdWdpbnV0aWxzJztcbmltcG9ydCB0cmFuc2Zvcm1Bc3QgZnJvbSAndHJhbnNmb3JtLWFzdCc7XG5cbmNvbnN0IGFzc2V0VXJsUkUgPSAvX19WSVRFX0FTU0VUX18oW1xcdyRdKylfXyg/OlxcJF8oLio/KV9fKT8vZ1xuXG5jb25zdCBlc2NhcGUgPSAoc3RyKSA9PlxuICBzdHJcbiAgICAucmVwbGFjZShhc3NldFVybFJFLCAnJHt1bnNhZmVDU1NUYWcoXCJfX1ZJVEVfQVNTRVRfXyQxX18kMlwiKX0nKVxuICAgIC5yZXBsYWNlKC9gL2csICdcXFxcYCcpXG4gICAgLnJlcGxhY2UoL1xcXFwoPyFgKS9nLCAnXFxcXFxcXFwnKTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcG9zdGNzc0xpdChvcHRpb25zID0ge30pIHtcbiAgY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgaW5jbHVkZTogJyoqLyoue2Nzcyxzc3MscGNzcyxzdHlsLHN0eWx1cyxzYXNzLHNjc3MsbGVzc30nLFxuICAgIGV4Y2x1ZGU6IG51bGwsXG4gICAgaW1wb3J0UGFja2FnZTogJ2xpdCdcbiAgfTtcblxuICBjb25zdCBvcHRzID0geyAuLi5kZWZhdWx0T3B0aW9ucywgLi4ub3B0aW9ucyB9O1xuICBjb25zdCBmaWx0ZXIgPSBjcmVhdGVGaWx0ZXIob3B0cy5pbmNsdWRlLCBvcHRzLmV4Y2x1ZGUpO1xuXG4gIHJldHVybiB7XG4gICAgbmFtZTogJ3Bvc3Rjc3MtbGl0JyxcbiAgICBlbmZvcmNlOiAncG9zdCcsXG4gICAgdHJhbnNmb3JtKGNvZGUsIGlkKSB7XG4gICAgICBpZiAoIWZpbHRlcihpZCkpIHJldHVybjtcbiAgICAgIGNvbnN0IGFzdCA9IHRoaXMucGFyc2UoY29kZSwge30pO1xuICAgICAgLy8gZXhwb3J0IGRlZmF1bHQgY29uc3QgY3NzO1xuICAgICAgbGV0IGRlZmF1bHRFeHBvcnROYW1lO1xuXG4gICAgICAvLyBleHBvcnQgZGVmYXVsdCAnLi4uJztcbiAgICAgIGxldCBpc0RlY2xhcmF0aW9uTGl0ZXJhbCA9IGZhbHNlO1xuICAgICAgY29uc3QgbWFnaWNTdHJpbmcgPSB0cmFuc2Zvcm1Bc3QoY29kZSwgeyBhc3Q6IGFzdCB9LCAobm9kZSkgPT4ge1xuICAgICAgICBpZiAobm9kZS50eXBlID09PSAnRXhwb3J0RGVmYXVsdERlY2xhcmF0aW9uJykge1xuICAgICAgICAgIGRlZmF1bHRFeHBvcnROYW1lID0gbm9kZS5kZWNsYXJhdGlvbi5uYW1lO1xuXG4gICAgICAgICAgaXNEZWNsYXJhdGlvbkxpdGVyYWwgPSBub2RlLmRlY2xhcmF0aW9uLnR5cGUgPT09ICdMaXRlcmFsJztcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGlmICghZGVmYXVsdEV4cG9ydE5hbWUgJiYgIWlzRGVjbGFyYXRpb25MaXRlcmFsKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIG1hZ2ljU3RyaW5nLndhbGsoKG5vZGUpID0+IHtcbiAgICAgICAgaWYgKGRlZmF1bHRFeHBvcnROYW1lICYmIG5vZGUudHlwZSA9PT0gJ1ZhcmlhYmxlRGVjbGFyYXRpb24nKSB7XG4gICAgICAgICAgY29uc3QgZXhwb3J0ZWRWYXIgPSBub2RlLmRlY2xhcmF0aW9ucy5maW5kKChkKSA9PiBkLmlkLm5hbWUgPT09IGRlZmF1bHRFeHBvcnROYW1lKTtcbiAgICAgICAgICBpZiAoZXhwb3J0ZWRWYXIpIHtcbiAgICAgICAgICAgIGV4cG9ydGVkVmFyLmluaXQuZWRpdC51cGRhdGUoYGNzc1RhZ1xcYCR7ZXNjYXBlKGV4cG9ydGVkVmFyLmluaXQudmFsdWUpfVxcYGApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc0RlY2xhcmF0aW9uTGl0ZXJhbCAmJiBub2RlLnR5cGUgPT09ICdFeHBvcnREZWZhdWx0RGVjbGFyYXRpb24nKSB7XG4gICAgICAgICAgbm9kZS5kZWNsYXJhdGlvbi5lZGl0LnVwZGF0ZShgY3NzVGFnXFxgJHtlc2NhcGUobm9kZS5kZWNsYXJhdGlvbi52YWx1ZSl9XFxgYCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgbWFnaWNTdHJpbmcucHJlcGVuZChgaW1wb3J0IHtjc3MgYXMgY3NzVGFnLCB1bnNhZmVDU1MgYXMgdW5zYWZlQ1NTVGFnfSBmcm9tICcke29wdHMuaW1wb3J0UGFja2FnZX0nO1xcbmApO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgY29kZTogbWFnaWNTdHJpbmcudG9TdHJpbmcoKSxcbiAgICAgICAgbWFwOiBtYWdpY1N0cmluZy5nZW5lcmF0ZU1hcCh7XG4gICAgICAgICAgaGlyZXM6IHRydWVcbiAgICAgICAgfSlcbiAgICAgIH07XG4gICAgfVxuICB9O1xufTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcSm1peF9wYXJzZXJcXFxccGFyc2luZ193cGRcXFxccGFyc2luZ193cGRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXEptaXhfcGFyc2VyXFxcXHBhcnNpbmdfd3BkXFxcXHBhcnNpbmdfd3BkXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9KbWl4X3BhcnNlci9wYXJzaW5nX3dwZC9wYXJzaW5nX3dwZC92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IFVzZXJDb25maWdGbiB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHsgb3ZlcnJpZGVWYWFkaW5Db25maWcgfSBmcm9tICcuL3ZpdGUuZ2VuZXJhdGVkJztcblxuY29uc3QgY3VzdG9tQ29uZmlnOiBVc2VyQ29uZmlnRm4gPSAoZW52KSA9PiAoe1xuICAvLyBIZXJlIHlvdSBjYW4gYWRkIGN1c3RvbSBWaXRlIHBhcmFtZXRlcnNcbiAgLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBvdmVycmlkZVZhYWRpbkNvbmZpZyhjdXN0b21Db25maWcpO1xuIl0sCiAgIm1hcHBpbmdz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O0FBQUE7QUFHN0M7QUFFQSxJQUFPLHNCQUFRLHFCQUFxQixZQUFZOyIsCiAgIm5hbWVzIjogWyJleGlzdHNTeW5jIiwgIm1rZGlyU3luYyIsICJyZWFkZGlyU3luYyIsICJyZWFkRmlsZVN5bmMiLCAid3JpdGVGaWxlU3luYyIsICJleGlzdHNTeW5jIiwgInJlYWRGaWxlU3luYyIsICJyZXNvbHZlIiwgImdsb2JTeW5jIiwgInJlc29sdmUiLCAiYmFzZW5hbWUiLCAiZXhpc3RzU3luYyIsICJ0aGVtZUZvbGRlciIsICJ0aGVtZUZvbGRlciIsICJyZXNvbHZlIiwgImdsb2JTeW5jIiwgImV4aXN0c1N5bmMiLCAiYmFzZW5hbWUiLCAidmFyaWFibGUiLCAiZmlsZW5hbWUiLCAiZXhpc3RzU3luYyIsICJyZXNvbHZlIiwgInRoZW1lRm9sZGVyIiwgInJlYWRGaWxlU3luYyIsICJleGlzdHNTeW5jIiwgInJlYWRGaWxlU3luYyIsICJyZXNvbHZlIiwgImJhc2VuYW1lIiwgImdsb2JTeW5jIiwgInRoZW1lRm9sZGVyIiwgImdldFRoZW1lUHJvcGVydGllcyIsICJnbG9iU3luYyIsICJyZXNvbHZlIiwgImV4aXN0c1N5bmMiLCAicmVhZEZpbGVTeW5jIiwgInJlcGxhY2UiLCAiYmFzZW5hbWUiLCAicmVxdWlyZSIsICJleGlzdHNTeW5jIiwgInJlYWRGaWxlU3luYyIsICJta2RpclN5bmMiLCAiYnVuZGxlIiwgInJlYWRkaXJTeW5jIiwgInRoZW1lRm9sZGVyIiwgIndyaXRlRmlsZVN5bmMiLCAiZSIsICJwYXRoIiwgImN1c3RvbUNvbmZpZyJdCn0K
