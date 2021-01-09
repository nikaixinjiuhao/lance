<template>
  <main >
    <div class="card mt-auto mb-auto ml-auto mr-auto" style="width: 400px;max-width: 100%;">
      <div class="card-body ml-3 mr-3 mb-3">
        <div class="text-align-center mt-3">
          <img src="../assets/image/monitor-logo.png" alt="..." width="120" height="120">
        </div>

        <div class="form-group">
          <label for="exampleInputCompany">Company</label>
          <select class="form-control" name="company" id="exampleInputCompany">
            <option value="004.1">004.1</option>
            <option value="004.1_1">004.1_1</option>
            <option value="005.1">005.1</option>
            <option value="006.1">006.1</option>
          </select>
        </div>

        <div class="form-group">
          <label for="exampleInputUsername">Username</label>
          <input type="text" class="form-control" id="exampleInputUsername">
        </div>

        <div class="form-group">
          <label for="exampleInputPassword">Password</label>
          <input type="password" class="form-control" id="exampleInputPassword">
        </div>

        <button type="submit" class="btn btn-primary btn-block">Submit</button>
      </div>
    </div>
  </main>
</template>

<script>
  export default {
    name: 'Login'
  }
</script>

<style scoped>
  main {
    width: 100%;
    height: 100vh;
    background-color: #1b557c;
  }
</style>
