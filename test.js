import { serve } from "https://deno.land/std/http/server.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";

import {compose,curry,map} from '../gka-composite/src/core.js'
import {replace} from '../gka-composite/src/string.js'
import {reduce} from '../gka-composite/src/array.js'
import {assign2} from '../gka-composite/src/object.js'
//await init();

export const split = curry((sep,str)=> str.split(sep))

const s = serve({ port: 8880, hostname:"192.168.64.176" });


export const mergeAll = list => reduce({},assign2,list)

const urlParts = split('?')

const value = split('=')
const customDecode = replace(/%3A/gm,':')

const decodeValue = compose(customDecode,decodeURI)

const toObject =  curry((item)=>({[item[0]]:decodeValue(item[1])}) )

const getQS = compose(toObject,value)

const querystring = url => {
  const [baseUrl,querystring] =urlParts(url)
  const parts = split('&',querystring)
  return mergeAll(parts.map(getQS))
}

for await (const req of s) {
  const params = querystring(req.url)
  console.log(params)
  req.respond({ body: "#!ipxe\nmenu Test\nitem test Test\n choose --default test target && goto target" });
}
