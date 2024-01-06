import { defineConfig } from "vite";
// import obfuscator from 'rollup-plugin-obfuscator';

export default defineConfig({
    build: {
      // 压缩
      minify: false,
      rollupOptions: {
        //忽略打包vue文件
        external: [],
        //input: ["index.ts"],
        output: {
          globals: {
            
          },
          dir: "dist",
        },
      },
      lib: {
        entry: "./index.js",
        name: "vandf",
        fileName: (format) => `vandf.js`,//.${format}
        formats: ["esm"],//, "umd", "cjs"
      },
    },
    // esbuild: {
    //     drop: ['console', 'debugger'],//打包去除
    // },
    // plugins: [
        // obfuscator({
        //   global:false,
        //   // options配置项实际为 javascript-obfuscator 选项，具体可查看https://github.com/javascript-obfuscator/javascript-obfuscator
        //   options: {
        //     compact: true,
        //     controlFlowFlattening: true,
        //     controlFlowFlatteningThreshold: 0.75,
        //     numbersToExpressions: true,
        //     simplify: true,
        //     stringArrayShuffle: true,
        //     splitStrings: true,
        //     splitStringsChunkLength: 10,
        //     rotateUnicodeArray: true,
        //     deadCodeInjection: true,
        //     deadCodeInjectionThreshold: 0.4,
        //     debugProtection: false,
        //     debugProtectionInterval: 2000,
        //     disableConsoleOutput: true,
        //     domainLock: [],
        //     identifierNamesGenerator: "hexadecimal",
        //     identifiersPrefix: "",
        //     inputFileName: "",
        //     log: false,
        //     renameGlobals: true,
        //     reservedNames: ["Component"],
        //     reservedStrings: [],
        //     seed: 0,
        //     selfDefending: true,
        //     sourceMap: false,
        //     sourceMapBaseUrl: "",
        //     sourceMapFileName: "",
        //     sourceMapMode: "separate",
        //     stringArray: true,
        //     stringArrayEncoding: ["base64"],
        //     stringArrayThreshold: 0.75,
        //     target: "browser",
        //     transformObjectKeys: true,
        //     unicodeEscapeSequence: true,    
        //     domainLockRedirectUrl: "about:blank",
        //     forceTransformStrings: [],
        //     identifierNamesCache: null,
        //     identifiersDictionary: [],
        //     ignoreImports: true,
        //     optionsPreset: "default",
        //     renameProperties: false,
        //     renamePropertiesMode: "safe",
        //     sourceMapSourcesMode: "sources-content",
           
        //     stringArrayCallsTransform: true,
        //     stringArrayCallsTransformThreshold: 0.5,
           
        //     stringArrayIndexesType: ["hexadecimal-number"],
        //     stringArrayIndexShift: true,
        //     stringArrayRotate: true,
        //     stringArrayWrappersCount: 1,
        //     stringArrayWrappersChainedCalls: true,
        //     stringArrayWrappersParametersMaxCount: 2,
        //     stringArrayWrappersType: "variable",
        //         // compact: true,
        //         // controlFlowFlattening: false,
        //         // controlFlowFlatteningThreshold: 0.75,
        //         // deadCodeInjection: false,
        //         // deadCodeInjectionThreshold: 0.4,
        //         // debugProtection: false,
        //         // debugProtectionInterval: 0,
        //         // disableConsoleOutput: false,
        //         // domainLock: [],
        //         // domainLockRedirectUrl: 'about:blank',
        //         // forceTransformStrings: [],
        //         // identifierNamesCache: null,
        //         // identifierNamesGenerator: 'hexadecimal',
        //         // identifiersDictionary: [],
        //         // identifiersPrefix: '',
        //         // ignoreImports: false,
        //         // inputFileName: '',
        //         // log: false,
        //         // numbersToExpressions: false,
        //         // optionsPreset: 'default',
        //         // renameGlobals: false,
        //         // renameProperties: false,
        //         // renamePropertiesMode: 'safe',
        //         // reservedNames: [],
        //         // reservedStrings: [],
        //         // seed: 0,
        //         // selfDefending: false,
        //         // simplify: true,
        //         // sourceMap: false,
        //         // sourceMapBaseUrl: '',
        //         // sourceMapFileName: '',
        //         // sourceMapMode: 'separate',
        //         // sourceMapSourcesMode: 'sources-content',
        //         // splitStrings: false,
        //         // splitStringsChunkLength: 10,
        //         // stringArray: true,
        //         // stringArrayCallsTransform: true,
        //         // stringArrayCallsTransformThreshold: 0.5,
        //         // stringArrayEncoding: [],
        //         // stringArrayIndexesType: [
        //         //     'hexadecimal-number'
        //         // ],
        //         // stringArrayIndexShift: true,
        //         // stringArrayRotate: true,
        //         // stringArrayShuffle: true,
        //         // stringArrayWrappersCount: 1,
        //         // stringArrayWrappersChainedCalls: true,
        //         // stringArrayWrappersParametersMaxCount: 2,
        //         // stringArrayWrappersType: 'variable',
        //         // stringArrayThreshold: 0.75,
        //         // target: 'browser',
        //         // transformObjectKeys: false,
        //         // unicodeEscapeSequence: false,
        //     }
        // })
      // ]
  });