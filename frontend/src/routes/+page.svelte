<script lang="ts">
  import { onMount } from 'svelte';
  import EditModal from '$lib/EditModal.svelte';

  let posts = [];
  let filteredPosts = [];
  let filter = 'all';
  let showModal = false;
  let selectedPost = null;

  onMount(async () => {
    const response = await fetch('/api/queue');
    posts = await response.json();
    filteredPosts = posts;
  });

  function filterPosts(status) {
    filter = status;
    if (status === 'all') {
      filteredPosts = posts;
    } else {
      filteredPosts = posts.filter(p => p.status === status);
    }
  }

  async function deletePost(postId) {
    await fetch(`/api/queue/${postId}`, { method: 'DELETE' });
    posts = posts.filter(p => p.id !== postId);
    filterPosts(filter);
  }

  function openEditModal(post) {
    selectedPost = post;
    showModal = true;
  }
</script>

<h1>Post Queue</h1>

<div>
  <button on:click={() => filterPosts('all')}>All</button>
  <button on:click={() => filterPosts('draft')}>Draft</button>
  <button on:click={() => filterPosts('scheduled')}>Scheduled</button>
  <button on:click={() => filterPosts('posted')}>Posted</button>
</div>

<table>
  <thead>
    <tr>
      <th>Topic</th>
      <th>Caption</th>
      <th>Status</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {#each filteredPosts as post}
      <tr>
        <td>{post.topic}</td>
        <td>{post.caption}</td>
        <td>{post.status}</td>
        <td>
          <button on:click={() => openEditModal(post)}>Preview/Edit</button>
          <button on:click={() => deletePost(post.id)}>Delete</button>
        </td>
      </tr>
    {/each}
  </tbody>
</table>

{#if showModal}
  <EditModal bind:showModal bind:post={selectedPost} on:postupdated={(e) => {
    posts = posts.map(p => p.id === e.detail.id ? e.detail : p);
    filterPosts(filter);
  }} />
{/if}

<style>
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
</style>
