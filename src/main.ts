import * as core from '@actions/core'
import * as exec from '@actions/exec'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const configureNpm = core.getInput('configure-npm')
    const repositoryNpm = core.getInput('repository-npm')
    //const configureBower = core.getInput('configure-bower')
    //const repositoryBower = core.getInput('repository-bower')
    //const configureGradle = core.getInput('configure-gradle')
    //const repositoryGradle = core.getInput('repository-gradle')
    const artifactoryUser = core.getInput('artifactory-user')
    const artifactoryPass = core.getInput('artifactory-password')

    if (configureNpm) {
      await exec.exec('chmod +x ./script/setup.sh')
      await exec.exec('./script/setup.sh', [artifactoryUser, artifactoryPass])
      await exec.exec('npm config list')
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}
