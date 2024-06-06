import * as main from '../src/main'

jest.mock('@actions/core')
jest.mock('@actions/exec')

describe('run', () => {
  it('should execute without error', async () => {
    await expect(main.run()).resolves.not.toThrow()
  })

  // Add more tests as needed to cover the various functionalities of your action.
  // For example, if your action reads inputs with core.getInput, you might add a test like this:
  // it('should read the expected inputs', async () => {
  //   process.env['INPUT_MY_INPUT'] = 'my value';
  //   await main.run();
  //   expect(core.getInput).toHaveBeenCalledWith('my_input');
  // });
})

describe('extractAuthString', () => {
  it('should return the correct auth string when the input is valid', () => {
    const input = '_auth = myAuthString\n'
    const result = main.extractAuthString(input)
    expect(result).toBe('myAuthString')
  })

  it('should return null when the input does not contain an auth string', () => {
    const input = 'noAuthStringHere\n'
    const result = main.extractAuthString(input)
    expect(result).toBeNull()
  })

  it('should return the auth string when there are extra spaces around the equals sign', () => {
    const input = '_auth   =   myAuthString\n'
    const result = main.extractAuthString(input)
    expect(result).toBe('myAuthString')
  })

  it('should return the auth string when there are multiple lines in the input', () => {
    const input = '_auth = myAuthString\nAnotherLine\n'
    const result = main.extractAuthString(input)
    expect(result).toBe('myAuthString')
  })

  it('should return null when the input is an empty string', () => {
    const input = ''
    const result = main.extractAuthString(input)
    expect(result).toBeNull()
  })
})
