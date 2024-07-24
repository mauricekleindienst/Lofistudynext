import { useState } from 'react';
import { useRouter } from 'next/router';

export default function NewProject() {
  const [name, setName] = useState('');
  const router = useRouter();

  const createProject = async (e) => {
    e.preventDefault();

    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });

    if (response.ok) {
      router.push('/');
    }
  };

  return (
    <div>
      <h1>Create New Project</h1>
      <form onSubmit={createProject}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Project Name"
        />
        <button type="submit">Create</button>
      </form>
    </div>
  );
}
