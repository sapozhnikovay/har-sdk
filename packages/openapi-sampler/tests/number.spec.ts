import { sample } from '../src';
import 'chai/register-should';

describe('NumberSampler', () => {
  [
    {
      input: {
        type: 'number'
      },
      expected: 42
    },
    {
      input: {
        type: 'number',
        minimum: 10
      },
      expected: 10
    },
    {
      input: {
        type: 'number',
        minimum: 10,
        exclusiveMinimum: true
      },
      expected: 10.001
    },
    {
      input: {
        type: 'integer',
        minimum: 10,
        exclusiveMinimum: true
      },
      expected: 11
    },
    {
      input: {
        type: 'integer',
        minimum: 10
      },
      expected: 10
    },
    {
      input: {
        type: 'integer',
        minimum: 9.3
      },
      expected: 10
    },
    {
      input: {
        type: 'number',
        maximum: 10
      },
      expected: 10
    },
    {
      input: {
        type: 'integer',
        maximum: 10
      },
      expected: 10
    },
    {
      input: {
        type: 'number',
        maximum: 10,
        exclusiveMaximum: true
      },
      expected: 9.999
    },
    {
      input: {
        type: 'integer',
        maximum: 10.3
      },
      expected: 10
    },
    {
      input: {
        type: 'integer',
        maximum: 10,
        exclusiveMaximum: true
      },
      expected: 9
    },
    {
      input: {
        type: 'integer',
        minimum: 5,
        maximum: 10,
        exclusiveMinimum: false,
        exclusiveMaximum: true
      },
      expected: 5
    },
    {
      input: {
        type: 'integer',
        minimum: 0
      },
      expected: 0
    },
    {
      input: {
        type: 'number',
        minimum: 0,
        exclusiveMinimum: true
      },
      expected: 0.001
    },
    {
      input: {
        type: 'integer',
        maximum: 0,
        exclusiveMaximum: true
      },
      expected: -1
    },
    {
      input: {
        type: 'integer',
        multipleOf: 10
      },
      expected: 10
    },
    {
      input: {
        type: 'integer',
        minimum: 10,
        multipleOf: 0
      },
      expected: 10
    },
    {
      input: {
        type: 'integer',
        minimum: 10,
        exclusiveMinimum: true,
        multipleOf: 10
      },
      expected: 20
    },
    {
      input: {
        type: 'integer',
        minimum: 25,
        multipleOf: 10
      },
      expected: 30
    },
    {
      input: {
        type: 'number',
        multipleOf: 13.3
      },
      expected: 13.3
    },
    {
      input: {
        type: 'number',
        minimum: 135,
        multipleOf: 13.3
      },
      expected: 146.3
    },
    {
      input: {
        type: 'number',
        minimum: 133,
        exclusiveMinimum: true,
        multipleOf: 13.3
      },
      expected: 146.3
    },
    {
      input: {
        type: 'number',
        minimum: -20,
        multipleOf: 13.3
      },
      expected: -13.3
    },
    {
      input: {
        type: 'number',
        maximum: 20,
        multipleOf: 3.5
      },
      expected: 17.5
    },
    {
      input: {
        type: 'number',
        minimum: -10,
        multipleOf: 3.5
      },
      expected: -7
    },
    {
      input: {
        type: 'number',
        minimum: 10,
        maximum: 15,
        multipleOf: 3.5
      },
      expected: 10.5
    }
  ].forEach(({ input, expected }) => {
    const { type, ...restrictions } = input;
    const suffixStr = Object.keys(restrictions).length
      ? ` for restrictions ${JSON.stringify(restrictions)}`
      : ' for empty restrictions';
    it(`should sample ${type} ${expected} ${suffixStr}`, () => {
      const result = sample(input);

      result.should.eq(expected);
    });
  });

  [
    {
      input: {
        type: 'number',
        minimum: 5,
        maximum: 3
      },
      expected: 'Cannot sample numeric by boundaries: 5 <= x <= 3'
    },
    {
      input: {
        type: 'number',
        minimum: 42,
        exclusiveMinimum: true,
        maximum: 42
      },
      expected: 'Cannot sample numeric by boundaries: 42 < x <= 42'
    },
    {
      input: {
        type: 'integer',
        minimum: 42,
        exclusiveMinimum: true,
        maximum: 43,
        exclusiveMaximum: true
      },
      expected: 'Cannot sample numeric by boundaries: 42 < x < 43'
    },
    {
      input: {
        type: 'number',
        minimum: 5,
        exclusiveMinimum: true,
        maximum: 13,
        multipleOf: 15
      },
      expected:
        'Cannot sample numeric by boundaries: 5 < x <= 13, multipleOf: 15'
    }
  ].forEach(({ input, expected }) => {
    it(`should raise an exception invalid restrictions ${JSON.stringify(
      input
    )}`, () => {
      const result = () => sample(input);

      result.should.throw(expected);
    });
  });
});
