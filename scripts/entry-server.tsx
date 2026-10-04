import React from 'react';
import { PassThrough } from 'node:stream';
import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import App from '../App';

export async function render(url: string): Promise<string> {
  let deadline: ReturnType<typeof setTimeout> | undefined;
  try {
    return await new Promise<string>((resolve, reject) => {
      const output = new PassThrough();
      let html = '';
      output.on('data', (chunk) => { html += chunk.toString(); });
      output.on('end', () => resolve(html));
      output.on('error', reject);
      const { pipe, abort } = renderToPipeableStream(
        <React.StrictMode><StaticRouter location={url}><App /></StaticRouter></React.StrictMode>,
        {
          onAllReady() { pipe(output); },
          onShellError: reject,
          onError: reject,
        },
      );
      deadline = setTimeout(() => {
        abort();
        reject(new Error(`Pre-rendering timed out: ${url}`));
      }, 10000);
    });
  } finally {
    clearTimeout(deadline);
  }
}
