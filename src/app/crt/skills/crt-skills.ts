import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CrtPracticePath, CrtPracticeService } from '../services/crt-practice.service';
import { CrtTopicPerformance, CrtTopicPerformanceService } from '../services/crt-topic-performance.service';

@Component({
  selector: 'app-crt-skills',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './crt-skills.html',
  styles: `
    .crt-skills {
      max-width: 900px;
      margin: 0 auto;
      padding: 48px 24px 72px;
    }

    .page-header a {
      color: var(--purple);
      font-weight: 700;
      text-decoration: none;
    }

    .visually-hidden {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }

    .page-header h1 {
      margin: 16px 0 8px;
      color: var(--navy);
      font-family: 'Poppins', sans-serif;
    }

    .page-header p,
    .status {
      margin: 0;
      color: var(--muted);
    }

    .status,
    .banner,
    .path-picker {
      margin-top: 32px;
    }

    .banner {
      padding: 16px;
      border: 1px solid #f3c2c2;
      border-radius: 12px;
      background: #fdecec;
    }

    .banner p {
      margin: 0 0 12px;
      color: var(--navy);
    }

    .path-picker {
      display: flex;
      flex-direction: column;
      gap: 8px;
      color: var(--navy);
      font-weight: 700;
    }

    .path-picker select {
      width: 100%;
      max-width: 420px;
      padding: 10px 12px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--card);
      color: var(--text);
      font: inherit;
    }

    .table-wrap {
      margin-top: 24px;
      overflow-x: auto;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 14px;
    }

    table {
      width: 100%;
      min-width: 520px;
      border-collapse: collapse;
    }

    th,
    td {
      padding: 12px 14px;
      border-bottom: 1px solid var(--border);
      text-align: left;
    }

    th {
      color: var(--muted);
      font-size: 0.78rem;
      letter-spacing: 0.03em;
      text-transform: uppercase;
    }

    tr:last-child td {
      border-bottom: none;
    }

    .btn-primary {
      padding: 10px 20px;
      border: none;
      border-radius: 8px;
      background: var(--purple);
      color: #fff;
      font-weight: 700;
      cursor: pointer;
    }

    @media (max-width: 640px) {
      .crt-skills {
        padding: 32px 16px 56px;
      }
    }
  `
})
export class CrtSkills implements OnInit {
  private readonly practice = inject(CrtPracticeService);
  private readonly topicPerformance = inject(CrtTopicPerformanceService);

  readonly loading = signal(true);
  readonly loadError = signal<string | null>(null);
  readonly paths = signal<CrtPracticePath[]>([]);
  readonly selectedPathId = signal('');
  readonly topics = signal<CrtTopicPerformance[]>([]);

  ngOnInit(): void {
    void this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.loadError.set(null);

    try {
      const paths = await this.practice.listPublishedPaths();
      this.paths.set(paths);
      const current = this.selectedPathId();
      const pathId = paths.some((path) => path.id === current) ? current : paths[0]?.id ?? '';
      this.selectedPathId.set(pathId);
      this.topics.set(pathId ? await this.topicPerformance.listTopicPerformance(pathId) : []);
    } catch (error: unknown) {
      this.paths.set([]);
      this.topics.set([]);
      this.loadError.set(error instanceof Error ? error.message : 'Could not load topic performance.');
    } finally {
      this.loading.set(false);
    }
  }

  async selectPath(event: Event): Promise<void> {
    const pathId = (event.target as HTMLSelectElement).value;
    if (!pathId || pathId === this.selectedPathId()) return;
    this.selectedPathId.set(pathId);
    await this.load();
  }
}
