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
    const configureBower = core.getInput('configure-bower')
    const repositoryBower = core.getInput('repository-bower')
    const configureGradle = core.getInput('configure-gradle')
    /**
     * The repository Gradle value obtained from the input.
     * @type {string}
     */
    /**
     * The repository Gradle value obtained from the input.
     * @type {string}
     */
    const repositoryGradle = core.getInput('repository-gradle')
    /**
     * The username for accessing Artifactory.
     * @type {string}
     */
    const artifactoryUser = core.getInput('artifactory-user')
    /**
     * The password for accessing Artifactory.
     * @type {string}
     */
    const artifactoryPass = core.getInput('artifactory-password')

    let TOKEN = ''

    // Create a variable to store the output
    let myOutput = ''
    let myError = ''

    // Capture the output of the command
    const options: exec.ExecOptions = {}
    options.listeners = {
      stdout: (data: Buffer) => {
        myOutput += data.toString()
      },
      stderr: (data: Buffer) => {
        myError += data.toString()
      }
    }

    if (configureNpm) {
      core.info('Set up Artifactory registry')
      await exec.exec(
        `npm config set registry https://artifactory.globaldevtools.bbva.com:443/artifactory/api/npm/${repositoryNpm};`
      )
      //exec.exec("cat ~/.npmrc");

      core.info('Generate token for Artifactory')
      /*shell.exec(`TOKEN=$(curl -s -u${{artifactoryUser}}:${{artifactoryPass}} https://artifactory.globaldevtools.bbva.com:443/artifactory/api/npm/auth --insecure | grep _auth)`);
      shell.exec("cat ~/.npmrc");*/
      // Run the shell command
      await exec.exec(
        `curl -s -u${artifactoryUser}:${artifactoryPass} https://artifactory.globaldevtools.bbva.com:443/artifactory/api/npm/auth --insecure`,
        undefined,
        options
      )

      // Print the captured output
      core.info(`Output: ${myOutput}`)
      core.info(`Error: ${myError}`)

      TOKEN = extractAuthString(myOutput) as string

      /*
        exec.exec(`curl -s -u${{ artifactoryUser }}:${{ artifactoryPass }} https://artifactory.globaldevtools.bbva.com:443/artifactory/api/npm/auth --insecure | grep _auth`, (error, stdout, stderr) => {
          core.info("STDOUT:", stdout, ", STDERR:", stderr);
          TOKEN = stdout;
        });
        */

      core.info('Store token for Artifactory')
      await exec.exec(
        `echo //artifactory.globaldevtools.bbva.com/artifactory/api/npm/:${TOKEN} >> ~/.npmrc`
      )
      await exec.exec('cat ~/.npmrc')
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

export function extractAuthString(input: string) {
  const regex = /_auth\s*=\s*(.*)/
  const match = input.match(regex)
  return match ? match[1].split('\n')[0] : null
}


