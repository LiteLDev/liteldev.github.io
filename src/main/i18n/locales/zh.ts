// Chinese translations
import type en from "./en";

const zh: typeof en = {
  // <title>s ("<Page> - LeviMC") and the 404 page
  meta: {
    blog: "博客",
    notFound: "页面未找到",
    pickProject: "或者打开一个项目的文档：",
  },

  // Navigation
  nav: {
    home: "首页",
    projects: "项目",
    about: "关于",
    community: "社区",
    support: "支持我们",
  },

  // Hero section
  hero: {
    title1: "随心所欲",
    title2: "玩转基岩版。",
    tagline:
      "面向 Minecraft 基岩版的开源工具：给玩家的启动器、给服主的模组加载器，以及给模组开发者的 API。",
    eyebrow: "Open source · Bedrock Edition",
    languages: "开发语言",
  },

  // "我想…"：首页顶部给玩家、服主和开发者的三栏
  roles: {
    label: "我想…",
    play: "玩游戏",
    host: "开服",
    develop: "开发",
    playDesc: "用 LeviLauncher 玩带模组的 Minecraft 基岩版，多个游戏版本互不干扰。",
    playPlatforms: "Windows · Android · macOS（测试版）",
    installLauncher: "安装 LeviLauncher",
    playTutorial: "教程：玩模组",
    browseMods: "浏览模组",
    hostDesc: "带 LeviLamina、模组和插件的基岩版专用服务器，由 lip 安装并运行。",
    hostPlatforms: "Windows · Linux · macOS",
    installLip: "安装 lip",
    hostTutorial: "教程：开你的第一个服务器",
    developDesc: "用 C++ 基于 LeviLamina 写原生模组，或用 JavaScript、Lua、Python 基于 LegacyScriptEngine 写插件。",
    firstMod: "编写第一个模组",
    scripting: "脚本插件",
    apiReference: "API 参考",
    androidMods: "Android 模组",
    launcherFeatures: [
      { title: "版本隔离", desc: "多个游戏版本，数据各自独立。" },
      { title: "模组", desc: "加载 LeviMC Mods 上的或你自己的模组。" },
      { title: "存档与资源包", desc: "导入、导出和备份存档与资源包。" },
      { title: "账户", desc: "游戏前切换 Xbox 账户。" },
    ],
    lipFeatures: [
      { title: "游戏与加载器", desc: "选一个游戏版本，lip 便会装好基岩版专用服务器和 LeviLamina。" },
      { title: "模组与插件", desc: "安装、更新、卸载，依赖一并处理。" },
      { title: "启动服务器", desc: "在 Windows、Linux 或 macOS 上用 lip 启动服务器。" },
      { title: "交互界面", desc: "直接运行 lip，界面带你一步步完成。" },
    ],
  },

  // About page
  about: {
    pageTitle: "关于 LeviMC",
    pageSubtitle: "一个小团队的故事。",
    intro:
      "LeviMC(原LiteLDev)起始于2021年1月27日，最初的目的是开发一款替代BedrockX的基岩版专用服务器（Bedrock Dedicated Server）插件加载器，也就是LiteLoaderBDS，起初只有三人。\n\n后来LiteXLoader开发团队的成员也加入了LeviMC，随着时间的推移，团队逐渐壮大。\n\n在2021年12月9日，LiteLoaderBDS迭代到了v2.0版本，将LiteXLoader并入了LiteLoaderBDS，开始从BedrockX的技术路线上开始发展创新，首次引入了延迟加载机制实现了无需在头文件中调用符号查找函数实现函数的调用，以及完成了自研的头文件生成系统。\n\n后来由于LiteLoaderBDS的代码库中的历史遗留问题，LeviMC决定从头开始开发一款全新的模组加载器，2023年12月1日，LeviLamina发布了，吸取了LiteLoaderBDS过于耦合的经验教训，采用了模块化的设计理念，极大的提升了加载器的可维护性和扩展性，并且进一步优化了头文件生成，进一步优化了钩子（Hook），引入了诸多新特性。",
    question1Title: "LeviLamina来自哪里？",
    question1Body:
      "LeviLamina诞生于基岩版专用服务器的深处，由LiteLoaderBDS项目的种子萌发而来。\n\nMinecraft 基岩版最初缺乏Minecraft Java版那样丰富的模组与服务器插件生态，玩法潜力受限。一群精通基岩版专用服务器的C++爱好者开创了首批服务器模组的开发。\n\n然而，这种开发方式面临不少挑战。首先，由于缺乏底层框架支持，开发模组时不得不依赖各类底层工具来完成符号分析、注入实现、钩子注册等工作，导致不同模组之间代码冗余重复，且容易发生冲突。其次，缺乏完善的开发接口，抬高了开发门槛，也拉低了效率。\n\n为解决这些困境，前身项目LiteLoaderBDS的维护者构建了基于注入的模组加载引擎与模组开发框架，并提供类型信息，使开发者无需深究底层原理即可编写模组。这大大降低了入门门槛，推动了模组生态的繁荣。\n\n然而，随着LiteLoaderBDS的演进，一些问题逐渐显现。早期设计未能充分考虑长远发展，许多部分日渐陈旧，难以配合现代工具使用，也无法满足新的性能要求；其紧耦合的设计更让适配新版本基岩版专用服务器耗费大量精力。为此，LeviMC决定重起炉灶，结合既有经验全面重新设计框架，打造一款对维护者、开发者和用户都友好的模组引擎。",
    question2Title: "为什么LiteLoaderBDS更名为LeviLamina？",
    question2Body:
      "这可真有故事可讲！起初，LiteLoaderBDS不过是个玩笑般的小尝试、一次有趣的实验。可谁能想到，它的成长速度比打了兴奋剂的苦力怕还要快！\n\n一开始，我们发现LiteLoaderBDS这个名字和Minecraft Java版的模组加载器LiteLoader出奇地像。于是我们灵机一动，在后面加上了“BDS”后缀，好突出自己的特色。聪明吧？\n\n但随着LiteLoaderBDS2.0不断扩充，它像自助餐厅里的小猪一样越发臃肿，性能急剧下滑，让我们一筹莫展。\n\n就在这时，我们做出了一个大胆的决定：从头重构整个项目。随着改造不断深入，我们越来越觉得，全新的开始应当配上一个全新的名字。于是我们翻开古老的拉丁语词源，保留了大家喜爱的缩写“ll”——瞧！LeviLamina就此诞生，这个名字终于配得上我们这件宏伟的作品。",
    valueOneTitle: "开发者优先",
    teamTitle: "团队成员",
    teamSubtitle: "认识我们的团队成员。",
    badgeWhere: "起源",
    badgeWhy: "缘由",
    members: {
      "OEOTYAN": { role: "团队负责人", bio: "领导 LeviMC 项目，把握项目方向。LeviLamina 维护者。" },
      "dreamguxiang": { role: "启动器作者", bio: "LeviLauncher（Windows 版与 Android 版）的作者，LeviLamina 开发者。" },
      "KawaiiNahida": { role: "头文件生成器维护者", bio: "维护头文件生成系统，确保头文件高效准确。LeviAntiCheat 作者。" },
      "RimuruChan": { role: "头文件生成器维护者", bio: "维护头文件生成系统，确保头文件高效准确。" },
      "Dofes": { role: "LeviOptimize 作者", bio: "开发并维护 LeviOptimize——为 LeviLamina 服务器和客户端提供性能优化的模组。LeviLamina 与 LegacyScriptEngine 开发者。" },
      "futrime": { role: "lip 作者", bio: "开发并维护 lip——运行 LeviLamina 服务器并管理其包的工具。LegacyScriptEngine 开发者。" },
      "wu-vincent": { role: "Endstone 作者", bio: "开发并维护 Endstone——广受欢迎的基岩版专用服务器插件加载器。为 LeviStone 提供支持。" },
      "quizhizhe": { role: "MoreDimensions 作者", bio: "通过 MoreDimensions API 为 Minecraft 基岩版带来自定义维度。LeviLamina 开发者，LiteLoaderBDS 1.16.40 作者。" },
      "Lovelylavender4": { role: "LeviLamina 维护者", bio: "维护 LeviLamina，参与开发与社区支持。" },
      "zimuya4153": { role: "LeviLamina 开发者", bio: "参与 LeviLamina 的开发。" },
      "PA733": { role: "服务器管理员", bio: "管理服务器与基础设施。LeviLamina 与 LiteLoaderBDS 开发者。" },
      "ShrBox": { role: "LeviMC（原 LiteLDev）创始人", bio: "LiteLDev（现 LeviMC）的创始人，LegacyScriptEngine 与 LeviLamina 贡献者。" },
      "yqs112358": { role: "LiteXLoader 作者", bio: "开发了 LiteXLoader，并为 LiteLoaderBDS 做出贡献。" },
      "xiaoqch": { role: "LeviLamina 开发者", bio: "参与 LeviLamina 与 LiteLoaderBDS 的开发。" },
      "wzyyyyyyy": { role: "LiteLoaderBDS 开发者", bio: "参与 LiteLoaderBDS 与 LiteXLoader 的开发。" },
      "twoone-3": { role: "LLSE Python 引擎开发者", bio: "为 LLSE 插件提供 Python 脚本支持。PythonRunner 作者，LiteLoaderBDS 开发者。" },
      "ddf8196": { role: "LeviLamina 开发者", bio: "参与 LeviLamina 的开发。" },
      "Pd233": { role: "LiteLoader.NET 作者", bio: "为 LiteLoaderBDS 提供 .NET 脚本支持。" },
      "Jaciezyt": { role: "LeviLamina 开发者", bio: "为 LeviLamina 与 LiteLoaderBDS 做出贡献。" },
      "cryx233": { role: "众多 LiteLoaderBDS 插件的开发者", bio: "为 LiteLoaderBDS 提供各类插件，增强服务器功能。" },
    },
  },

  // Projects section
  projects: {
    label: "生态系统",
    title: "我们的项目",
    moreOnGitHub: "更多项目请访问 GitHub",
    explore: "探索",
  },

  // Features section
  features: {
    label: "为何选择 LeviMC",
    title1: "一个生态，",
    title2: "服务整个基岩版。",
    description:
      "玩家、服主和模组开发者共享同一套开源工具、同一个模组目录和同一个社区。",
    // Feature items
    platforms: "Windows 与 Android",
    platformsDesc:
      "LeviLauncher 在电脑和手机上都能玩；LeviLamina 在 Windows 服务器和客户端上运行模组。",
    oneCommand: "一条命令安装",
    oneCommandDesc:
      "lip 会连同依赖一起安装模组，LeviMC Mods 则收录了每个模组及其安装命令。",
    multiLang: "你熟悉的语言",
    multiLangDesc:
      "用现代 C++ 编写原生模组，或通过 LegacyScriptEngine 用 JavaScript、Node.js、Lua、Python 编写插件。",
    openSource: "开源",
    openSourceDesc:
      "在 GitHub 上开源开发，Discord、Telegram 和 QQ 群里也有活跃的社区随时提供帮助。",
  },

  // Community section
  community: {
    title1: "加入",
    title2: "社区。",
    description:
      "与构筑基岩版模组未来的开发者交流。获取帮助、分享模组、共建生态。",
    joinDiscord: "加入 Discord",
    coreProjects: "核心项目",
    // Community page
    pageTitle: "参与进来",
    pageDesc: "与 LeviMC 社区建立联系。",
    discordTitle: "Discord",
    discordDesc: "获取实时帮助，分享你的模组，与核心团队和社区成员交流。",
    telegramTitle: "Telegram",
    telegramDesc: "加入我们的 Telegram 群组，参与讨论并获取更新。",
    discordLabel: "社区服务器",
    telegramLabel: "社区群组",
    joinTelegram: "加入 Telegram",
    githubTitle: "GitHub",
    githubDesc: "贡献代码、反馈问题、浏览源码。",
    viewOnGitHub: "在 GitHub 查看",
    qqTitle: "QQ 群组",
    qqDesc: "加入我们的 QQ 群与中文社区交流。",
    qqGroups: "交流群",
  },

  // Support page
  support: {
    pageTitle: "支持 LeviMC",
    pageDesc: "参与共建基岩版模组生态——贡献代码或赞助项目。",
    contributeTitle: "贡献代码",
    contributeDesc:
      "认领 Issue、完善文档或开发新功能。每一个 PR 都在助力社区。",
    contributeCta: "挑选一个 Issue",
    donateTitle: "捐助项目",
    donateDesc: "你的支持能帮助我们维护基础设施，并投入更多时间开发新功能。",
    donateChannels: "捐助渠道",
    channelAfdian: "爱发电",
    channelOpenCollective: "OpenCollective",
    donorsSectionTitle: "支持者",
    donorsSectionDesc: "衷心感谢以下支持者对 LeviMC 的慷慨支持。",
    donorsLoading: "正在从 CSV 加载捐赠者...",
    donorsErrorTitle: "无法加载捐赠数据",
    donorsError: "无法从 donors.csv 读取捐赠者列表。",
    donorsEmptyTitle: "还没有捐赠记录",
    donorsEmpty: "向 public/donors.csv 中添加一行或多行数据后刷新页面即可。",
    donorLinkLabel: "打开链接",
  },


  // Project descriptions
  projects_desc: {
    levilamina: "轻量、模块化、多功能的 Minecraft 基岩版模组加载器。",
    legacyscriptengine: "在 LeviLamina 上运行用 JavaScript、Node.js、Lua 或 Python 编写的 LLSE 插件。",
    lip: "运行 LeviLamina 服务器并管理包：搭建并启动服务器、安装和更新模组。",
    levilauncher: "适用于 Windows（GDK / UWP）与 Android 的 Minecraft 基岩版启动器。",
    levioptimize: "优化 LeviLamina 服务端与客户端性能的模组。",
    levianticheat: "为 LeviLamina 服务器提供反作弊解决方案。",
    moredimensions: "供 LeviLamina 模组向基岩版专用服务器添加自定义维度的 API。",
    levistone: "在 LeviLamina 上运行 Endstone 插件的运行时。",
    bedd: "让 LeviLamina 客户端模组的端到端测试在后台运行：脚本或 agent 同时操控多个游戏，键鼠照常归你使用。",
    bedboo: "兼容 mineflayer API 的 Minecraft 基岩版机器人库：让机器人和 mineflayer 插件直接连上基岩版专用服务器（BDS）。",
  },
  // 博客
  blog: {
    name: "LeviMC's blog",
    tagline: "关于开发的一切",
    eyebrow: "博客",
    sections: "博客栏目",
    posts: "文章",
    tags: "标签",
    categories: "分类",
    archives: "归档",
    about: "关于",
    friends: "友情链接",
    rss: "RSS",
    latest: "最新文章",
    readMore: "阅读全文",
    minutes: (n: number) => `${n} 分钟`,
    postCount: (n: number) => `${n} 篇文章`,
    tagTitle: (name: string) => `标签：${name}`,
    categoryTitle: (name: string) => `分类：${name}`,
    monthLabel: (y: string, m: string) => `${y} 年 ${Number(m)} 月`,
    archiveTitle: (y: string, m?: string) => (m ? `归档：${y} 年 ${Number(m)} 月` : `归档：${y} 年`),
    page: (n: number) => `第 ${n} 页`,
    previousPost: "上一篇",
    nextPost: "下一篇",
    writtenIn: "简体中文",
    by: "作者",
    comments: "评论",
    commentsLoading: "正在加载评论…",
    commentsFailed: "评论加载失败。",
    reload: "文章加载失败，请刷新页面",
    backToBlog: "全部文章",
    date: (iso: string) => `${iso.slice(0, 4)} 年 ${Number(iso.slice(5, 7))} 月 ${Number(iso.slice(8, 10))} 日`,
    monthName: (m: string) => `${Number(m)} 月`,
  },

  // LeviChan：首页卡片后探出头的头像，以及她的 3D 空间
  levichan: {
    avatar: "谁在那儿？",
    loading: "正在召唤 LeviChan…",
    loadFailed: "LeviChan 加载失败。",
    menuTitle: "LeviChan",
    hint: "网页散成了一块块，她就住在上面。像 Minecraft 一样飞来飞去：WASD 移动，空格上升，Shift 下降，Ctrl 加速，滚轮前后，拖动转视角，F 找到她。点一下方块，她就会跳着、爬着想办法过去跟它玩；双击小块，她会把它搬到别处；拖起她、扔方块、摸头、戳戳……这里的链接只会亮一下，不会跳转。",
    hintTouch: "网页散成了一块块，她就住在上面。单指拖动转视角，双指捏合前后移动，双指拖动平移。点一下方块，她就会想办法过去跟它玩；双击小块，她会把它搬到别处；按住她可以拎起来，还能扔方块、摸头、戳戳……这里的链接只会亮一下，不会跳转。",
    lookLabel: "看向鼠标",
    look: { auto: "随她心情", always: "一直看", never: "不看" },
    quiet: "少些小动作",
    follow: "镜头跟随她",
    focus: "飞到她身边（F）",
    exit: "退出 3D 空间",
    say: {
      hello: "你好呀！",
      bye: "拜拜～",
      welcomeBack: "欢迎回来！",
      copied: "收到！",
      dizzy: "晕了晕了…",
      stop: "喂！别戳啦！",
      pat: "嘿嘿…",
      mined: "+1 方块！",
      yawn: "哈啊——",
      look: "看这里！",
    },
  },
};

export default zh;
