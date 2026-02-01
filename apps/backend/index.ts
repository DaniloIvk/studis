import 'dotenv/config';
import appConfig from './config/app';
import app from './bootstrap/app';
import { logData, logErrors } from './app/core/logging/helpers';
import chalk from 'chalk';

app.listen(appConfig.port, (error: Error | undefined) => {
	if (error !== undefined) {
		logErrors(`
    ╔═══════════════════════════════╦═╗ ·  • ·· ÷ •  · ·× • ·
    ║ ×            ERROR            × ╠ • • ·  × ○  ¤  • · ¤
    ╬═══════════════════════════════╩═╝  ¤· + • ·×  ·+  • + ·
    ╬═╣÷ ·• • + • ·  +·  • ÷· +× · • + ¤ ·  •· +·  ·×  ·÷ • ·
      ╝·¤ •  · •÷ ·× + •  +¤ · • ·  · + •   ×  ÷·  • ·  •  ¤
    `);
		logErrors(error);
		return;
	}

	const port = String(appConfig.port).padEnd(7, ' ');

	logData(
		chalk.blue(`
  ╔═══════════════════════════════╦═╗ ·  • ·· ÷ •  · ·× • ·
  ║ •  Listening on port ${port}• ╠ • • ·  × ○  ¤  • · · ¤
  ╬═══════════════════════════════╩═╝  ¤· + • ·×  ·+  • + ·
  ╬═══╝  ·•÷ · •  ×  •· +· •÷  ¤  · • · • ·  · • + ÷• ·÷ •
  ╬═╣÷ ·• • + • ·  +·  • ÷· +× · • + ¤ ·  •· +·  ·×  ·÷ • ·
  ╝·¤ •  · •÷ ·× + •  +¤ · • ·  · + •   ×  ÷·  • ·  •  ¤ ·
  `),
	);
});
