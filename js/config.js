/* * Kai-OS 配置文件
 * 请在此处填入你的 Coze Bot 信息和素材路径
 */

const CONFIG = {
    // 1. 你的 Coze 智能体配置
    // 注意：请确保你的 Coze Bot 已发布为 API 服务
    coze: {
        bot_id: "在此填入你的Bot_ID", 
        api_token: "在此填入你的Personal_Access_Token",
        user_id: "user_001" // 默认用户ID，可不改
    },

    // 2. 界面显示配置
    ui: {
        title: "TIER 咖啡数字主理人",
        welcome_message: "你好！我是 Kai，今天的咖啡沙龙由我来主持。你可以问我关于手冲咖啡的知识，或者 AI 的原理。",
        theme_color: "#6F4E37" // 咖啡色，可修改
    },

    // 3. 数字人视频路径配置 (请确保文件在 assets 文件夹下)
    avatar: {
        idle_video: "assets/idle.mp4",    // 待机状态
        talking_video: "assets/talking.mp4", // 说话状态
        thinking_video: "assets/idle.mp4" // 思考状态 (如果没有专用视频，可用idle代替)
    }
};