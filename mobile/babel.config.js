module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@numble/shared': '../shared/game/index.ts',
          },
        },
      ],
    ],
  };
};
