import * as migration_20260616_124537_initial from './20260616_124537_initial';
import * as migration_20260616_132547_session02_admin from './20260616_132547_session02_admin';

export const migrations = [
  {
    up: migration_20260616_124537_initial.up,
    down: migration_20260616_124537_initial.down,
    name: '20260616_124537_initial',
  },
  {
    up: migration_20260616_132547_session02_admin.up,
    down: migration_20260616_132547_session02_admin.down,
    name: '20260616_132547_session02_admin'
  },
];
