<script>
  import LeftContainer from "$components/LeftContainer.svelte";
  import RightContainer from "$components/RightContainer.svelte";
</script>

<div class="card bg-base-100 shadow-lg rounded-none h-full w-full">
  <div class="w-full grid grid-cols-12 h-full">
    <div class="col-span-3">
      <LeftContainer />
    </div>
    <div class="col-span-9">
      <RightContainer />
    </div>
  </div>
</div>
