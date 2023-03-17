<script>
  import Notification from "./Notification.svelte";

  export let notifications = [];
</script>

{#each notifications as notify}
  <Notification {notify} />
{/each}
