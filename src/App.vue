<template>
  <div id="sidemenu" v-if="getUser != null && getUser?.role != 'ADMIN'">
    <button class="sidemenu__btn" v-on:click="navOpen = !navOpen" v-bind:class="{ active: navOpen }">
      <span class="top"></span>
      <span class="mid"></span>
      <span class="bottom"></span>
    </button>
    <transition name="translateX">
      <nav v-show="navOpen">
        <div class="sidemenu__wrapper">
          <ul class="sidemenu__list">
            <li class="sidemenu__item" @click="closeMenu"><router-link to="/">Home</router-link></li>
            <li class="sidemenu__item" @click="closeMenu"><router-link to="/AddGoal">Set a goal</router-link></li>
            <li class="sidemenu__item" @click="closeMenu"><router-link to="/AddTask">Add a task</router-link></li>
            <li class="sidemenu__item" @click="closeMenu"><router-link to="/MyTasks">My tasks</router-link></li>
            <li class="sidemenu__item" @click="closeMenu"><router-link to="/DoneTasks">Achievements</router-link></li>
            <li class="sidemenu__item"><button @click="logout">Logout</button></li>
          </ul>
        </div>
      </nav>
    </transition>
  </div>

  <router-view />
</template>

<script>

import { mapGetters, mapActions } from 'vuex';
import { initialize } from '@/firebase';
const { firebaseApp, firestore, auth } = initialize();
export default {
  data() {
    return {
      navOpen: false,
    }
  }, methods: {
    ...mapActions(['updateUser',]),
    closeMenu() {
      this.navOpen = false;
    },
    logout() {
      this.updateUser(null);
      this.navOpen = false;
    }
  },
  computed: mapGetters(['getUser',]),
}
</script>
<style lang="scss">
html,
body {
  height: 100%;
  background-image: linear-gradient(#252a52 .1em, transparent .1em), linear-gradient(90deg, #252a52 .1em, transparent .1em);
  background-size: 2em 2em;
  background-color: #17182d !important;

  >* {
    color: #FFF;
  }
}

#app {
  height: 100%;
  position: relative;
}

button {
  all: unset;
  width: 100%;
  text-align: center;
}

#sidemenu {
  text-align: center;

  nav {
    width: 100%;
    height: 100%;
    background-image: linear-gradient(#252a52 .1em, transparent .1em), linear-gradient(90deg, #252a52 .1em, transparent .1em);
    background-size: 2em 2em;
    background-color: #17182d !important;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 99;
  }

  .sidemenu {
    &__btn {
      display: block;
      width: 50px;
      height: 50px;
      background: transparent;
      border: none;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 100;
      appearance: none;
      cursor: pointer;
      outline: none;

      span {
        display: block;
        width: 20px;
        height: 2px;
        margin: auto;
        background: white;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        transition: all .4s ease;

        &.top {
          transform: translateY(-8px);
        }

        &.bottom {
          transform: translateY(8px);
        }
      }

      &.active {
        .top {
          transform: rotate(-45deg);
        }

        .mid {
          transform: translateX(-20px) rotate(360deg);
          opacity: 0;
        }

        .bottom {
          transform: rotate(45deg);
        }
      }

    }

    &__wrapper {
      padding-top: 50px;
    }

    &__list {
      padding-top: 50px;
      list-style: none;
      padding: 0;
      margin: 0;
    }

    &__item {

      a,
      button {
        font-family: 'ptmono';
        text-decoration: none;
        line-height: 1.6em;
        font-size: 1.6em;
        padding: .5em;
        display: block;
        color: white;
        transition: .4s ease;

        &:hover {
          font-family: 'pressstart2p';
          color: #f4ee80;
          font-size: 1.5rem;
          text-shadow: 0 3px #a14759;
        }
      }

      button {
        width: fit-content;
        margin: 0 auto;
      }
    }
  }
}

.translateX-enter {
  transform: translateX(-200px);
  opacity: 0;
}

.translateX-enter-active,
.translateX-leave-active {
  transform-origin: top left 0;
  transition: .2s ease;
}

.translateX-leave-to {
  transform: translateX(-200px);
  opacity: 0;
}

a.router-link-active {
  all: unset;
  font-family: 'pressstart2p' !important;
  color: #f4ee80 !important;
  font-size: 1.5rem;
  text-shadow: 0 3px #a14759;
}
</style>
