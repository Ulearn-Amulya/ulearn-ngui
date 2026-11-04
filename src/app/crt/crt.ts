import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CrtPracticePath, CrtPracticeService } from './services/crt-practice.service';

@Component({
  selector: 'app-crt',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './crt.html',
  styles: `
    .crt-home {
      max-width: 720px;
      margin: 0 auto;
      padding: 48px 24px 72px;
    }
    .page-header a {
      color: var(--purple);
      font-weight: 700;
      text-decoration: none;
    }
    .page-header h1 {
      margin: 0 0 8px;
      color: var(--navy);
      font-family: 'Poppins', sans-serif;
    }
    .page-header p,
    .path-card p,
    .status {
      margin: 0;
      color: var(--muted);
    }
    .status,
    .banner {
      margin-top: 32px;
    }
    .banner {
      padding: 16px;
      border: 1px solid #f3c2c2;
      border-radius: 12px;
      background: #fdecec;
    }
    .banner p {
      margin-bottom: 12px;
      color: var(--navy);
    }
    .path-list {
      display: grid;
      gap: 16px;
      margin: 32px 0 0;
      padding: 0;
      list-style: none;
    }
    .path-card {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
      padding: 20px;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 16px;
    }
    .path-card h2 {
      margin: 0;
      color: var(--navy);
      font-size: 1.15rem;
    }
    .btn-primary {
      margin-top: 8px;
      padding: 10px 18px;
      border: none;
      border-radius: 8px;
      background: var(--purple);
      color: #fff;
      font-weight: 700;
      cursor: pointer;
    }
  `
})
export class Crt implements OnInit {
  private readonly practice = inject(CrtPracticeService);
  private readonly router = inject(Router);

  readonly loading = signal(true);
  readonly loadError = signal<string | null>(null);
  readonly paths = signal<CrtPracticePath[]>([]);

  ngOnInit(): void {
    void this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.loadError.set(null);
    try {
      this.paths.set(await this.practice.listPublishedPaths());
    } catch (error: unknown) {
      this.paths.set([]);
      this.loadError.set(error instanceof Error ? error.message : 'Could not load learning paths.');
    } finally {
      this.loading.set(false);
    }
  }

  viewModules(pathId: string): void {
    void this.router.navigate(['/crt/paths', pathId, 'modules']);
  }
}
