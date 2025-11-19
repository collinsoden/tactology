import fetch from 'cross-fetch';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function login(username: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    throw new Error('Invalid credentials provided.');
  }

  return res.json() as Promise<{ accessToken: string }>;
}

export async function graphqlRequest<T>(
  query: string,
  variables: Record<string, any> = {},
  token?: string | null,
): Promise<T> {
  const res = await fetch(`${API_URL}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();
  if (json.errors && json.errors.length) {
    throw new Error(json.errors[0].message || 'GraphQL error');
  }

  return json.data;
}
