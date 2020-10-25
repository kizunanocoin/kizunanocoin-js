#!/usr/bin/env node
import * as yargs from 'yargs'
import * as kizunanocoin from 'kizunanocoin'

const wrapSubcommand = (yargs: yargs.Argv): yargs.Argv =>
  yargs
    .updateStrings({
      'Commands:': 'item:',
    })
    .demandCommand(1, 'Please specify an item')
    .help()
    .version(false)
    .wrap(null)

yargs
  .usage('usage: $0 <command>')
  .command(
    'check',
    'check a [seed|index|amount|hash|key|address|work|signature]',
    yargs => {
      return wrapSubcommand(
        yargs
          .usage('usage: $0 check <item>')
          .command(
            'seed',
            'check a seed',
            yargs => {
              return yargs
                .usage('usage: $0 check seed [options]')
                .option('candidate', {
                  demandOption: true,
                  describe: 'candidate to check',
                  type: 'string',
                })
            },
            argv => {
              const valid = kizunanocoin.checkSeed(argv.candidate)
              console.log(valid)
            }
          )
          .command(
            'index',
            'check an index',
            yargs => {
              return yargs
                .usage('usage: $0 check index [options]')
                .option('candidate', {
                  demandOption: true,
                  describe: 'candidate to check',
                  type: 'number',
                })
            },
            argv => {
              const valid = kizunanocoin.checkIndex(argv.candidate)
              console.log(valid)
            }
          )
          .command(
            'amount',
            'check an amount',
            yargs => {
              return yargs
                .usage('usage: $0 check amount [options]')
                .option('candidate', {
                  demandOption: true,
                  describe: 'candidate to check',
                  type: 'string',
                })
            },
            argv => {
              const valid = kizunanocoin.checkAmount(argv.candidate)
              console.log(valid)
            }
          )
          .command(
            'hash',
            'check an hash',
            yargs => {
              return yargs
                .usage('usage: $0 check hash [options]')
                .option('candidate', {
                  demandOption: true,
                  describe: 'candidate to check',
                  type: 'string',
                })
            },
            argv => {
              const valid = kizunanocoin.checkHash(argv.candidate)
              console.log(valid)
            }
          )
          .command(
            'key',
            'check a public or private key',
            yargs => {
              return yargs
                .usage('usage: $0 check key [options]')
                .option('candidate', {
                  demandOption: true,
                  describe: 'candidate to check',
                  type: 'string',
                })
            },
            argv => {
              const valid = kizunanocoin.checkKey(argv.candidate)
              console.log(valid)
            }
          )
          .command(
            'address',
            'check an address',
            yargs => {
              return yargs
                .usage('usage: $0 check address [options]')
                .option('candidate', {
                  demandOption: true,
                  describe: 'candidate to check',
                  type: 'string',
                })
            },
            argv => {
              const valid = kizunanocoin.checkAddress(argv.candidate)
              console.log(valid)
            }
          )
          .command(
            'work',
            'check a work',
            yargs => {
              return yargs
                .usage('usage: $0 check work [options]')
                .option('candidate', {
                  demandOption: true,
                  describe: 'candidate to check',
                  type: 'string',
                })
            },
            argv => {
              const valid = kizunanocoin.checkWork(argv.candidate)
              console.log(valid)
            }
          )
          .command(
            'signature',
            'check a signature',
            yargs => {
              return yargs
                .usage('usage: $0 check signature [options]')
                .option('candidate', {
                  demandOption: true,
                  describe: 'candidate to check',
                  type: 'string',
                })
            },
            argv => {
              const valid = kizunanocoin.checkSignature(argv.candidate)
              console.log(valid)
            }
          )
      )
    }
  )
  .command('convert', 'convert an [amount]', yargs => {
    return wrapSubcommand(
      yargs.usage('usage: $0 convert <item>').command(
        'amount',
        'convert an amount',
        yargs => {
          return yargs
            .usage('usage: $0 convert amount [options]')
            .option('input', {
              demandOption: true,
              describe: 'input to convert',
              type: 'string',
            })
            .option('from', {
              demandOption: true,
              describe: 'source unit',
              type: 'string',
            })
            .option('to', {
              demandOption: true,
              describe: 'destination unit',
              type: 'string',
            })
        },
        async argv => {
          const converted = await kizunanocoin.convert(argv.input, {
            from: argv.from as kizunanocoin.Unit,
            to: argv.to as kizunanocoin.Unit,
          })
          console.log(converted)
        }
      )
    )
  })
  .command('compute', 'compute a [work]', yargs => {
    return wrapSubcommand(
      yargs.usage('usage: $0 compute <item>').command(
        'work',
        'compute a work',
        yargs => {
          return yargs
            .usage('usage: $0 compute work [options]')
            .option('hash', {
              demandOption: true,
              describe: 'block hash to compute a work for',
              type: 'string',
            })
        },
        async argv => {
          const work = await kizunanocoin.computeWork(argv.hash)
          console.log(work)
        }
      )
    )
  })
  .command('sign', 'sign a [block]', yargs => {
    return wrapSubcommand(
      yargs.usage('usage: $0 sign <item>').command(
        'block',
        'sign a block',
        yargs => {
          return yargs
            .usage('usage: $0 sign block [options]')
            .option('secret', {
              demandOption: true,
              describe: 'secret key to sign the block with',
              type: 'string',
            })
            .option('hash', {
              demandOption: true,
              describe: 'hash of the block to sign',
              type: 'string',
            })
        },
        async argv => {
          const signature = await kizunanocoin.signBlock({
            hash: argv.hash,
            secretKey: argv.secret,
          })
          console.log(signature)
        }
      )
    )
  })
  .command('verify', 'verify a [block]', yargs => {
    return wrapSubcommand(
      yargs.usage('usage: $0 verify <item>').command(
        'block',
        'verify a block',
        yargs => {
          return yargs
            .usage('usage: $0 verify block [options]')
            .option('public', {
              demandOption: true,
              describe: 'public key to verify the signature against',
              type: 'string',
            })
            .option('hash', {
              demandOption: true,
              describe: 'hash of the block to verify',
              type: 'string',
            })
            .option('signature', {
              demandOption: true,
              describe: 'signature to verify',
              type: 'string',
            })
        },
        async argv => {
          const valid = await kizunanocoin.verifyBlock({
            hash: argv.hash,
            publicKey: argv.public,
            signature: argv.signature,
          })
          console.log(valid)
        }
      )
    )
  })
  .command('validate', 'validate a [work]', yargs => {
    return wrapSubcommand(
      yargs.usage('usage: $0 validate <item>').command(
        'work',
        'validate a work',
        yargs => {
          return yargs
            .usage('usage: $0 validate work [options]')
            .option('hash', {
              demandOption: true,
              describe: 'hash to validate the work against',
              type: 'string',
            })
            .option('work', {
              demandOption: true,
              describe: 'work to validate',
              type: 'string',
            })
        },
        async argv => {
          const valid = await kizunanocoin.validateWork({
            blockHash: argv.hash,
            work: argv.work,
          })
          console.log(valid)
        }
      )
    )
  })
  .command('generate', 'generate a [seed]', yargs => {
    return wrapSubcommand(
      yargs
        .usage('usage: $0 generate <item>')
        .command('seed', 'generate a seed', {}, async () => {
          const seed = await kizunanocoin.generateSeed()
          console.log(seed)
        })
    )
  })
  .command('derive', 'derive a [secret|public|address]', yargs => {
    return wrapSubcommand(
      yargs
        .usage('usage: $0 derive <item>')
        .command(
          'secret',
          'derive a secret key from a seed and an index',
          yargs => {
            return yargs
              .usage('usage: $0 derive secret [options]')
              .option('from', {
                demandOption: true,
                describe: 'seed to derive from',
                type: 'string',
              })
              .option('index', {
                demandOption: true,
                default: 0,
                describe: 'index to derive',
                type: 'number',
              })
          },
          argv => {
            const secretKey = kizunanocoin.deriveSecretKey(
              argv.from,
              argv.index
            )
            console.log(secretKey)
          }
        )
        .command(
          'public',
          'derive a public key from a secret key or an address',
          yargs => {
            return yargs
              .usage('usage: $0 derive public [options]')
              .option('from', {
                demandOption: true,
                describe: 'secret key or address to derive from',
                type: 'string',
              })
          },
          argv => {
            const publicKey = kizunanocoin.derivePublicKey(argv.from)
            console.log(publicKey)
          }
        )
        .command(
          'address',
          'derive an address from a public key',
          yargs => {
            return yargs
              .usage('usage: $0 derive address [options]')
              .option('from', {
                demandOption: true,
                describe: 'public key to derive from',
                type: 'string',
              })
          },
          argv => {
            const address = kizunanocoin.deriveAddress(argv.from)
            console.log(address)
          }
        )
    )
  })
  .command('create', 'create a [block]', yargs => {
    return wrapSubcommand(
      yargs.usage('usage: $0 create <item>').command(
        'block',
        'create a block',
        yargs => {
          return yargs
            .usage('usage: $0 create block [options]')
            .option('secret', {
              demandOption: true,
              describe: 'secret key to sign the block with',
              type: 'string',
            })
            .option('balance', {
              demandOption: true,
              describe: 'resulting balance',
              type: 'string',
            })
            .option('link', {
              demandOption: true,
              describe:
                'link block hash or link address, in hexadecimal or address format',
              type: 'string',
            })
            .option('previous', {
              demandOption: true,
              describe:
                'hash of the previous block on the account chain, in hexadecimal format',
              type: 'string',
            })
            .option('representative', {
              demandOption: true,
              describe: 'representative address',
              type: 'string',
            })
            .option('work', {
              demandOption: true,
              describe: 'work to use',
              type: 'string',
            })
        },
        async argv => {
          const block = kizunanocoin.createBlock(argv.secret, {
            balance: argv.balance,
            link: argv.link,
            previous: argv.previous,
            representative: argv.representative,
            work: argv.work,
          })
          console.log(JSON.stringify(block))
        }
      )
    )
  })
  .demandCommand(1, 'Please specify a command')
  .strict()
  .help()
  .epilogue(
    'for more information, find the sources at http://git.io/kizunanocoin-js'
  )
  .wrap(null).argv
