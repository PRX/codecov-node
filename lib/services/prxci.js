module.exports = {

  detect : function(){
    return !!process.env.PRX_REPO;
  },

  configuration : function(){
    console.log('    PRXCI Detected');
    return {
      service : 'prxci',
      build : process.env.CODEBUILD_BUILD_ID,
      commit : process.env.PRX_COMMIT,
      branch : process.env.PRX_BRANCH,
      pr: process.env.PRX_GITHUB_PR,
    };
  }

};
