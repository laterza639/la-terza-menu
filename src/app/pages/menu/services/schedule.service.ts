// services/schedule.service.ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environments } from '../../../../environments/environments';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private readonly baseUrl = `${environments.testBaseUrl}/schedule`;
  private http = inject(HttpClient);
  private router = inject(Router);

  private getCurrentBranch(): string {
    const url = this.router.url;
    return url.includes('headquarters') ? '1' : '2';
  }

  getStatus() {
    const branch = this.getCurrentBranch();
    return this.http.get<boolean>(`${this.baseUrl}/status?branch=${branch}`);
  }
}
