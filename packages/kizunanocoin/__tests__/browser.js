/* eslint-env jest */
/* eslint-disable @typescript-eslint/no-var-requires */
/* global kizunanocoin */

const fs = require('fs')
const { promisify } = require('util')
const puppeteer = require('puppeteer')

const readFile = promisify(fs.readFile)

let browser = null
let page = null
let umdScript = null
beforeAll(async () => {
  browser = await puppeteer.launch()
  page = await browser.newPage()
  umdScript = await readFile('./dist/kizunanocoin.umd.js', 'utf8')
})

afterAll(() => browser.close())

describe('browser', () => {
  test('works in browser', async () => {
    expect.assertions(2)

    // load kizunanocoin
    await page.evaluate(umdScript)

    let result = null

    // seed generation
    result = await page.evaluate(async function() {
      const a = await kizunanocoin.generateSeed()
      const b = await kizunanocoin.generateSeed()
      return { a, b }
    })
    expect(result.a).not.toBe(result.b)

    // webassembly test (test in worker)
    result = await page.evaluate(
      function(passed) {
        return new Promise((resolve, reject) => {
          const blobURL = URL.createObjectURL(
            new Blob(
              [
                passed.umdScript,
                '(',
                function() {
                  kizunanocoin.computeWork(
                    'b9cb6b51b8eb869af085c4c03e7dc539943d0bdde13b21436b687c9c7ea56cb0'
                  ).then(work => {
                    postMessage(work)
                  })
                }.toString(),
                ')()',
              ],
              {
                type: 'application/javascript',
              }
            )
          )

          const worker = new Worker(blobURL)
          worker.onmessage = function(e) {
            const work = e.data

            resolve(work)
          }
          worker.onerror = function(err) {
            reject(err)
          }

          URL.revokeObjectURL(blobURL)
        })
      },
      { umdScript }
    )

    expect(result).toBe('0000000000010600')
  })
})
