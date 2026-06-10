const OWNER = 'yuchen1994wang';
const REPO = 'family-recipe';
const FILE_PATH = 'data/recipes.json';

function getToken(): string | null {
  return localStorage.getItem('github_token');
}

async function getFileSha(): Promise<string | null> {
  const token = getToken();
  if (!token) throw new Error('GitHub Token 未设置');
  const res = await fetch(
    'https://api.github.com/repos/' + OWNER + '/' + REPO + '/contents/' + FILE_PATH,
    {
      headers: {
        Authorization: 'token ' + token,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('GitHub API error: ' + res.status);
  const data = await res.json();
  return data.sha;
}

export async function pullFromGithub(): Promise<string | null> {
  const token = getToken();
  if (!token) throw new Error('GitHub Token 未设置');
  const res = await fetch(
    'https://api.github.com/repos/' + OWNER + '/' + REPO + '/contents/' + FILE_PATH,
    {
      headers: {
        Authorization: 'token ' + token,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('GitHub API error: ' + res.status);
  const data = await res.json();
  return atob(data.content.replace(/\n/g, ''));
}

export async function pushToGithub(content: string): Promise<boolean> {
  const token = getToken();
  if (!token) throw new Error('GitHub Token 未设置');
  const sha = await getFileSha();
  const body: Record<string, string> = {
    message: 'Update recipes data',
    content: btoa(unescape(encodeURIComponent(content))),
  };
  if (sha) body.sha = sha;

  const res = await fetch(
    'https://api.github.com/repos/' + OWNER + '/' + REPO + '/contents/' + FILE_PATH,
    {
      method: 'PUT',
      headers: {
        Authorization: 'token ' + token,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );
  return res.ok;
}

export function mergeRecipes(localRecipes: any[], remoteRecipes: any[]): any[] {
  const map = new Map<string, any>();
  localRecipes.forEach((r) => map.set(r.id, r));
  remoteRecipes.forEach((remote) => {
    const local = map.get(remote.id);
    if (!local) {
      map.set(remote.id, remote);
    } else {
      const localTime = new Date(local.updatedAt).getTime();
      const remoteTime = new Date(remote.updatedAt).getTime();
      if (remoteTime > localTime) {
        map.set(remote.id, remote);
      }
    }
  });
  return Array.from(map.values()).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}
