type CreateRepoInput = { name: string; private: boolean; description?: string };
type DispatchInput = { repoFullName: string; issueTitle: string; issueBody: string };

function ghHeaders() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("Missing GITHUB_TOKEN");
  return {
    accept: "application/vnd.github+json",
    authorization: `Bearer ${token}`,
    "x-github-api-version": "2022-11-28",
    "content-type": "application/json"
  };
}

export async function createRepo(input: CreateRepoInput) {
  const res = await fetch("https://api.github.com/user/repos", {
    method: "POST",
    headers: ghHeaders(),
    body: JSON.stringify({ name: input.name, private: input.private, description: input.description ?? "" })
  });
  if (!res.ok) throw new Error(`GitHub create repo failed: ${res.status}`);
  return await res.json();
}

export async function dispatchTask(input: DispatchInput) {
  const [owner, repo] = input.repoFullName.split("/");
  if (!owner || !repo) throw new Error("repoFullName must be owner/repo");
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
    method: "POST",
    headers: ghHeaders(),
    body: JSON.stringify({ title: input.issueTitle, body: input.issueBody })
  });
  if (!res.ok) throw new Error(`GitHub create issue failed: ${res.status}`);
  return await res.json();
}
