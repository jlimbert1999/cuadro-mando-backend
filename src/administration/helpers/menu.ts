import { ValidRoles } from 'src/auth/interfaces/valid-resources.interface';

export const systemResources = [
  {
    roles: [ValidRoles.COLLECTION, ValidRoles.EXECUTION, ValidRoles.OFFICER],
    text: 'Inicio',
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
    roles: [ValidRoles.OFFICER],
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
    text: 'Comparacion recaudacion',
    icon: 'leaderboard',
    routerLink: 'collection/comparation',
    group: {
      text: 'Comparaciones',
      icon: 'list_alt',
    },
  },
  {
    roles: [ValidRoles.OFFICER],
    text: 'Comparacion ejecucion',
    icon: 'leaderboard',
    routerLink: 'executions/comparation',
    group: {
      text: 'Comparaciones',
      icon: 'list_alt',
    },
  },
  {
    roles: [ValidRoles.COLLECTION],
    text: 'Recaudacion',
    icon: 'list_alt',
    routerLink: 'collection/records',
    group: {
      text: 'Registros',
      icon: 'list_alt',
    },
  },
  {
    roles: [ValidRoles.EXECUTION],
    text: 'Ejecucion',
    icon: 'list_alt',
    routerLink: 'executions/summary',
    group: {
      text: 'Registros',
      icon: 'list_alt',
    },
  },
];
