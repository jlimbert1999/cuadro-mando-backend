import { ValidRoles } from 'src/auth/interfaces/valid-resources.interface';

export const systemModules = [
  {
    roles: [ValidRoles.COLLECTION, ValidRoles.EXECUTION, ValidRoles.OFFICER],
    text: 'Informe general',
    icon: 'description',
    routerLink: 'dashboard',
  },
  {
    roles: [ValidRoles.ADMIN],
    text: 'Usuarios',
    icon: 'account_circle',
    routerLink: 'admin/users',
  },
  {
    roles: [ValidRoles.COLLECTION],
    text: 'Comparacion recaudacion',
    icon: 'data_usage',
    routerLink: 'collection/comparation',
  },
  {
    roles: [ValidRoles.COLLECTION],
    text: 'Historicos recaudacion',
    icon: 'stacked_line_chart',
    routerLink: 'collection/history',
  },
  {
    roles: [ValidRoles.OFFICER],
    text: 'Proyeccion recaudacion',
    icon: 'legend_toggle',
    routerLink: 'collection/projection',
  },
  {
    roles: [ValidRoles.OFFICER],
    text: 'Ejecucion secretarias',
    icon: 'leaderboard',
    routerLink: 'execution/departments',
  },
  {
    roles: [ValidRoles.OFFICER],
    text: 'Comparacion ejecucion',
    icon: 'data_usage',
    routerLink: 'execution/comparation',
  },
  {
    roles: [ValidRoles.COLLECTION],
    text: 'Registros recaudacion',
    icon: 'list_alt',
    routerLink: 'collection/records',
  },
  // {
  //   roles: [ValidRoles.EXECUTION],
  //   text: 'Registros ejecucion',
  //   icon: 'list_alt',
  //   routerLink: 'execution/records',
  // },
  {
    roles: [ValidRoles.EXECUTION],
    text: 'Ejecucion por gestiones',
    icon: 'list_alt',
    routerLink: 'execution/summary',
  },
];
