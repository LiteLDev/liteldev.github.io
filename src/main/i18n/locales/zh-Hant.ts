// Traditional Chinese translations (the kit chrome's words: 專案, 社群, 網誌, 文檔)
import type en from "./en";

const zhHant: typeof en = {
  // <title>s ("<Page> - LeviMC") and the 404 page
  meta: {
    blog: "網誌",
    notFound: "找不到頁面",
    pickProject: "或者打開一個專案的文檔：",
  },

  // Navigation
  nav: {
    home: "首頁",
    projects: "專案",
    about: "關於",
    community: "社群",
    support: "支持我們",
  },

  // Hero section
  hero: {
    title1: "隨心所欲",
    title2: "玩轉基岩版。",
    tagline:
      "專為 Minecraft 基岩版打造的開源工具：給玩家的啟動器、給服主的模組載入器，以及給模組開發者的 API。",
    eyebrow: "Open source · Bedrock Edition",
    languages: "開發語言",
  },

  // "我想…"：首頁頂部給玩家、服主和開發者的選項卡
  roles: {
    label: "我想…",
    play: "玩遊戲",
    host: "開服",
    develop: "開發",
    playDesc: "用 LeviLauncher 玩帶模組的 Minecraft 基岩版，多個遊戲版本互不干擾。",
    playPlatforms: "Windows · Android · macOS（測試版）",
    installLauncher: "安裝 LeviLauncher",
    playTutorial: "教學：玩模組",
    browseMods: "瀏覽模組",
    hostDesc: "搭載 LeviLamina、模組與外掛的基岩版專用伺服器，由 lip 安裝與執行。",
    hostPlatforms: "Windows · Linux · macOS",
    installLip: "安裝 lip",
    hostTutorial: "教學：開你的第一個伺服器",
    developDesc: "用 C++ 基於 LeviLamina 編寫原生模組，或用 JavaScript、Lua、Python 基於 LegacyScriptEngine 編寫外掛。",
    firstMod: "編寫第一個模組",
    scripting: "腳本外掛",
    apiReference: "API 參考",
    androidMods: "Android 模組",
    launcherFeatures: [
      { title: "版本隔離", desc: "多個遊戲版本，資料各自獨立。" },
      { title: "模組", desc: "載入 LeviMC Mods 上的或你自己的模組。" },
      { title: "存檔與資源包", desc: "匯入、匯出和備份存檔與資源包。" },
      { title: "帳戶", desc: "遊戲前切換 Xbox 帳戶。" },
    ],
    lipFeatures: [
      { title: "遊戲與載入器", desc: "選定遊戲版本，由 lip 裝好基岩版專用伺服器和 LeviLamina。" },
      { title: "模組與外掛", desc: "安裝、更新、移除，相依套件一併處理。" },
      { title: "啟動伺服器", desc: "在 Windows、Linux 或 macOS 上用 lip 啟動伺服器。" },
      { title: "互動介面", desc: "直接執行 lip，介面帶你一步步完成。" },
    ],
  },

  // About page
  about: {
    pageTitle: "關於 LeviMC",
    pageSubtitle: "一個小團隊的故事。",
    intro:
      "LeviMC(原LiteLDev)起始於2021年1月27日，最初的目的是開發一款替代BedrockX的基岩版專用伺服器（Bedrock Dedicated Server）外掛載入器，也就是LiteLoaderBDS，起初只有三人。\n\n後來LiteXLoader開發團隊的成員也加入了LeviMC，隨著時間的推移，團隊逐漸壯大。\n\n在2021年12月9日，LiteLoaderBDS迭代到了v2.0版本，將LiteXLoader併入了LiteLoaderBDS，開始從BedrockX的技術路線上開始發展創新，首次引入了延遲載入機制實現了無需在標頭檔中呼叫符號查詢函式實現函式的呼叫，以及完成了自研的標頭檔生成系統。\n\n後來由於LiteLoaderBDS的程式碼庫中的歷史遺留問題，LeviMC決定從頭開始開發一款全新的模組載入器，2023年12月1日，LeviLamina發佈了，吸取了LiteLoaderBDS過於耦合的經驗教訓，採用了模組化的設計理念，極大的提升了載入器的可維護性和擴展性，並且進一步優化了標頭檔生成，進一步優化了鉤子（Hook），引入了諸多新特性。",
    question1Title: "LeviLamina來自哪裡？",
    question1Body:
      "LeviLamina 誕生於基岩版專用伺服器的深處，從 LiteLoaderBDS 專案的種子中萌芽。\n\nMinecraft 基岩版問世之初，缺乏如 Minecraft Java 版那般豐富的模組與伺服器外掛生態，限制了遊戲的可能性。一群精通基岩版專用伺服器的 C++ 愛好者開創了首批伺服器模組的開發先河。\n\n然而，這種開發模式面臨不少挑戰。首先，由於缺乏底層框架支援，開發模組時必須依賴各種低階工具來完成符號分析、注入實作、鉤子註冊等工作，導致不同模組間程式碼冗餘重複，甚至引發衝突。其次，缺乏完善的開發介面，墊高了開發門檻，也降低了效率。\n\n為了解決這些困境，前身專案 LiteLoaderBDS 的維護者打造了一套基於注入的模組載入引擎與模組開發框架，並提供型別資訊，讓開發者不必深究底層原理也能建立模組。這大幅降低了入門門檻，帶動了模組生態系的繁榮。\n\n但隨著 LiteLoaderBDS 發展，問題也逐漸浮現。早期設計未考慮未來演進，許多部分已顯過時，難以搭配現代化工具，也無法滿足最新的效能需求；而緊耦合的架構更讓每次適配新版基岩版專用伺服器都得耗費龐大心力。因此，LeviMC 決定運用累積的專業經驗推倒重來，全面重新設計框架，打造出一個對維護者、開發者與使用者都友善的模組引擎。",
    question2Title: "為什麼LiteLoaderBDS更名為LeviLamina？",
    question2Body:
      "這可真是個好故事！你看，LiteLoaderBDS 一開始只是個小玩笑、一場有趣的實驗。誰知道它的成長速度竟然比吃了類固醇的苦力怕還要快！\n\n起初，我們發現 LiteLoaderBDS 這個名字聽起來跟 Minecraft Java 版的模組載入器 LiteLoader 驚人地相似。於是我們靈機一動，在後面加上「BDS」字樣來凸顯特色。很聰明吧？\n\n但隨著 LiteLoaderBDS 2.0 不斷擴充，它開始像吃到飽餐廳裡的小豬一樣迅速膨脹，效能急劇下滑，看得我們一頭霧水。\n\n就在那時，我們做了一個大膽的決定：從頭重建整個專案。隨著改造工程步步深入，我們很清楚，嶄新的開始值得一個全新的名號。於是我們翻找起古老的拉丁語字根，保留大家喜愛的縮寫「ll」——瞧！LeviLamina 就此誕生，這個名字才配得上我們這項宏偉的傑作。",
    valueOneTitle: "開發者優先",
    teamTitle: "團隊成員",
    teamSubtitle: "認識我們的團隊成員。",
    badgeWhere: "起源",
    badgeWhy: "緣由",
    members: {
      "OEOTYAN": { role: "團隊負責人", bio: "領導 LeviMC 專案，把握專案方向。LeviLamina 維護者。" },
      "dreamguxiang": { role: "啟動器作者", bio: "LeviLauncher（Windows 版與 Android 版）的作者，LeviLamina 開發者。" },
      "KawaiiNahida": { role: "標頭檔產生器維護者", bio: "維護標頭檔產生系統，確保標頭檔高效準確。LeviAntiCheat 作者。" },
      "RimuruChan": { role: "標頭檔產生器維護者", bio: "維護標頭檔產生系統，確保標頭檔高效準確。" },
      "Dofes": { role: "LeviOptimize 作者", bio: "開發並維護 LeviOptimize——為 LeviLamina 伺服器與用戶端最佳化效能的模組。LeviLamina 與 LegacyScriptEngine 開發者。" },
      "futrime": { role: "lip 作者", bio: "開發並維護 lip——執行 LeviLamina 伺服器並管理其套件的工具。LegacyScriptEngine 開發者。" },
      "wu-vincent": { role: "Endstone 作者", bio: "開發並維護 Endstone——廣受歡迎的基岩版專用伺服器外掛載入器。為 LeviStone 提供支援。" },
      "quizhizhe": { role: "MoreDimensions 作者", bio: "透過 MoreDimensions API 為 Minecraft 基岩版帶來自訂維度。LeviLamina 開發者、LiteLoaderBDS 1.16.40 作者。" },
      "Lovelylavender4": { role: "LeviLamina 維護者", bio: "維護 LeviLamina，參與開發與社群支援。" },
      "zimuya4153": { role: "LeviLamina 開發者", bio: "參與 LeviLamina 的開發。" },
      "PA733": { role: "伺服器管理員", bio: "負責伺服器與基礎設施維護。LeviLamina 與 LiteLoaderBDS 開發者。" },
      "ShrBox": { role: "LeviMC（原 LiteLDev）創始人", bio: "LiteLDev（現 LeviMC）的創始人，LegacyScriptEngine 與 LeviLamina 貢獻者。" },
      "yqs112358": { role: "LiteXLoader 作者", bio: "開發了 LiteXLoader，並為 LiteLoaderBDS 做出貢獻。" },
      "xiaoqch": { role: "LeviLamina 開發者", bio: "參與 LeviLamina 與 LiteLoaderBDS 的開發。" },
      "wzyyyyyyy": { role: "LiteLoaderBDS 開發者", bio: "參與 LiteLoaderBDS 與 LiteXLoader 的開發。" },
      "twoone-3": { role: "LLSE Python 引擎開發者", bio: "為 LLSE 外掛提供 Python 腳本支援。PythonRunner 作者、LiteLoaderBDS 開發者。" },
      "ddf8196": { role: "LeviLamina 開發者", bio: "參與 LeviLamina 的開發。" },
      "Pd233": { role: "LiteLoader.NET 作者", bio: "為 LiteLoaderBDS 提供 .NET 腳本支援。" },
      "Jaciezyt": { role: "LeviLamina 開發者", bio: "為 LeviLamina 與 LiteLoaderBDS 做出貢獻。" },
      "cryx233": { role: "眾多 LiteLoaderBDS 外掛的開發者", bio: "為 LiteLoaderBDS 開發各類外掛，強化伺服器功能。" },
    },
  },

  // Projects section
  projects: {
    label: "生態系統",
    title: "我們的專案",
    moreOnGitHub: "更多專案請訪問 GitHub",
    explore: "探索",
  },

  // Features section
  features: {
    label: "為何選擇 LeviMC",
    title1: "一個生態，",
    title2: "服務整個基岩版。",
    description:
      "玩家、服主與模組開發者共用同一套開源工具、同一個模組目錄與同一個社群。",
    // Feature items
    platforms: "Windows 與 Android",
    platformsDesc:
      "LeviLauncher 支援電腦與手機遊玩；LeviLamina 則在 Windows 伺服器與用戶端上載入模組。",
    oneCommand: "一條指令安裝",
    oneCommandDesc:
      "lip 會連同相依套件一併安裝模組，LeviMC Mods 則收錄了所有模組與安裝指令。",
    multiLang: "你熟悉的語言",
    multiLangDesc:
      "使用現代 C++ 編寫原生模組，或透過 LegacyScriptEngine 以 JavaScript、Node.js、Lua、Python 編寫外掛。",
    openSource: "開源",
    openSourceDesc:
      "於 GitHub 開源開發，Discord、Telegram 與 QQ 群中也有活躍社群隨時提供協助。",
  },

  // Community section
  community: {
    title1: "加入",
    title2: "社群。",
    description:
      "與打造基岩版模組未來的開發者交流。尋求協助、分享作品，並為生態系貢獻心力。",
    joinDiscord: "加入 Discord",
    coreProjects: "核心專案",
    // Community page
    pageTitle: "參與進來",
    pageDesc: "與 LeviMC 社群建立聯絡。",
    discordTitle: "Discord",
    discordDesc: "取得即時協助、分享你的模組，並與核心團隊及社群成員交流。",
    telegramTitle: "Telegram",
    telegramDesc: "加入我們的 Telegram 群組，參與討論並接收最新消息。",
    discordLabel: "社群伺服器",
    telegramLabel: "社群群組",
    joinTelegram: "加入 Telegram",
    githubTitle: "GitHub",
    githubDesc: "參與專案貢獻、回報問題或瀏覽原始碼。",
    viewOnGitHub: "在 GitHub 檢視",
    qqTitle: "QQ 群組",
    qqDesc: "加入我們的 QQ 群與中文社群交流。",
    qqGroups: "交流群",
  },

  // Support page
  support: {
    pageTitle: "支持 LeviMC",
    pageDesc: "協助我們打造基岩版模組生態系——貢獻程式碼或贊助專案。",
    contributeTitle: "貢獻程式碼",
    contributeDesc:
      "認領 Issue、完善說明文件或開發新功能，每個 PR 都能幫助社群成長。",
    contributeCta: "挑選一個 Issue",
    donateTitle: "捐助專案",
    donateDesc: "你的支持能幫助我們維持基礎設施運作，並投入更多時間開發新功能。",
    donateChannels: "捐助渠道",
    channelAfdian: "愛發電",
    channelOpenCollective: "OpenCollective",
    donorsSectionTitle: "支持者",
    donorsSectionDesc: "衷心感謝以下支持者對 LeviMC 的慷慨贊助。",
    donorsLoading: "正在從 CSV 載入捐贈者...",
    donorsErrorTitle: "無法載入捐贈資料",
    donorsError: "無法從 donors.csv 讀取捐贈者列表。",
    donorsEmptyTitle: "還沒有捐贈記錄",
    donorsEmpty: "在 public/donors.csv 中新增一或多行資料，再重新整理頁面即可。",
    donorLinkLabel: "開啟連結",
  },


  // Project descriptions
  projects_desc: {
    levilamina: "輕量、模組化、多功能的 Minecraft 基岩版模組載入器。",
    legacyscriptengine: "在 LeviLamina 上執行以 JavaScript、Node.js、Lua 或 Python 編寫的 LLSE 外掛。",
    lip: "執行 LeviLamina 伺服器並管理套件：架設伺服器、安裝與更新模組、啟動伺服器。",
    levilauncher: "適用於 Windows（GDK / UWP）與 Android 的 Minecraft 基岩版啟動器。",
    levioptimize: "為 LeviLamina 伺服器與用戶端提供效能最佳化的模組。",
    levianticheat: "為 LeviLamina 伺服器提供反作弊解決方案。",
    moredimensions: "供 LeviLamina 模組為基岩版專用伺服器新增自訂維度的 API。",
    levistone: "在 LeviLamina 上執行 Endstone 外掛的執行時。",
    bedd: "讓 LeviLamina 用戶端模組的端對端測試在背景執行：由腳本或 agent 同時操作多個遊戲，你的滑鼠和鍵盤照常歸你用。",
    bedboo: "相容 mineflayer API 的 Minecraft 基岩版機器人程式庫：讓機器人和 mineflayer 外掛直接連上基岩版專用伺服器（BDS）。",
  },
  // 網誌
  blog: {
    name: "LeviMC's blog",
    tagline: "關於開發的一切",
    eyebrow: "網誌",
    sections: "網誌欄目",
    posts: "文章",
    tags: "標籤",
    categories: "分類",
    archives: "歸檔",
    about: "關於",
    friends: "友情連結",
    rss: "RSS",
    latest: "最新文章",
    readMore: "閱讀全文",
    minutes: (n: number) => `${n} 分鐘`,
    postCount: (n: number) => `${n} 篇文章`,
    tagTitle: (name: string) => `標籤：${name}`,
    categoryTitle: (name: string) => `分類：${name}`,
    monthLabel: (y: string, m: string) => `${y} 年 ${Number(m)} 月`,
    archiveTitle: (y: string, m?: string) => (m ? `歸檔：${y} 年 ${Number(m)} 月` : `歸檔：${y} 年`),
    page: (n: number) => `第 ${n} 頁`,
    previousPost: "上一篇",
    nextPost: "下一篇",
    writtenIn: "簡體中文",
    by: "作者",
    comments: "評論",
    commentsLoading: "正在載入評論…",
    commentsFailed: "評論載入失敗。",
    reload: "文章載入失敗，請重新整理頁面",
    backToBlog: "全部文章",
    date: (iso: string) => `${iso.slice(0, 4)} 年 ${Number(iso.slice(5, 7))} 月 ${Number(iso.slice(8, 10))} 日`,
    monthName: (m: string) => `${Number(m)} 月`,
  },

  // LeviChan：首頁卡片後探出頭的頭像，以及她的 3D 空間
  levichan: {
    avatar: "誰在那兒？",
    loading: "正在召喚 LeviChan…",
    loadFailed: "LeviChan 載入失敗。",
    menuTitle: "LeviChan",
    hint: "網頁散成了一塊塊，她就住在上面。像 Minecraft 一樣飛來飛去：WASD 移動，空白鍵上升，Shift 下降，Ctrl 加速，滾輪前後，拖曳轉視角，F 找到她。點一塊她就想辦法過去（跳、爬）並和它玩；雙擊小塊她會把它搬到別處；拖起她、丟方塊、摸頭、戳戳……這裡的連結只會亮一下，不會跳轉。",
    hintTouch: "網頁散成了一塊塊，她就住在上面。單指拖曳轉視角，雙指縮放前後移動，雙指拖曳平移。點一塊她就想辦法過去並和它玩；雙擊小塊她會把它搬到別處；按住她可以拎起來，還能丟方塊、摸頭、戳戳……這裡的連結只會亮一下，不會跳轉。",
    lookLabel: "看向滑鼠",
    look: { auto: "隨她心情", always: "一直看", never: "不看" },
    quiet: "少些小動作",
    follow: "鏡頭跟隨她",
    focus: "飛到她身邊（F）",
    exit: "離開 3D 空間",
    say: {
      hello: "你好呀！",
      bye: "掰掰～",
      welcomeBack: "歡迎回來！",
      copied: "收到！",
      dizzy: "暈了暈了…",
      stop: "喂！別戳啦！",
      pat: "嘿嘿…",
      mined: "+1 方塊！",
      yawn: "哈啊——",
      look: "看這裡！",
    },
  },
};

export default zhHant;
