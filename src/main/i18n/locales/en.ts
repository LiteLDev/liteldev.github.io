// English translations
const MONTHS_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const en = {
  // <title>s ("<Page> - LeviMC") and the 404 page
  meta: {
    blog: "Blog",
    notFound: "Page not found",
    pickProject: "Or open a project's docs:",
  },

  // Navigation
  nav: {
    home: "Home",
    projects: "Projects",
    about: "About",
    community: "Community",
    support: "Support us",
  },

  // Hero section
  hero: {
    title1: "Mod Bedrock",
    title2: "your way.",
    tagline:
      "Open-source tools for Minecraft Bedrock Edition: a launcher for players, a mod loader for servers, and APIs for mod developers.",
    eyebrow: "Open source · Bedrock Edition",
    languages: "Languages",
  },

  // "I want to…": the hero's list for players, server owners and developers
  roles: {
    label: "I want to…",
    play: "Play",
    host: "Run a server",
    develop: "Develop",
    playDesc: "Run Minecraft Bedrock Edition with mods and multiple game versions side by side in LeviLauncher.",
    playPlatforms: "Windows · Android · macOS (beta)",
    installLauncher: "Install LeviLauncher",
    playTutorial: "Tutorial: play with mods",
    browseMods: "Browse mods",
    hostDesc: "Run a Bedrock Dedicated Server with LeviLamina, mods, and plugins. lip sets it up and runs it.",
    hostPlatforms: "Windows · Linux · macOS",
    installLip: "Install lip",
    hostTutorial: "Tutorial: your first server",
    developDesc: "Write native C++ mods with LeviLamina, or JavaScript, Lua, and Python plugins with LegacyScriptEngine.",
    firstMod: "Create your first mod",
    scripting: "Script plugins",
    apiReference: "API reference",
    androidMods: "Android mods",
    launcherFeatures: [
      { title: "Version isolation", desc: "Keep multiple game versions, each with its own data." },
      { title: "Mods", desc: "Load mods from LeviMC Mods or add your own." },
      { title: "Worlds & packs", desc: "Import, export, and back up worlds and packs." },
      { title: "Accounts", desc: "Switch Xbox accounts before you play." },
    ],
    lipFeatures: [
      { title: "Game & loader", desc: "Pick a game version, and lip installs Bedrock Dedicated Server and LeviLamina." },
      { title: "Mods & plugins", desc: "Install, update, and remove them along with their dependencies." },
      { title: "Runs the server", desc: "Start the server from lip on Windows, Linux, or macOS." },
      { title: "Interactive interface", desc: "Run lip with no arguments, and its menus will walk you through it." },
    ],
  },

  // About page
  about: {
    pageTitle: "About LeviMC",
    pageSubtitle: "The story of a small team.",
    intro:
      "LeviMC (formerly LiteLDev) began on January 27, 2021.\n\n It started as a project to develop a Bedrock Dedicated Server plugin loader to replace BedrockX—LiteLoaderBDS—with an initial team of three.\n\n Later, members of the LiteXLoader team joined and the team grew. On December 9, 2021, LiteLoaderBDS reached v2.0, merging LiteXLoader and introducing innovations beyond the BedrockX approach, including a delay-loading mechanism that enabled function calls without requiring symbol lookup in headers and a custom header-generation system.\n\n Due to legacy issues in the codebase, the team decided to rebuild the mod loader from scratch. On December 1, 2023, LeviLamina was released. Learning from how tightly coupled LiteLoaderBDS had become, it adopted a modular design that greatly improved maintainability and extensibility, while further optimizing header generation and hooks and adding many new features.",
    question1Title: "Where does LeviLamina come from?",
    question1Body:
      "LeviLamina grew out of the LiteLoaderBDS project and deep work with Bedrock Dedicated Server.\n\nEarly versions of Minecraft Bedrock Edition lacked the rich mod and server plugin ecosystem of Minecraft Java Edition, limiting what players could do. A group of C++ enthusiasts who knew Bedrock Dedicated Server inside out pioneered the first server mods.\n\nStill, this approach had real hurdles. With no underlying framework, mod developers had to rely on low-level tools for symbol analysis, injection, and hook registration. That meant duplicate code across mods and frequent conflicts between them. Without a complete development interface, the barrier to entry was high and work was slow.\n\nTo solve this, the maintainers of LiteLoaderBDS built an injection-based mod loading engine and development framework, complete with type information. Developers could now write mods without knowing every low-level detail, which lowered the barrier to entry and helped the mod ecosystem grow.\n\nAs LiteLoaderBDS matured, however, its limits began to show. The early design had not anticipated later needs, leaving parts of it outdated, incompatible with modern tools, and unable to meet current performance demands. Its tightly coupled architecture also made updating for new Bedrock Dedicated Server versions a major effort. LeviMC therefore decided to start from scratch, drawing on everything the team had learned to redesign the framework into a mod engine built for maintainers, developers, and users alike.",
    question2Title: "Why was LiteLoaderBDS renamed to LeviLamina?",
    question2Body:
      "Oh, it's quite a tale! You see, LiteLoaderBDS started off as a little joke, a playful experiment. But lo and behold, it grew faster than a creeper on steroids!\n\nAt first, we noticed that the name LiteLoaderBDS sounded strikingly similar to LiteLoader, a mod loader for Minecraft Java Edition. So, in a moment of genius, we slapped a \"BDS\" suffix on it to set ourselves apart. Clever, right?\n\nBut as LiteLoaderBDS 2.0 expanded, it started bulking up like a piglet at an all-you-can-eat buffet. Its performance took a nosedive, leaving us scratching our heads.\n\nThat's when we made the bold decision to rebuild the entire project from scratch. As we got deeper into the rewrite, it became clear that a fresh start deserved a brand-new name. So we dabbled in the ancient art of Latin roots, kept the beloved `ll` abbreviation, and voila! LeviLamina was born, a name worthy of our magnificent creation.",
    valueOneTitle: "Developers first",
    teamTitle: "Team members",
    teamSubtitle: "Meet our team members.",
    badgeWhere: "Where",
    badgeWhy: "Why",
    members: {
      "OEOTYAN": { role: "Team Lead", bio: "Leads the LeviMC project and keeps it on course. Maintainer of LeviLamina." },
      "dreamguxiang": { role: "Author of Launcher", bio: "Author of LeviLauncher (Windows and Android). Developer of LeviLamina." },
      "KawaiiNahida": { role: "Maintainer of Header Generator", bio: "Maintains the header generation system, ensuring efficient and accurate header files. Author of LeviAntiCheat." },
      "RimuruChan": { role: "Maintainer of Header Generator", bio: "Maintains the header generation system, ensuring efficient and accurate header files." },
      "Dofes": { role: "Author of LeviOptimize", bio: "Creator and maintainer of LeviOptimize, a performance optimization mod for LeviLamina servers and clients. Developer of LeviLamina and LegacyScriptEngine." },
      "futrime": { role: "Author of lip", bio: "Develops and maintains lip, which runs LeviLamina servers and manages their packages. Developer of LegacyScriptEngine." },
      "wu-vincent": { role: "Author of Endstone", bio: "Creator and maintainer of Endstone, a popular plugin loader for Bedrock Dedicated Server. Provides support for LeviStone." },
      "quizhizhe": { role: "Author of MoreDimensions", bio: "Brings custom dimensions to Minecraft Bedrock Edition with the MoreDimensions API. Developer of LeviLamina and author of LiteLoaderBDS 1.16.40." },
      "Lovelylavender4": { role: "Maintainer of LeviLamina", bio: "Maintains LeviLamina, contributing to its development and community support." },
      "zimuya4153": { role: "Developer of LeviLamina", bio: "Contributes to the development of LeviLamina." },
      "PA733": { role: "Server Administrator", bio: "Manages servers and infrastructure. Developer of LeviLamina and LiteLoaderBDS." },
      "ShrBox": { role: "Creator of LeviMC (formerly LiteLDev)", bio: "Original creator of LiteLDev (now LeviMC) and contributor to LegacyScriptEngine and LeviLamina." },
      "yqs112358": { role: "Author of LiteXLoader", bio: "Creates LiteXLoader and contributes to LiteLoaderBDS." },
      "xiaoqch": { role: "Developer of LeviLamina", bio: "Contributes to the development of LeviLamina and LiteLoaderBDS." },
      "wzyyyyyyy": { role: "Developer of LiteLoaderBDS", bio: "Contributes to the development of LiteLoaderBDS and LiteXLoader." },
      "twoone-3": { role: "Developer of the LLSE Python engine", bio: "Brings Python scripting to LLSE plugins. Author of PythonRunner and developer of LiteLoaderBDS." },
      "ddf8196": { role: "Developer of LeviLamina", bio: "Contributes to the development of LeviLamina." },
      "Pd233": { role: "Author of LiteLoader.NET", bio: "Provides .NET scripting support for LiteLoaderBDS." },
      "Jaciezyt": { role: "Developer of LeviLamina", bio: "Makes contributions to LeviLamina and LiteLoaderBDS." },
      "cryx233": { role: "Developer of many LiteLoaderBDS plugins", bio: "Develops plugins for LiteLoaderBDS that enhance server functionality." },
    } as Record<string, { role: string; bio: string }>,
  },

  // Projects section
  projects: {
    label: "ECOSYSTEM",
    title: "Our projects.",
    moreOnGitHub: "More projects on GitHub",
    explore: "Explore",
  },

  // Features section
  features: {
    label: "WHY LEVIMC",
    title1: "One ecosystem",
    title2: "for all of Bedrock.",
    description:
      "Players, server owners, and mod developers share the same open-source tools, the same catalog of mods, and the same community.",
    // Feature items
    platforms: "Windows and Android",
    platformsDesc:
      "LeviLauncher runs on PCs and phones; LeviLamina runs mods on Windows servers and clients.",
    oneCommand: "One-command installs",
    oneCommandDesc:
      "lip installs a mod with its dependencies, and LeviMC Mods lists every mod with its install command.",
    multiLang: "Your language",
    multiLangDesc:
      "Write native mods in modern C++, or plugins in JavaScript, Node.js, Lua, or Python with LegacyScriptEngine.",
    openSource: "Open source",
    openSourceDesc:
      "Developed in the open on GitHub, with an active community on Discord and Telegram to help you out.",
  },

  // Community section
  community: {
    title1: "Join the",
    title2: "community.",
    description:
      "Connect with developers building the future of Bedrock modding. Get help, share your mods, and contribute to the ecosystem.",
    joinDiscord: "Join Discord",
    coreProjects: "Core Projects",
    // Community page
    pageTitle: "Get Involved",
    pageDesc: "Connect with the LeviMC community.",
    discordTitle: "Discord",
    discordDesc:
      "Get real-time help, share your mods, and chat with the core team and community.",
    telegramTitle: "Telegram",
    telegramDesc: "Join our Telegram group for discussions and updates.",
    discordLabel: "Community Server",
    telegramLabel: "Community Group",
    joinTelegram: "Join Telegram",
    githubTitle: "GitHub",
    githubDesc:
      "Contribute to the project, report issues, and browse the source code.",
    viewOnGitHub: "View on GitHub",
    qqTitle: "QQ Group",
    qqDesc: "Join our QQ group to chat with the Chinese community.",
    qqGroups: "Communication Groups",
  },

  // Support page
  support: {
    pageTitle: "Support LeviMC",
    pageDesc:
      "Help us build the Bedrock modding ecosystem—contribute code or support us financially.",
    contributeTitle: "Contribute code",
    contributeDesc:
      "Pick an issue, improve docs, or add a feature. Every pull request helps the community.",
    contributeCta: "Find an issue to work on",
    donateTitle: "Donate to the project",
    donateDesc:
      "Your support keeps our infrastructure running and lets us spend more time on features.",
    donateChannels: "Donation channels",
    channelAfdian: "Afdian",
    channelOpenCollective: "OpenCollective",
    donorsSectionTitle: "Supporters",
    donorsSectionDesc:
      "Greatly appreciate the generous support of the following supporters to LeviMC.",
    donorsLoading: "Loading donors from CSV...",
    donorsErrorTitle: "Could not load donor data",
    donorsError: "Could not load the donor list from donors.csv.",
    donorsEmptyTitle: "No donor entries yet",
    donorsEmpty:
      "Add one or more rows to public/donors.csv and refresh this page.",
    donorLinkLabel: "Open link",
  },


  // Project descriptions
  projects_desc: {
    levilamina:
      "A lightweight, modular, and versatile mod loader for Minecraft Bedrock Edition.",
    legacyscriptengine:
      "Run LLSE plugins written in JavaScript, Node.js, Lua, or Python on LeviLamina.",
    lip: "Run a LeviLamina server and manage its packages: set it up, install and update its mods, and start it.",
    levilauncher: "A launcher for Minecraft Bedrock Edition on Windows (GDK / UWP) and Android.",
    levioptimize: "A performance optimization mod for LeviLamina servers and clients.",
    levianticheat: "Anti-cheating solution for LeviLamina servers.",
    moredimensions:
      "An API for LeviLamina mods to add custom dimensions to Bedrock Dedicated Server.",
    levistone: "A runtime for running Endstone plugins on LeviLamina.",
    bedd:
      "End-to-end testing for LeviLamina client mods in the background: scripts or agents play several games at once while your mouse and keyboard stay yours.",
    bedboo:
      "A Minecraft Bedrock Edition bot library with a mineflayer-compatible API: run bots and mineflayer plugins against a Bedrock Dedicated Server.",
  },
  // Blog (levimc.org/blog/) — the chrome around the posts; the posts themselves are in Chinese
  blog: {
    name: "LeviMC's blog",
    tagline: "All about development",
    eyebrow: "Blog",
    sections: "Blog sections",
    posts: "Posts",
    tags: "Tags",
    categories: "Categories",
    archives: "Archives",
    about: "About",
    friends: "Friends",
    rss: "RSS",
    latest: "Latest posts",
    readMore: "Read more",
    minutes: (n: number) => `${n} min read`,
    postCount: (n: number) => (n === 1 ? "1 post" : `${n} posts`),
    tagTitle: (name: string) => `Tag: ${name}`,
    categoryTitle: (name: string) => `Category: ${name}`,
    monthLabel: (y: string, m: string) => `${MONTHS_EN[Number(m) - 1]} ${y}`,
    archiveTitle: (y: string, m?: string) => `Archives: ${m ? `${MONTHS_EN[Number(m) - 1]} ${y}` : y}`,
    page: (n: number) => `Page ${n}`,
    previousPost: "Previous post",
    nextPost: "Next post",
    writtenIn: "Written in Simplified Chinese",
    by: "by",
    comments: "Comments",
    commentsLoading: "Loading comments…",
    commentsFailed: "Comments could not be loaded.",
    reload: "Could not load this post — reload the page",
    backToBlog: "All posts",
    date: (iso: string) => `${MONTHS_EN[Number(iso.slice(5, 7)) - 1]} ${Number(iso.slice(8, 10))}, ${iso.slice(0, 4)}`,
    monthName: (m: string) => MONTHS_EN[Number(m) - 1]!,
  },

  // LeviChan: the avatar peeking from behind the hero card, and her 3D space
  levichan: {
    avatar: "Who's there?",
    loading: "Summoning LeviChan…",
    loadFailed: "LeviChan could not be loaded.",
    menuTitle: "LeviChan",
    hint: "The page came apart and she lives on its pieces. Fly around like in Minecraft: WASD, Space up, Shift down, Ctrl faster, scroll wheel forward and back, drag to look around, F to find her. Click a piece and she makes her way there (hopping, climbing) and plays with it; double-click a small one and she carries it somewhere else; drag her, throw a cube, pat or poke her… Links only light up here.",
    hintTouch: "The page came apart and she lives on its pieces. Drag with one finger to look around, pinch to go forward and back, drag with two fingers to move. Tap a piece and she makes her way there and plays with it; double-tap a small one and she carries it elsewhere; hold her to pick her up, throw a cube, pat or poke her… Links only light up here.",
    lookLabel: "Watch the cursor",
    look: { auto: "Her choice", always: "Always", never: "Never" },
    quiet: "Fewer fidgets",
    follow: "Camera follows her",
    focus: "Fly to her (F)",
    exit: "Leave the 3D space",
    say: {
      hello: "Hi!",
      bye: "Bye-bye!",
      welcomeBack: "Welcome back!",
      copied: "Got it!",
      dizzy: "@_@",
      stop: "Hey! Stop it!",
      pat: "Ehehe…",
      mined: "+1 block!",
      yawn: "Fwaaah…",
      look: "Look!",
    },
  },
};

export default en;
