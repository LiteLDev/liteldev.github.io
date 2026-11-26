import { LINKS, PixelIcon } from '../../kit/components';
import type { Project } from '../data/projects';
import { useI18n } from '../i18n';

interface ProjectCardProps {
  project: Project;
  /** 3 under a section heading (Home), 2 directly under the page h1 (/projects/). */
  headingLevel?: 2 | 3;
}

/** One project in the home grid: no frame, a hairline above it; logo, name, its kind. The whole card links to the project's home page. */
export default function ProjectCard({ project, headingLevel = 3 }: ProjectCardProps) {
  const Name = headingLevel === 2 ? 'h2' : 'h3';
  const kind = project.tags[0];
  // LeviMC Mods pages stay in this tab; docs and repositories open beside it, as before
  const external = !project.link.startsWith(LINKS.home);
  // a LeviMC Mods page in the page's language (/zh-Hans/mods/…)
  const { href } = useI18n();

  return (
    <article className="lm-project">
      <img className="lm-project-icon lm-project-logo" src={project.logo} alt="" width={56} height={56} loading="lazy" decoding="async" />
      <Name className="lm-project-name">
        <a href={external ? project.link : href(project.link)} className="lm-project-link" {...(external ? { target: '_blank', rel: 'noopener' } : {})}>
          {project.name}
          <PixelIcon name="arrowRight" />
        </a>
      </Name>
      <p className="lm-project-desc">{project.description}</p>

      <p className="lm-project-meta">
        {kind ? <span>{kind}</span> : null}
      </p>

    </article>
  );
}
