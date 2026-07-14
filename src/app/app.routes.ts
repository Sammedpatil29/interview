import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadComponent: () => import('../components/public-components/home/home.component').then(m => m.HomeComponent),
    },
    {
        path: 'docs',
        loadComponent: () => import('../components/public-components/docs/docs.component').then(m => m.DocsComponent),
    },
    {
        path: 'candidate',
        loadComponent: () => import('../components/candidate-components/candidate-layout/candidate-layout.component').then(m => m.CandidateLayoutComponent),
        children: [
            {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
            {
        path: 'schedule',
        loadComponent: () => import('../components/public-components/schedule-form/schedule-interview.component').then(m => m).then(m => m.ScheduleInterviewComponent),
    },
            {
        path: 'dashboard',
        loadComponent: () => import('../components/candidate-components/dashboard/dashboard.component').then(m => m).then(m => m.DashboardComponent),
    },
            {
        path: 'interviews',
        loadComponent: () => import('../components/candidate-components/interviews/interviews.component').then(m => m).then(m => m.InterviewsComponent),
    },
            {
        path: 'transactions',
        loadComponent: () => import('../components/public-components/transactions/transactions.component').then(m => m).then(m => m.TransactionsComponent),
    },
            {
        path: 'profile',
        loadComponent: () => import('../components/candidate-components/profile/profile.component').then(m => m).then(m => m.ProfileComponent),
    },
        ]
    }
];
