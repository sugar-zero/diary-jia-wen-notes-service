<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">基于 <a href="https://nestjs.com/" target="_blank">Nest.js</a> 进行开发的后端项目</p>
    <p align="center">
<img src="https://img.shields.io/badge/Node-18.7.1-blue" alt="Node Version">
<img src="https://img.shields.io/badge/npm-9.6.7-skyblue" alt="NPM Version">
<img src="https://img.shields.io/badge/license-GPL--2.0-green" alt="License">
</p>

## 简介

本项目是日记项目的后端，无法单独使用，需要配合前端使用

<a href="https://gitee.com/SugarZero/diary-jia-wen-notes" target="_blank">
    <img src="https://img.shields.io/badge/前端-Gitee-C71D23" alt="Gitee">
</a>
<a href="https://github.com/sugar-zero/diary-jia-wen-notes" target="_blank">
    <img src="https://img.shields.io/badge/前端-Github-181717" alt="Github">
</a>
<a href="https://amedev.amesucre.com/diary" target="_blank">
    <img src="https://img.shields.io/badge/前端-AmeDev (Main)-52A1F8" alt="AmeDev">
</a>

## 安装

```bash
$ npm install -g pnpm #if you don't have pnpm
$ pnpm install
```

## 运行

```bash
# development and debug mode
$ pnpm run start:debug

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## 构建

```bash
# build but files are scattered
$ pnpm run build

# build and only generate one main file(main.js)
$ pnpm run build:one
```

## 注意

框架在构建时不同于vue项目会打包出一个开箱即用的整体；它是不包含环境的，需要把node_modules中的环境文件复制一份才可以运行，如果不想麻烦可以访问我自己的流水线下载带环境的包

## 开箱即用的包

<a href="https://amedev.amesucre.com/diary/diary-serivce/~builds?query=successful+and+~release~" target="_blank">
    <img src="https://img.shields.io/badge/dist(With Env)-AmeDev-52A1F8" alt="Distribution on AmeDev">
</a>
