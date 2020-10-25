/* eslint-env worker */
/* global kizunanocoin:false */

importScripts('https://cdn.jsdelivr.net/npm/kizunanocoin@2/dist/kizunanocoin.umd.js');

onmessage = async function({ data }) {
  const { blockHash, workerIndex, workerCount } = data;

  postMessage({ type: 'started' });

  const work = await kizunanocoin.computeWork(blockHash, { workerIndex, workerCount });

  postMessage({ type: 'done', work });
};
