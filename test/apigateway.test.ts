import { buildResponse, safeParseJson } from 'lib/apigateway';

describe('Api Gateway', () => {
  describe('buildResponse', () => {
    it('body is json stringified if provided', () => {
      expect(buildResponse(200, { test: 'hello' }).body).toBe('{"data":{"test":"hello"}}');
    });

    it('Body is empty if no body input is provided', () => {
      expect(buildResponse(201).body).toBe('');
    });
  });

  describe('safeParseJson', () => {
    it('a unsuccessful result is returned if json input is invalid', () => {
      expect(safeParseJson('invalid').success).toBe(false);
    });

    it('a successful result is returned if json input is valid', () => {
      expect(safeParseJson(JSON.stringify({ test: 'hello' })).success).toBe(true);
    });
  });
});
