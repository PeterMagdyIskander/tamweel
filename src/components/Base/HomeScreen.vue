<template>
    <div class="home-container">
        <Header :title="`Hi ${getUser.name}`" :emoji="'👋'"
            :subtitle="`Your goal is to ${getUser.goals[currentIndex].goalText}`">
        </Header>
        <slider @slide="setCurrentIndex"></slider>
        <div class="health-section">

            <div class="health-section-container">
                <div class="health-section-container-health"
                    :style="{ width: (getUser.goals[currentIndex].progress / 100) * 100 + '%' }">
                </div>
            </div>
            <h3>{{ getUser.goals[currentIndex].progress }}% Done</h3>
        </div>
        <div class="navigation-section">
            <div class="navigation-section-item" @click="navigateTo('/AddGoal')">
                🎯
            </div>
            <div class="navigation-section-item" @click="navigateTo('/AddTask')">
                📝
            </div>
            <div class="navigation-section-item" @click="navigateTo('/MyTasks')">
                🗒️
            </div>
        </div>
    </div>
</template>

<script>

import { mapGetters } from 'vuex';
import Header from '../Shared/Header.vue';
import Slider from '@/components/Shared/Slider.vue'
export default {
    name: "home-screen",
    components: {
        Header,
        Slider
    },
    computed: mapGetters(['getUser', 'getLoading']),
    data() {
        return {
            currentIndex: 0,
            
        }
    },
    methods: {
        setCurrentIndex(currentIndex) {
            this.currentIndex = currentIndex;
        },
        navigateTo(to) {
            this.$router.push(to);
        }
    }
}
</script>

<style lang="scss" scoped>
.home-container {
    padding-bottom: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 30px;
}


.health-section {
    &-container {
        width: 80%;
        height: 30px;
        border: 2px solid #3F8898;
        border-radius: 6px;
        padding: 5px;
        margin: 20px auto;

        &-health {
            height: 100%;
            background-color: #3F8898;
            border: 2px solid #3F8898;
            border-radius: 6px;
        }
    }

    h3 {
        font-family: 'pressstart2p';
    }
}

.navigation-section {
    width: 80%;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    column-gap: 25px;

    &-item {
        width: 70px;
        height: 45px;
        border: 2px solid #F5F5F5;
        background-color: #3F8898;
        border-radius: 6px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.75rem;
    }
}

</style>