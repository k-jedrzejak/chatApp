<template>
  <div class="app-container">
    <div class="login" v-if="state.username === '' || state.username === null">
      <form class="login-form" @submit.prevent="Login">
          <div class="form-content">
          <div>Login to ChatApp</div>
          <label>Username</label>
          <input 
            type="text" 
            v-model="inputUsername" 
            placeholder="Please enter your username..." />
          <input 
            type="submit" 
            value="Login">
        </div>
      </form>
    </div>

    <div class="chat" v-else>
      <header>
        <button class="logout" @click="Logout">Logout</button>
        <div>Welcome, {{ state.username }}</div>
      </header>
      <section class="chat-box">
        <div v-for="message in state.messages" :key="message.key" :class="(message.username === state.username ? 'message current-user' : 'message')">
          <div class="message-box">
            <div class="username">{{ message.username }}</div>
            <div class="content">{{ message.content }}</div>
          </div>

        </div>
      </section>
      <footer>
        <form @submit.prevent="SendMessage">
          <input 
            type="text" 
            v-model="inputMessage" 
            placeholder="Write a message..." />
          <input 
            type="submit" 
            value="Send" />
        </form>
      </footer>
    </div>
  </div>
</template>

<script>
import { reactive, onMounted, ref } from 'vue';
import database from './database';

export default {
  name: 'App',
  setup() {
   
      const inputUsername = ref("");
      const inputMessage = ref("");

      const state = reactive({
        username: "",
        messages: []
      })

      const Login = () => {
        if (inputUsername.value != "" || inputUsername.value != null) {
          state.username = inputUsername.value;
          inputUsername.value = "";
        }
      }

      const Logout = () => {
        state.username = "";
      }

      const SendMessage = () => {
        const messagesReference = database.database().ref("messages");
        if (inputMessage.value === "" || inputMessage.value === null) {
          return;
        }

        const message = {
          username: state.username,
          content: inputMessage.value
        }

        messagesReference.push(message);
        inputMessage.value = "";
      } 

      onMounted(() => {
        const messagesReference = database.database().ref("messages");
        messagesReference.on('value', info => {
          const data = info.val();
          let messages = [];

          Object.keys(data).forEach(key => {
            messages.push({
              id: key,
              username: data[key].username,
              content: data[key].content
            });
          });
          state.messages = messages;
        })
      })

    return {
      inputUsername,
      state,
      inputMessage,
      Login,
      Logout,
      SendMessage
    }
  }
}
</script>

<style>

</style>
