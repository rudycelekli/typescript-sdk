import { describe, expect, it } from 'vitest';

import { applyBasicAuth } from '../../src/client/auth';

describe('OAuth client_secret_basic credential encoding', () => {
    it.each([
        ['client:id', 'secret:with+percent%', 'client%3Aid:secret%3Awith%2Bpercent%25'],
        ['client name', 'a&b=c', 'client+name:a%26b%3Dc'],
        ['client', '!*()', 'client:%21*%28%29'],
        ['client', '密码', 'client:%E5%AF%86%E7%A0%81']
    ])('form-encodes %s and its secret before Base64 encoding', (clientId, clientSecret, expected) => {
        const headers = new Headers();
        applyBasicAuth(clientId, clientSecret, headers);
        const credentials = atob(headers.get('Authorization')!.slice('Basic '.length));
        expect(credentials).toBe(expected);
    });

    it('preserves plain ASCII credentials', () => {
        const headers = new Headers();
        applyBasicAuth('client123', 'secret123', headers);
        expect(headers.get('Authorization')).toBe(`Basic ${btoa('client123:secret123')}`);
    });
});
