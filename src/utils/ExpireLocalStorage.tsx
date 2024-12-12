/**
 * https://bnpt.tistory.com/entry/%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-localStorage-Expiry%EB%A7%8C%EB%A3%8C%EC%8B%9C%EA%B0%84-%EC%84%A4%EC%A0%95
 */

export function setWithExpiry(key: string, value: string, ttl: number) {
    const now = new Date();
    const item = {
        value: value,
        expiry: now.getTime() + ttl
    };
    localStorage.setItem(key, JSON.stringify(item));
}

function getWithExpiry(key: string) {
    const itemStr = localStorage.getItem(key)
    if (!itemStr) return null;
    const item = JSON.parse(itemStr);
    const now = new Date();

    if (now.getTime() > item.expiry) {
        localStorage.removeItem(key);
        return null;
    }
    return item.value;
}

export function getStringWithExpiry(key: string) {
    return getWithExpiry(key);
}

export function getBooleanWithExpiry(key: string, defaultValue: boolean) {
    if (getWithExpiry(key) === null) {
        return defaultValue;
    }
    return getWithExpiry(key) === 'true';
}

export function getIntWithExpiry(key: string, defaultValue: number) {
    if (getWithExpiry(key) === null) {
        return defaultValue;
    }
    return Number(getWithExpiry(key));
}
