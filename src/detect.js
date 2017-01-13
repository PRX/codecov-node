const services = {
  'travis': require('./services/travis'),
  'circle': require('./services/circle'),
  'buildkite': require('./services/buildkite'),
  'codeship': require('./services/codeship'),
  'drone': require('./services/drone'),
  'appveyor': require('./services/appveyor'),
  'wercker': require('./services/wercker'),
  'jenkins': require('./services/jenkins'),
  'semaphore': require('./services/semaphore'),
  'snap': require('./services/snap'),
  'gitlab': require('./services/gitlab'),
}

const detectProvider = () => {
  const local = require('./services/localGit')
  const config = Object.keys(services).reduce((c, key) => {
    if (services[key].detect()) return services[key].configuration()
    return c
  }) || local.configuration()

  if (!config) {
    throw new Error('Unknown CI servie provider. Unable to upload coverage.')
  }
  return config
}

export default detectProvider
