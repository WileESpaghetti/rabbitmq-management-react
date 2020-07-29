import CookieWrapper from '../cookie-wrapper';

describe('CookieWrapper', () => {
    describe('should compress keys', () => {
        let cookieWrapper = new CookieWrapper();
        test.each`
            input                      | expectedResult
            ${''}                      | ${'0'}
            ${'auth'}                  | ${'2258'}
            ${'login_session_timeout'} | ${'2c1e'}
        `('converts $input to $expectedResult', ({input, expectedResult}) => {
            expect(cookieWrapper.getShortKey(input)).toBe(expectedResult)
        });
    });

    describe('get cookie value', () => {
        it('should retrieve a stored value', () => {
            let rawCookieData = "2258:Z3Vlc3Q6Z3Vlc3Q%253D|2c1e:30"
            let cookieWrapper = new CookieWrapper();
            cookieWrapper.cookies.set('m', rawCookieData);
            expect(cookieWrapper.get('auth')).toEqual('Z3Vlc3Q6Z3Vlc3Q%3D');
            expect(cookieWrapper.get('login_session_timeout')).toBe('30');
        });

        it('should return null as a default value if a key is not found', () => {
            let rawCookieData = "2258:Z3Vlc3Q6Z3Vlc3Q%253D|2c1e:30"
            let cookieWrapper = new CookieWrapper();
            cookieWrapper.cookies.set('m', rawCookieData);
            expect(cookieWrapper.get('notThere')).toBeNull();
        });

        it('should return null if cookie has not been set or is expired', () => {
            let cookieWrapper = new CookieWrapper();
            expect(cookieWrapper.get('example')).toBeNull();
        });
    });

    it('should parse the custom cookie format', () => {
        let cookieWrapper = new CookieWrapper();
        let rawCookieData = "2258:Z3Vlc3Q6Z3Vlc3Q%253D|2c1e:30"
        let expectedParseResults = {
            "2258": "Z3Vlc3Q6Z3Vlc3Q%3D",
            "2c1e": "30"
        };

        expect(cookieWrapper.parse(rawCookieData)).toMatchObject(expectedParseResults);
    });

    it('should be encoded correctly', () => {
        let expected = '2258:Z3Vlc3Q6Z3Vlc3Q%253D|2c1e:30';
        let cookieWrapper = new CookieWrapper();
        let cookieValue = cookieWrapper.cookies.get('m', {doNotParse: true});

        cookieWrapper.set('auth', 'Z3Vlc3Q6Z3Vlc3Q%3D');
        cookieWrapper.set('login_session_timeout', '30');

        expect(cookieValue).toBe(expected);
    });
});