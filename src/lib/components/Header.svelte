<script>
  import { page } from "$app/stores";
  import Icon from "@iconify/svelte";
  export let notificationsCount;
  export let showNotification;
  const toggleNotification = () => {
    showNotification = !showNotification;
  };
</script>

<div class="card w-full bg-base-100  rounded-none bg-transparent">
  <div class="card-body py-3">
    <div class="flex items-center justify-between">
      <div class="flex  gap-3 items-center align-middle text-white">
        <div class="avatar">
          <div class="w-12 rounded-full">
            <img src={$page.data.user.picture} />
          </div>
        </div>
        {$page.data.user.firstName}
        {$page.data.user.lastName}
      </div>
      <div class="flex gap-2">
        <span class="indicator" on:click={toggleNotification}>
          <Icon
            icon="ri:notification-4-line"
            class="text-white text-2xl cursor-pointer hover:text-slate-300"
          />
          <span class="indicator-item badge text-xs p-1 px-2 badge-secondary"
            >{notificationsCount}</span
          >
        </span>
      </div>
    </div>
  </div>
</div>
