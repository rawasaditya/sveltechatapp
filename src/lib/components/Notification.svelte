<script>
  export let notify;
</script>

<div class="alert mb-1  rounded-none border-x-4 border-[#271c46]">
  <div>
    <span
      >{notify.message} from {notify.fromFirstName} {notify.fromLastName}</span
    >
  </div>
  <div class="flex-none">
    <button class="btn btn-sm btn-ghost">Deny</button>
    <button class="btn btn-sm btn-primary">Accept</button>
  </div>
</div>
