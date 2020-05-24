import { serve } from "https://deno.land/std/http/server.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";

import {compose,curry,map} from '../gka-composite/src/core.js'
import {replace,concat} from '../gka-composite/src/string.js'
import {reduce,joinList} from '../gka-composite/src/array.js'
import {trace} from '../gka-composite/src/debug.js'
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
  const parts = split('&',querystring || '')
  if( parts.length ===1 && parts[0] ===""){
    return {}
  }
  return mergeAll(parts.map(getQS))
}

const ipxe_header = _=>`#!ipxe\n`

const ipxe_menu = name => `menu ${name}`;
const ipxe_menuitem = key=> label => `item ${key} ${label}`;


const ipxe_choose =  str=> `choose ${str}`;
const ipxe_default_choose = key => ` --default ${key} `;
const ipxe_choose_target = varname => `${varname} && goto ${varname}`;

const ipxe_menu_default_choose = default_key =>   compose(ipxe_choose,concat(ipxe_default_choose(default_key)),ipxe_choose_target)

const ipxe_section = section => str => `${section}:\n${str}`

const menu = _=> joinList('\n',[
  ipxe_header(),
  ipxe_menu('Test'),
  ipxe_menuitem('key')('Label'),
  ipxe_menuitem('test')('Test'),
  ipxe_menu_default_choose('test')('target')
])

for await (const req of s) {
  console.log(req.url)
  const params = querystring(req.url)
  console.log(req.body)
  console.log(params)
  console.log(menu())
  req.respond({
    body: menu()
  })
}
