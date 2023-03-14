<script>
  let email = "rawasasditya@gmail.com";
  let password = "Python@123";
  let firstName = "Aditya";
  let lastName = "Rawas";
  let login = true;
  async function logIn() {
    if (email.length && password.length) {
      fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
          "content-type": "application/json",
        },
      })
        .then((res) => {
          if (res.ok) {
            window.location.reload();
          } else {
            throw res;
          }
        })
        .catch(async (err) => {
          alert((await err.json()).message);
        });
    } else {
      alert("Please enter valid data");
    }
  }
  async function register() {
    const emptyVals = [
      email.trim().length,
      password.trim().length,
      firstName.trim().length,
      lastName.trim().length,
    ];

    if (emptyVals.indexOf(0) !== -1) {
      alert("Please enter valid details");
      return;
    }
    fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        firstName,
        lastName,
      }),
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw res;
        } else {
          alert("Registered successfully !");
          login = true;
        }
      })
      .catch(async (err) => {
        alert((await err.json()).message);
      });
  }
  const toggleForm = () => (login = !login);
</script>

{#if login}
  <div class="card card-compact shadow-xl w-96 rounded-none  bg-white">
    <div class="card-body">
      <h2 class="card-title text-center text-black">Login!</h2>
      <div class="flex flex-col gap-2">
        <div class="form-control w-full max-w-xs">
          <label class="label">
            <span class="label-text">Enter id</span>
          </label>
          <input
            bind:value={email}
            type="text"
            class="input border-gray-300 w-full input-sm"
          />
        </div>
        <div class="form-control w-full max-w-xs">
          <label class="label">
            <span class="label-text">Password</span>
          </label>
          <input
            bind:value={password}
            autocomplete="new-password"
            type="password"
            class="input-sm input border-gray-300 w-full"
          />
        </div>
        <span class="text-slate-500"
          >Don't have an account? Create one <span
            class="text-primary cursor-pointer"
            on:click={toggleForm}>here</span
          >
        </span>
        <button
          on:click={logIn}
          class="btn btn-sm bg-[#908ce9] hover:bg-primary border-0"
          >Login</button
        >
      </div>
    </div>
  </div>
{:else}
  <div class="card card-compact shadow-xl w-96 rounded-none  bg-white">
    <div class="card-body">
      <h2 class="card-title text-center text-black">Register!</h2>
      <div class="flex flex-col gap-2">
        <div class="form-control w-full max-w-xs">
          <label class="label">
            <span class="label-text">Enter id</span>
          </label>
          <input
            bind:value={email}
            type="text"
            class="input border-gray-300 w-full input-sm"
          />
        </div>
        <div class="form-control w-full max-w-xs">
          <label class="label">
            <span class="label-text">Password</span>
          </label>
          <input
            bind:value={password}
            autocomplete="new-password"
            type="password"
            class="input-sm input border-gray-300 w-full"
          />
        </div>
        <div class="form-control w-full max-w-xs">
          <label class="label">
            <span class="label-text">First Name</span>
          </label>
          <input
            bind:value={firstName}
            type="text"
            class="input-sm input border-gray-300 w-full"
          />
        </div>
        <div class="form-control w-full max-w-xs">
          <label class="label">
            <span class="label-text">last Name</span>
          </label>
          <input
            bind:value={lastName}
            type="text"
            class="input-sm input border-gray-300 w-full"
          />
        </div>
        <span class="text-slate-500"
          >Already have an account? <span
            class="text-primary cursor-pointer"
            on:click={toggleForm}>here</span
          >
        </span>
        <button
          on:click={register}
          class="btn btn-sm bg-[#908ce9] hover:bg-primary border-0"
          >Register</button
        >
      </div>
    </div>
  </div>
{/if}
