<script>
  import { page } from "$app/stores";
  import Icon from "@iconify/svelte";
</script>

<div class="card w-full bg-base-100  rounded-none bg-transparent">
  <div class="card-body py-3">
    <div class="flex items-center justify-between">
      <div class="flex  gap-3 items-center">
        <div class="avatar">
          <div class="w-12 rounded-full">
            <img src={$page.data.user.picture} />
          </div>
        </div>
      </div>
      <div class="flex gap-2">
        <Icon
          icon="ri:notification-4-line"
          class="text-white text-2xl cursor-pointer hover:text-slate-300"
        />
      </div>
    </div>
  </div>
</div>
