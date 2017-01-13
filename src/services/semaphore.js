export default {
  detect () {
    return !!process.env.SEMAPHORE
  },

  configuration () {
    console.log('    Semaphore CI Detected')
    return {
      service: 'semaphore',
      build: process.env.SEMAPHORE_BUILD_NUMBER + '.' + process.env.SEMAPHORE_CURRENT_THREAD,
      commit: process.env.REVISION,
      branch: process.env.BRANCH_NAME,
      slug: process.env.SEMAPHORE_REPO_SLUG,
    }
  },
}
