/**
 * Fetch YM songs from the Battle of the Bits API
 * https://battleofthebits.com/
 */
import * as fs from 'fs'
import { Buffer } from 'buffer'

if (!process.argv[2]) {
  throw new Error('The path to save the files in must be provided')
}

var dir = process.argv[2]
fs.mkdirSync(dir, { recursive: true })

const apiBaseUrl = 'https://battleofthebits.com'
const body = new URLSearchParams({
  'conditions[0][key]': 'formats',
  'conditions[0][property]': 'format_token',
  'conditions[0][operator]': 'IN',
  'conditions[0][operand][]': 'aym',
  sort: 'score',
  desc: 'true'
})

var page = 0
var count = 0

// Fetch songs by page and loop until no more results are returned

do {
  const response = await fetch(`${apiBaseUrl}/api/v1/entry/list/${page++}/250`, {
    method: 'post',
    body: body
  })

  if (!response.ok) {
    throw new Error(`Non OK reponse from Battle of the Bits API: ${response.status}`)
  }

  const json = await response.json()
  count = json.length

  // Retain only songs of .ym extension
  const urls = json
    .filter((item) => /\.ym$/i.test(item.donload_url))
    .map((item) => item.donload_url)
  console.debug(`Processed page ${page}, ${count} results, ${urls.length} YM files`)

  for (const url of urls) {
    const filename = decodeURI(url.split('/').pop()).replace(/\+/g, ' ')
    const path = `${dir}/${filename}`

    const downloaded = await fetch(`${apiBaseUrl}${url}`)
    if (!downloaded.ok) {
      throw new Error(`Error downloading ${url}: ${downloaded.status}`)
    }

    const data = await downloaded.arrayBuffer()
    fs.writeFileSync(`${path}`, Buffer.from(new Uint8Array(data)))

    console.log(`Downloaded ${url} into ${dir}/${filename}`)
  }
} while (count > 0)
