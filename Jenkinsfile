// This Jenkins supports 2 different ways to deploy at the first moment

// PLEASE USE ONE OF THESE 2 AND REMOVE THE UNUSED OPTION TO AVOID COMPLEXITY IN YOUR PIPELINE

// - Accessing `Building with Parameters` and adding the jenkins tag value into `DEPLOY_BUILD_NUMBER` input

// - Publishing the package via `np` package, as described on `README.md`

// Set Pipeline Input Parameters
properties([
  parameters([
    string(defaultValue: 'NOTSET', name: 'DEPLOY_BUILD_NUMBER', description: 'Build tag to be deployed to Production')
  ])
])

def setupNewRemote(username, password) {
  sh(returnStdout: true, script: "git config user.email jenkins@jenkins.com.au" )
  sh(returnStdout: true, script: "git config user.name jenkins-ci")
  newGitUrl = "https://${username}:${password}@github.com/domain-group/fe-lambda-domain-cron-indexers-reindex.git"
  sh "git remote add origin-ci-cd ${newGitUrl}"
  return newGitUrl
}

def makeGitTag(tagName, message) {
  sh "git tag -a ${tagName} -m '${message}'"
  sh "git push origin-ci-cd ${tagName}"
}

def buildDeploymentDescription(version, environment) {
  def localIdentifier = new Date().format('dd-MM-yyyy HH:mm:ss')
  return "${version} pushed to ${environment} at ${localIdentifier}"
}

def isSemverTagged() {
	def message = sh(returnStdout: true, script: "git show -s --format=%s HEAD").trim()
	def messagePattern = ~/\d+.\d+.\d+$/
	def messagePatternWithPrefix = ~/v\d+.\d+.\d+$/

  def matcher = ( message =~ messagePattern )
	def matcherWithPrefix = ( message =~ messagePatternWithPrefix )

  return matcher.matches() || matcherWithPrefix.matches()
}

node('linux') {
  checkout scm

  // variables
  version = repo.buildnumber
  NODEJS_DOCKER_IMAGE = 'node:8.11.3-alpine'
  IS_DEPLOY_BRANCH = env.BRANCH_NAME in ['master'] // will deployed to staging
  // Hotfix deployment based on branch name
  IS_A_HOTFIX_BRANCH = env.BRANCH_NAME.startsWith("hotfix/") || env.BRANCH_NAME.startsWith("hotfix-")
  DO_PRODUCTION_DEPLOYMENT = params.DEPLOY_BUILD_NUMBER != "NOTSET"
  IS_A_PRODUCTION_DEPLOYMENT = DO_PRODUCTION_DEPLOYMENT
  IS_A_STAGING_DEPLOYMENT = IS_DEPLOY_BRANCH && !DO_PRODUCTION_DEPLOYMENT
  PUBLISHED_NEW_NPM_VERSION = IS_DEPLOY_BRANCH && isSemverTagged()

  DEPLOY_BUILD_NUMBER = params.DEPLOY_BUILD_NUMBER
  if (IS_A_HOTFIX_BRANCH || PUBLISHED_NEW_NPM_VERSION) {
    DEPLOY_BUILD_NUMBER = version
  }

  stage('Prep') {
    withCredentials([usernamePassword(credentialsId: 'github', usernameVariable: 'GITHUB_USER', passwordVariable: 'GITHUB_PASSWORD')]){

      echo "***** FLAGS *****\nCurrent Branch:${env.BRANCH_NAME}\nIS_DEPLOY_BRANCH: ${IS_DEPLOY_BRANCH}\nIS_A_HOTFIX_BRANCH: ${IS_A_HOTFIX_BRANCH}\nGITHUB_USER: ${env.GITHUB_USER}\nGITHUB_PASSWORD: ${env.GITHUB_PASSWORD}\n"

      echo "**** PARAMS *****\nDEPLOY_BUILD_NUMBER: ${DEPLOY_BUILD_NUMBER} \nDO_PRODUCTION_DEPLOY: ${DO_PRODUCTION_DEPLOYMENT}\n"

      newGitUrl = setupNewRemote(env.GITHUB_USER, env.GITHUB_PASSWORD)
      if(DO_PRODUCTION_DEPLOYMENT == true) {
        sh "git fetch --tags ${newGitUrl}"
        sh "git checkout tags/${DEPLOY_BUILD_NUMBER} -b master"
      }
    }
  }

  stage('NPM Install') {
    docker.image(NODEJS_DOCKER_IMAGE).inside() {
      sh "npm i --silent"
    }
  }

  if(!DO_PRODUCTION_DEPLOYMENT) {
    stage("Unit Test") {
      docker.image(NODEJS_DOCKER_IMAGE).inside() {
        sh "npm test -- -R min"
      }
    }
  }

  if (IS_A_STAGING_DEPLOYMENT) {
    stage('Deploy:Stage') {
      sh "SLS_DEBUG=* npm run serverless -- deploy --stage staging --verbose"

      currentBuild.description = buildDeploymentDescription(version, "staging")
      echo "Info: ${currentBuild.description}"
      makeGitTag(version, currentBuild.description)
    }
  }

  if (IS_A_PRODUCTION_DEPLOYMENT) {
    stage('Deploy:Production') {
      sh "SLS_DEBUG=* npm run serverless -- deploy --stage production --verbose"
      currentBuild.description = buildDeploymentDescription(DEPLOY_BUILD_NUMBER, "production")
      echo "Info: ${currentBuild.description}"
      makeGitTag(version, currentBuild.description)
    }
  }
}
