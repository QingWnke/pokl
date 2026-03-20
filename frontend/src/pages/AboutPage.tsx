export const AboutPage = () => (
  <div className="space-y-6">
    <section className="glass-panel rounded-3xl p-6">
      <h2 className="text-3xl font-bold text-white">关于 PlayNexus</h2>
      <p className="mt-4 text-slate-300">PlayNexus 是一个响应式 HTML5 迷你游戏平台，专注于开源、轻量、浏览器即点即玩的小游戏体验。平台支持游戏分类导航、评分评论系统、广告变现配置，以及完整后台管理能力。</p>
    </section>
    <section className="glass-panel rounded-3xl p-6">
      <h3 className="text-xl font-semibold text-white">版权与许可证合规</h3>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
        <li>平台仅集成具备明确开源许可证、允许商用嵌入/再分发/修改的 HTML5 游戏仓库。</li>
        <li>每款游戏均保留开发者信息、GitHub 仓库地址、许可证名称与许可证链接。</li>
        <li>后台提供 GitHub 元数据导入与人工审核流程，以降低版权风险。</li>
      </ul>
    </section>
  </div>
);
