// http://devcenter.wercker.com/articles/steps/variables.html

export default {
  detect () {
    return !!process.env.WERCKER_MAIN_PIPELINE_STARTED
  },

  configuration () {
    console.log('    Wercker CI Detected')
    return {
      service: 'wercker',
      build: process.env.WERCKER_MAIN_PIPELINE_STARTED,
      commit: process.env.WERCKER_GIT_COMMIT,
      build_url: process.env.WERCKER_BUILD_URL,
      branch: process.env.WERCKER_GIT_BRANCH,
      slug: process.env.WERCKER_GIT_OWNER + '/' + process.env.WERCKER_GIT_REPOSITORY,
    }
  },
}
