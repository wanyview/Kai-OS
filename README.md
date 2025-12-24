\# Kai-OS: 数字主理人开源构建框架 (Digital Host Framework)



\[!\[License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)



\## 📖 项目简介 (Introduction)



\*\*Kai-OS\*\* 是一个轻量级、低代码的数字主理人构建框架。



\[cite\_start]本项目起源于 \*\*TIER 咖啡沙龙\*\* 的实践案例 \[cite: 4, 13]\[cite\_start]。我们发现，在运营线下沙龙、读书会、科普课堂时，组织者常面临“知识传递不标准、手忙脚乱、成果难沉淀”的痛点 \[cite: 5, 6, 7]。



Kai-OS 旨在帮助任何一位活动主理人（即使是高中生或非技术人员），利用 \*\*Coze (扣子)\*\* 和 \*\*AIGC视频技术\*\*，快速部署属于自己的“数字分身”。



\## 🚀 核心特性 (Features)



\* \[cite\_start]\*\*🧠 三维智能架构\*\*：内置“调度、专家、问答”三大模块的 Prompt 模板，支持标准化知识输出 \[cite: 66]。

\* \[cite\_start]\*\*🎨 灵活形象适配\*\*：解耦了形象与逻辑，支持接入即梦/有言生成的任何风格数字人（如赛博朋克风、亲和学生风）\[cite: 36, 42]。

\* \*\*🕸️ 轻量化 Web 容器\*\*：提供现成的 H5 页面框架，支持多模态交互（视频流+对话流）。

\* \[cite\_start]\*\*📚 知识库标准化\*\*：独创“真(科学)、善(社科)、美(人文)、灵(交叉)”四维知识分类体系 \[cite: 63, 99]。



\## 🛠️ 快速开始 (Quick Start)



\### 第一步：克隆项目

```bash

git clone \[https://github.com/your-username/Kai-OS.git](https://github.com/your-username/Kai-OS.git)

第二步：配置智能体 (The Brain)
登录 Coze/扣子。

参考本项目中的 prompt_templates.md 创建你的 Bot。

记录下你的 Bot ID 和 API Key。

第三步：制作数字人 (The Face)
参考 avatar_guide.md 制作你的数字人循环视频（待机、说话、思考）。

将视频文件放入 assets/ 文件夹（需自行创建）。

第四步：修改配置
打开 js/config.js，填入你的 ID 和素材路径。

第五步：运行
直接浏览器打开 index.html 即可使用！

🏗️ 架构说明 (Architecture)
Kai-OS 采用分层协同架构 ：

感知交互层：Web 前端 + 数字人视频流。

核心功能层：Coze Agent (负责意图识别与流程调度)。

数据支撑层：基于 Markdown/Excel 的标准化知识库。

📄 贡献者 (Contributors)
Founder: [Wendy] - TIER 咖啡沙龙主理人

Research: 基于《Kai 数字主理人：基于多模态交互技术的 AI 知识咖啡沙龙智能体开发与研究》

📜 许可证
MIT License

