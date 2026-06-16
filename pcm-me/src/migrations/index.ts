import * as migration_20260616_124537_initial from './20260616_124537_initial';

export const migrations = [
  {
    up: migration_20260616_124537_initial.up,
    down: migration_20260616_124537_initial.down,
    name: '20260616_124537_initial'
  },
];
