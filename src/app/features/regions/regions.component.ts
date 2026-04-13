import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, Inject, NgZone, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { finalize, timeout } from 'rxjs/operators';
import { Page } from '../../core/models/pagination.model';
import { Region } from '../../core/models/region.model';
import { RegionService, SortDirection } from '../../core/services/region.service';

@Component({
  selector: 'app-regions',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatTableModule,
  ],
  templateUrl: './regions.component.html',
  styleUrl: './regions.component.scss',
})
export class RegionsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'code', 'name', 'actions'];
  regions: Region[] = [];
  dataSource = new MatTableDataSource<Region>([]);

  totalElements = 0;
  currentPage = 0;
  pageSize = 10;

  sortColumn = 'name';
  sortDirection: SortDirection = 'asc';

  loading = false;
  error: string | null = null;
  private readonly isBrowser: boolean;
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  constructor(
    private readonly regionService: RegionService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private readonly zone: NgZone,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) {
      return;
    }

    this.loadRegions();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator ?? null;
    this.dataSource.sort = this.sort ?? null;
  }

  onPageChange(event: PageEvent): void {
    if (!this.isBrowser) {
      return;
    }

    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadRegions();
  }

  onSortChange(sort: Sort): void {
    if (!this.isBrowser) {
      return;
    }

    if (!sort.active || !sort.direction) {
      this.sortColumn = 'name';
      this.sortDirection = 'asc';
    } else {
      this.sortColumn = sort.active;
      this.sortDirection = sort.direction as SortDirection;
    }

    this.currentPage = 0;
    this.loadRegions();
  }

  deleteRegion(id: number, code: string): void {
    if (!this.isBrowser) {
      return;
    }

    const ok = confirm(`¿Seguro que quieres borrar la región ${code} (id=${id})?`);
    if (!ok) {
      return;
    }

    this.loading = true;
    this.error = null;
    setTimeout(() => this.cdr.detectChanges(), 0);

    this.regionService.deleteRegion(id).subscribe({
      next: () => {
        this.loadRegions();
      },
      error: (err: { status?: number }) => {
        this.loading = false;

        if (err.status === 401) {
          this.router.navigate(['/login']);
          return;
        }

        if (err.status === 403) {
          this.router.navigate(['/forbidden']);
          return;
        }

        if (err.status === 404) {
          this.error = 'La región ya no existe (404)';
          setTimeout(() => this.cdr.detectChanges(), 0);
          return;
        }

        if (err.status === 409) {
          this.error = 'No se puede borrar: la región está relacionada con otros datos';
          setTimeout(() => this.cdr.detectChanges(), 0);
          return;
        }

        this.error = 'Error al borrar la región';
        setTimeout(() => this.cdr.detectChanges(), 0);
      },
    });
  }
  private loadRegions(): void {
    if (!this.isBrowser) {
      return;
    }

    this.loading = true;
    this.error = null;
    setTimeout(() => this.cdr.detectChanges(), 0);

    this.regionService
      .fetchRegions(this.currentPage, this.pageSize, `${this.sortColumn},${this.sortDirection}`)
      .pipe(
        timeout(4000),
        finalize(() => {
          this.zone.run(() => {
            this.loading = false;
            setTimeout(() => this.cdr.detectChanges(), 0);
          });
        })
      )
      .subscribe({
        next: (page: Page<Region>) => {
          this.zone.run(() => {
            this.regions = page.content;
            this.dataSource.data = page.content;
            this.totalElements = page.totalElements;
            this.currentPage = page.number;
            this.pageSize = page.size;
            this.dataSource.paginator = this.paginator ?? null;
            this.dataSource.sort = this.sort ?? null;
            setTimeout(() => this.cdr.detectChanges(), 0);
          });
        },
        error: (err: { status?: number }) => {
          this.zone.run(() => {
            if (err.status === 401) {
              this.router.navigate(['/login']);
              return;
            }
            if (err.status === 403) {
              this.router.navigate(['/forbidden']);
              return;
            }

            this.error = 'No se pudieron cargar las comunidades autónomas. Revisa la sesión o el backend.';
            setTimeout(() => this.cdr.detectChanges(), 0);
          });
        },
      });
  }
  
}
