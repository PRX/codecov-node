import rp from 'request-promise'
import urltemplate from 'url-template'

export const buildURI = opts => urltemplate
  .parse('{+url}/upload/v{version}{?service,build,build_url,job,commit,branch,root,pr,slug,yaml,token,package}')
  .expand({
    ...opts,
    url: opts.url || 'https://codecov.io',
    package: opts.package || `jsapi`,
    version: opts.version || 3,
  })

export const sendToV2 = (opts = {}) => {
  const uri = buildURI({ ...opts, version: 2 })
  return rp({
    method: 'POST',
    uri,
    body: opts.data,
    headers: {
      'Content-Type': 'text/plain',
      'Accept': 'text/plain',
    },
  })
  .then(res => {
    const reportUrl = res.body
    return { reportUrl }
  })
}

export const sendToV3 = (opts) => {
  const uri = buildURI(opts)
  const options = {
    uri,
    headers: {
      'Content-Type': 'text/plain',
      'Accept': 'text/plain',
    },
  }

  return rp(options)
    .then(res => {
      const reportUrl = res.body.split('\n')[0]
      return rp({
        method: 'PUT',
        uri: res.body.split('\n')[1],
        body: opts.data,
        headers: {
          'Content-Type': 'plain/text',
          'x-amz-acl': 'public-read',
        },
      })
      .then(res => ({ reportUrl }))
    })
    .catch(() => sendToV2(opts))
}

const send = ({ version = 3, ...opts } = {}) => version === 3 ? sendToV3(opts) : sendToV2(opts)

export default send
