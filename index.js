import { Nodebox } from '@codesandbox/nodebox';

export async function start({$nodeboxIframe, $previewIframe, main}) {
  if (!($nodeboxIframe && $previewIframe)) {
    throw new Error('Missing elements')
  }
  if (!main) {
    throw new Error('Missing main script')
  }

  const emulator = new Nodebox({ iframe: $nodeboxIframe });

  await emulator.connect();

  await emulator.fs.init({
    'package.json': JSON.stringify({
      name: 'my-app',
      dependencies: {
        '@enhance/ssr': 'latest',
        '@enhance/enhance-style-transform': 'latest',
      },
    }),
    'main.js': main,
  });

  const shell = emulator.shell.create();
  const serverCommand = await shell.runCommand("node", ["main.js"]);

  const { url } = await emulator.preview.getByShellId(serverCommand.id);

  $previewIframe.setAttribute("src", url);
}
