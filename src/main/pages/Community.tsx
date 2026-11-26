import { DiscordCard, GitHubCard, QQCard, TelegramCard } from '../components/CommunityCards';
import { PageHeader } from '../components/ui';
import { isChineseLocale, useI18n } from '../i18n';

export default function Community() {
  const { t, locale } = useI18n();

  return (
    <div className="lm-page lm-container lm-container-narrow">
      <PageHeader eyebrow={t.nav.community.toUpperCase()} title={t.community.pageTitle} lead={t.community.pageDesc} />
      <div className="lm-grid-2">
        <DiscordCard headingLevel={2} />
        <TelegramCard headingLevel={2} />
        <GitHubCard headingLevel={2} />
        {/* QQ Card - Only show in Chinese */}
        {isChineseLocale(locale) && <QQCard headingLevel={2} />}
      </div>
    </div>
  );
}
