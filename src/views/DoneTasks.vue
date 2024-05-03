<template>
    <div class="home-container">
        <Header :title="'Done Tasks'" :emoji="'🎯'"
            :subtitle="'One step closer to your goals. 🌟'">
        </Header>
        <div v-if="tasks.length > 0">
            <button @click="sorted = !sorted">Sorted by {{ sorted ? "Easiest" : "Hardest" }}</button>
            <task-card v-for="task in tasks" :key="task.id" :title="task.title" :id="task.id" :showDifficulty="true"
                :difficulty="task.difficulty"></task-card>
        </div>
        <inform-user  v-else :title="'You Haven\'t finished any tasks'" :emoji="'🕰️'">
        </inform-user>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import TaskCard from '@/components/Quest/TaskCard.vue';
import Header from '@/components/Shared/Header.vue';
import InformUser from '@/components/Shared/InformUser.vue';
export default {
    name: "done-tasks",
    components: {
        TaskCard,
        Header,
        InformUser
    },
    computed: {
        ...mapGetters(['getUser', 'getLoading']),

        tasks() {
            if (this.sorted) {
                return this.doneTasks.sort((a, b) => a.difficulty - b.difficulty)
            } else {
                return this.doneTasks.sort((a, b) => b.difficulty - a.difficulty)
            }
        },
        doneTasks() {
            return this.getUser.tasks.filter(task => task.done).sort((a, b) => a.difficulty - b.difficulty)
        },

    },
    data() {
        return {
            sorted: false,
        }
    },
    methods: {

    },
}
</script>
<style lang="scss" scoped>
.home-container {
    width: 100%;
    height: 100%;
    position: relative;
}

button {
    all: unset;
    width: fit-content;
    background-color: #444a5c;
    padding: 10px;
    font-family: 'ptmono';
    margin-bottom: 20px;
}

.active {
    background-color: #162041;
}

</style>