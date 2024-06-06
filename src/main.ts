import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as fs from 'fs'

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
      await exec.exec('npm config list')

      core.info('Generate token for Artifactory')
      await exec.exec(
        `curl -s -u${artifactoryUser}:${artifactoryPass} https://artifactory.globaldevtools.bbva.com:443/artifactory/api/npm/auth --insecure  | grep _auth`,
        undefined,
        options
      )
      core.info('myOutput :: ' + myOutput)
      TOKEN = removeEmptyAttributes(extractAuthString(myOutput) as string)

      core.info(`Store token for Artifactory :: ${TOKEN}`)
      fs.appendFile(
        '/github/home/.npmrc',
        `//artifactory.globaldevtools.bbva.com:443/artifactory/api/npm/gl-bbva-npm-virtual/:\\${TOKEN}`,
        err => {
          if (err) {
            core.error(`Error appending config data to file: ${err.message}`)
          } else {
            core.info('Config data successfully appended to config file.')
          }
        }
      )
      fs.appendFile(
        '/github/home/.npmrc',
        `//artifactory.globaldevtools.bbva.com/artifactory/api/npm/:_authToken=${TOKEN}`,
        err => {
          if (err) {
            core.error(`Error appending config data to file: ${err.message}`)
          } else {
            core.info('Config data successfully appended to config file.')
          }
        }
      )

      await exec.exec('cat /github/home/.npmrc')
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

export function removeEmptyAttributes(input: string): string {
  return input.replace(/=""\s*/g, '') // Regular expression to match ="", with optional whitespace after it
}
