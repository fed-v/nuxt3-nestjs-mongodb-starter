import { describe, it, expect } from 'vitest'

let test = "Hello, world!";

describe('HelloWorld', () => {
  it('renders correctly', () => {
    expect(test).toEqual('Hello, world!');
  })
})