<script>
  import "../app.css";
  import LoginRegister from "../lib/components/LoginRegister.svelte";
  import { page } from "$app/stores";
  export let data;
</script>

{#if $page.data.user}
  <slot />
{:else}
  <div class="w-screen h-screen flex justify-center align-middle items-center">
    <LoginRegister />
  </div>
{/if}
